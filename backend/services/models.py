from django.db import models
from django.utils import timezone
from users.models import CustomUser
from org.models import Department, Organization
from inventory.models import Inventory
import uuid

# ----------------------------
# Requisition
# ----------------------------
class Requisition(models.Model):
    STATUS_CHOICES = [
        ("requested", "Requested"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("reserved", "Reserved"),
        ("delivered", "Delivered"),
        ("verified", "Verified"),
        ("completed", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="requisitions")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="requisitions")
    requested_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name="requested_requisitions")
    hod = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_requisitions")
    
    item = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name="requisitions")
    quantity = models.PositiveIntegerField()
    priority = models.CharField(max_length=20, default="normal")  # normal, urgent, critical
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="requested")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Req-{self.id} ({self.item.item.name})"


# ----------------------------
# Audit Log
# ----------------------------
class AuditLog(models.Model):
    object_type = models.CharField(max_length=50)
    object_id = models.CharField(max_length=50)
    action = models.CharField(max_length=50)
    performed_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.object_type}-{self.object_id} {self.action}"
