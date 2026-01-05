from rest_framework import serializers
from .models import Requisition, AuditLog
from inventory.serializers import InventorySerializer
from users.serializers import UserSerializer
from org.serializers import DepartmentSerializer, OrganizationSerializer

class RequisitionSerializer(serializers.ModelSerializer):
    requested_by = UserSerializer(read_only=True)
    hod = UserSerializer(read_only=True)
    item = InventorySerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = Requisition
        fields = "__all__"


class RequisitionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requisition
        fields = ["organization", "department", "item", "quantity", "priority", "reason"]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["requested_by"] = user
        req = Requisition.objects.create(**validated_data)

        # Create initial audit log
        AuditLog.objects.create(
            object_type="Requisition",
            object_id=str(req.id),
            action="requested",
            performed_by=user,
            description=f"Requisition requested by {user.full_name}"
        )
        return req
