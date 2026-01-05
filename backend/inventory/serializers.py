from rest_framework import serializers
from django.core.validators import MinValueValidator
from .models import Item, Store, Inventory, InventoryMovement, VendorItem, StockAlert


class ItemSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = Item
        fields = [
            "id", "name", "sku", "description", "category", "unit_of_measure",
            "organization", "organization_name", "is_active", 
            "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class StoreSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Store
        fields = [
            "id", "name", "code", "store_type", "is_vendor",
            "contact_person", "contact_email", "contact_phone", "address",
            "organization", "organization_name", "department", "department_name",
            "is_active", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "code", "created_at", "updated_at"]


class InventorySerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    store = StoreSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(),
        write_only=True,
        source='item'
    )
    store_id = serializers.PrimaryKeyRelatedField(
        queryset=Store.objects.all(),
        write_only=True,
        source='store'
    )
    
    class Meta:
        model = Inventory
        fields = [
            "id", "item", "item_id", "store", "store_id",
            "quantity_available", "reserved_quantity", "total_quantity",
            "minimum_quantity", "maximum_quantity", "status",
            "location", "expiry_date", "batch_number",
            "needs_reorder", "available_quantity",
            "created_at", "updated_at", "last_checked"
        ]
        read_only_fields = [
            "id", "status", "total_quantity", "needs_reorder", 
            "available_quantity", "created_at", "updated_at"
        ]


class InventoryMovementSerializer(serializers.ModelSerializer):
    inventory = InventorySerializer(read_only=True)
    inventory_id = serializers.PrimaryKeyRelatedField(
        queryset=Inventory.objects.all(),
        write_only=True,
        source='inventory'
    )
    performed_by_name = serializers.CharField(source='performed_by.full_name', read_only=True)
    destination_store_name = serializers.CharField(source='destination_store.name', read_only=True)
    
    class Meta:
        model = InventoryMovement
        fields = [
            "id", "inventory", "inventory_id", "movement_type", "quantity",
            "source_type", "source_id", "performed_by", "performed_by_name",
            "destination_store", "destination_store_name", "notes",
            "created_at"
        ]
        read_only_fields = ["id", "created_at", "performed_by"]


class CreateInventoryMovementSerializer(serializers.ModelSerializer):
    """Serializer for creating inventory movements with validation"""
    
    class Meta:
        model = InventoryMovement
        fields = ["inventory", "movement_type", "quantity", "source_type", "source_id", "notes"]
    
    def validate(self, data):
        inventory = data['inventory']
        movement_type = data['movement_type']
        quantity = data['quantity']
        
        # Validate stock availability for stock out and reserve
        if movement_type in ['stock_out', 'reserve']:
            if inventory.quantity_available < quantity:
                raise serializers.ValidationError(
                    f"Insufficient stock. Available: {inventory.quantity_available}"
                )
        
        # Validate reserved quantity for release
        if movement_type == 'release':
            if inventory.reserved_quantity < quantity:
                raise serializers.ValidationError(
                    f"Insufficient reserved quantity. Reserved: {inventory.reserved_quantity}"
                )
        
        return data


class VendorItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    vendor = StoreSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(),
        write_only=True,
        source='item'
    )
    vendor_id = serializers.PrimaryKeyRelatedField(
        queryset=Store.objects.filter(store_type='vendor'),
        write_only=True,
        source='vendor'
    )
    
    class Meta:
        model = VendorItem
        fields = [
            "id", "vendor", "vendor_id", "item", "item_id",
            "price", "currency", "lead_time_days", "minimum_order_quantity",
            "is_active", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class StockAlertSerializer(serializers.ModelSerializer):
    inventory = InventorySerializer(read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.full_name', read_only=True)
    
    class Meta:
        model = StockAlert
        fields = [
            "id", "inventory", "alert_type", "severity", "message",
            "is_resolved", "resolved_by", "resolved_by_name", "resolved_at",
            "created_at"
        ]
        read_only_fields = ["id", "created_at", "resolved_at"]