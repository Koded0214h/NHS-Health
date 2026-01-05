from django.db import models
from django.core.validators import MinValueValidator
from org.models import Organization, Department
from users.models import CustomUser
import uuid


# ----------------------------
# Item / Product
# ----------------------------
class Item(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    
    # Item classification
    category = models.CharField(max_length=100, blank=True)  # e.g., Medical, Office, Surgical
    unit_of_measure = models.CharField(max_length=20, default="units")  # e.g., units, boxes, packs
    
    # Organization
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        related_name="items"
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['organization', 'sku']),
            models.Index(fields=['organization', 'category']),
        ]

    def __str__(self):
        return f"{self.name} ({self.sku})"


# ----------------------------
# Store (Internal or Vendor)
# ----------------------------
class Store(models.Model):
    STORE_TYPES = [
        ('internal', 'Internal Store'),
        ('vendor', 'External Vendor'),
        ('ward', 'Hospital Ward'),
        ('clinic', 'Clinic'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, blank=True)  # e.g., STORE-001, VEND-001
    
    # Contact info
    contact_person = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    # Store type
    store_type = models.CharField(max_length=20, choices=STORE_TYPES, default='internal')
    is_vendor = models.BooleanField(default=False)  # Legacy field for compatibility
    
    # Organization
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        related_name="stores"
    )
    
    # Department (optional, for internal stores)
    department = models.ForeignKey(
        Department, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="stores"
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        unique_together = ['organization', 'code']
        indexes = [
            models.Index(fields=['organization', 'store_type']),
            models.Index(fields=['organization', 'is_active']),
        ]

    def save(self, *args, **kwargs):
        # Auto-set is_vendor based on store_type
        if self.store_type == 'vendor':
            self.is_vendor = True
        else:
            self.is_vendor = False
            
        # Auto-generate code if not provided
        if not self.code:
            prefix = 'VEND' if self.store_type == 'vendor' else 'STORE'
            self.code = f"{prefix}-{uuid.uuid4().hex[:6].upper()}"
        
        super().save(*args, **kwargs)

    def __str__(self):
        store_type = self.get_store_type_display()
        return f"{self.name} ({store_type})"


# ----------------------------
# Inventory per Store
# ----------------------------
class Inventory(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('low_stock', 'Low Stock'),
        ('out_of_stock', 'Out of Stock'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(
        Item, 
        on_delete=models.CASCADE, 
        related_name="inventories"
    )
    store = models.ForeignKey(
        Store, 
        on_delete=models.CASCADE, 
        related_name="inventories"
    )
    
    # Stock levels
    quantity_available = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    reserved_quantity = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    minimum_quantity = models.PositiveIntegerField(default=10, help_text="Reorder threshold")
    maximum_quantity = models.PositiveIntegerField(default=1000, help_text="Maximum stock capacity")
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # Location within store
    location = models.CharField(max_length=100, blank=True, help_text="e.g., Shelf A1, Room 101")
    
    # Expiry tracking (if applicable)
    expiry_date = models.DateField(null=True, blank=True)
    batch_number = models.CharField(max_length=50, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_checked = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("item", "store")
        ordering = ['item__name']
        indexes = [
            models.Index(fields=['item', 'store']),
            models.Index(fields=['store', 'status']),
            models.Index(fields=['expiry_date']),
        ]

    def __str__(self):
        return f"{self.item.name} @ {self.store.name} ({self.quantity_available} available)"
    
    @property
    def total_quantity(self):
        return self.quantity_available + self.reserved_quantity
    
    @property
    def available_quantity(self):
        return self.quantity_available
    
    @property
    def needs_reorder(self):
        return self.quantity_available <= self.minimum_quantity
    
    def update_status(self):
        """Update inventory status based on quantity"""
        if self.quantity_available <= 0:
            self.status = 'out_of_stock'
        elif self.quantity_available <= self.minimum_quantity:
            self.status = 'low_stock'
        else:
            self.status = 'available'
        self.save(update_fields=['status'])


# ----------------------------
# Inventory Movements
# ----------------------------
class InventoryMovement(models.Model):
    MOVEMENT_TYPES = [
        ("stock_in", "Stock In"),
        ("stock_out", "Stock Out"),
        ("reserve", "Reserve"),
        ("release", "Release"),
        ("adjustment", "Adjustment"),
        ("transfer", "Transfer"),
        ("write_off", "Write Off"),
    ]
    
    SOURCE_TYPES = [
        ("manual", "Manual Entry"),
        ("requisition", "Requisition"),
        ("purchase_order", "Purchase Order"),
        ("transfer_order", "Transfer Order"),
        ("stock_take", "Stock Take"),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inventory = models.ForeignKey(
        Inventory, 
        on_delete=models.CASCADE, 
        related_name="movements"
    )
    
    # Movement details
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    
    # Source tracking
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES, default='manual')
    source_id = models.CharField(max_length=50, blank=True)  # e.g., requisition ID, PO number
    
    # User who performed the action
    performed_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name="inventory_movements"
    )
    
    # Destination store (for transfers)
    destination_store = models.ForeignKey(
        Store, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="incoming_transfers"
    )
    
    # Notes
    notes = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['inventory', 'created_at']),
            models.Index(fields=['movement_type', 'created_at']),
            models.Index(fields=['performed_by', 'created_at']),
        ]

    def __str__(self):
        return f"{self.get_movement_type_display()} {self.quantity} of {self.inventory.item.name}"
    
    def save(self, *args, **kwargs):
        # Update inventory when movement is saved
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            self.update_inventory()

    def update_inventory(self):
        """Update inventory quantities based on movement type"""
        inventory = self.inventory
        
        if self.movement_type == 'stock_in':
            inventory.quantity_available += self.quantity
        elif self.movement_type == 'stock_out':
            inventory.quantity_available -= self.quantity
        elif self.movement_type == 'reserve':
            if inventory.quantity_available >= self.quantity:
                inventory.quantity_available -= self.quantity
                inventory.reserved_quantity += self.quantity
        elif self.movement_type == 'release':
            if inventory.reserved_quantity >= self.quantity:
                inventory.reserved_quantity -= self.quantity
                inventory.quantity_available += self.quantity
        elif self.movement_type == 'adjustment':
            # Could be positive or negative adjustment
            # For simplicity, treat as stock_in if positive, stock_out if negative
            # You might want separate fields for adjustment_value
            pass
        elif self.movement_type == 'transfer':
            # Handle transfers between stores
            if self.destination_store:
                # This would create another movement in the destination store
                pass
        
        inventory.save()
        inventory.update_status()


# ----------------------------
# Vendor-Item Mapping
# ----------------------------
class VendorItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vendor = models.ForeignKey(
        Store, 
        on_delete=models.CASCADE, 
        limit_choices_to={'store_type': 'vendor'},
        related_name="vendor_items"
    )
    item = models.ForeignKey(
        Item, 
        on_delete=models.CASCADE, 
        related_name="vendor_items"
    )
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='GBP')
    
    # Supply details
    lead_time_days = models.PositiveIntegerField(default=7)
    minimum_order_quantity = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("vendor", "item")
        ordering = ['item__name']
        indexes = [
            models.Index(fields=['vendor', 'item']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.item.name} from {self.vendor.name} (£{self.price})"


# ----------------------------
# Stock Alerts
# ----------------------------
class StockAlert(models.Model):
    ALERT_TYPES = [
        ('low_stock', 'Low Stock'),
        ('expiry', 'Near Expiry'),
        ('out_of_stock', 'Out of Stock'),
        ('over_stock', 'Over Stock'),
    ]
    
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inventory = models.ForeignKey(
        Inventory, 
        on_delete=models.CASCADE, 
        related_name="alerts"
    )
    
    # Alert details
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    message = models.TextField()
    
    # Status
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="resolved_alerts"
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['inventory', 'is_resolved']),
            models.Index(fields=['alert_type', 'created_at']),
        ]

    def __str__(self):
        return f"{self.get_alert_type_display()} - {self.inventory.item.name}"