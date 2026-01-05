from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Requisition, AuditLog
from .serializers import RequisitionSerializer, RequisitionCreateSerializer
from inventory.models import Inventory, InventoryMovement
from django.core.mail import send_mail
from django.conf import settings

class IsHODOrOperations(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["hod", "operations", "admin"]


class IsStoreManagerOrOperations(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["store_manager", "operations", "admin"]


class RequisitionViewSet(viewsets.ModelViewSet):
    queryset = Requisition.objects.all()
    serializer_class = RequisitionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create"]:
            return RequisitionCreateSerializer
        return RequisitionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ["operations", "admin"]:
            return Requisition.objects.all()
        return Requisition.objects.filter(department=user.department)

    # -----------------------
    # Approve / Reject Actions
    # -----------------------
    @action(detail=True, methods=["post"], permission_classes=[IsHODOrOperations])
    def approve(self, request, pk=None):
        req = self.get_object()
        req.status = "approved"
        req.hod = request.user
        req.save()

        AuditLog.objects.create(
            object_type="Requisition",
            object_id=str(req.id),
            action="approved",
            performed_by=request.user,
            description=f"Requisition approved by {request.user.full_name}"
        )

        # Send email
        send_mail(
            "Requisition Approved",
            f"Requisition {req.id} approved by HOD",
            settings.DEFAULT_FROM_EMAIL,
            [req.requested_by.email],
        )

        return Response({"status": "approved"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsHODOrOperations])
    def reject(self, request, pk=None):
        req = self.get_object()
        req.status = "rejected"
        req.hod = request.user
        req.save()

        AuditLog.objects.create(
            object_type="Requisition",
            object_id=str(req.id),
            action="rejected",
            performed_by=request.user,
            description=f"Requisition rejected by {request.user.full_name}"
        )

        send_mail(
            "Requisition Rejected",
            f"Requisition {req.id} rejected by HOD",
            settings.DEFAULT_FROM_EMAIL,
            [req.requested_by.email],
        )

        return Response({"status": "rejected"}, status=status.HTTP_200_OK)

    # -----------------------
    # Reserve Stock
    # -----------------------
    @action(detail=True, methods=["post"], permission_classes=[IsStoreManagerOrOperations])
    def reserve_stock(self, request, pk=None):
        req = self.get_object()
        inventory = req.item

        if inventory.quantity_available < req.quantity:
            return Response({"error": "Insufficient stock"}, status=400)

        inventory.quantity_available -= req.quantity
        inventory.reserved_quantity += req.quantity
        inventory.save()

        req.status = "reserved"
        req.save()

        AuditLog.objects.create(
            object_type="Requisition",
            object_id=str(req.id),
            action="reserved",
            performed_by=request.user,
            description=f"{req.quantity} of {req.item.item.name} reserved"
        )

        return Response({"status": "reserved"}, status=200)

# -----------------------
# Deliver Action
# -----------------------
@action(detail=True, methods=["post"], permission_classes=[IsStoreManagerOrOperations])
def deliver(self, request, pk=None):
    req = self.get_object()

    if req.status != "reserved":
        return Response({"error": "Requisition must be reserved before delivery"}, status=400)

    # Reduce reserved, stock already reduced in reservation
    inventory = req.item
    inventory.reserved_quantity -= req.quantity
    inventory.save()

    # Log inventory movement
    InventoryMovement.objects.create(
        inventory=inventory,
        movement_type="stock_out",
        quantity=req.quantity,
        performed_by=request.user,
        reference=str(req.id)
    )

    req.status = "delivered"
    req.save()

    # Audit log
    AuditLog.objects.create(
        object_type="Requisition",
        object_id=str(req.id),
        action="delivered",
        performed_by=request.user,
        description=f"{req.quantity} of {req.item.item.name} delivered"
    )

    # Email notification
    send_mail(
        "Requisition Delivered",
        f"Requisition {req.id} has been delivered to {req.department.name}",
        settings.DEFAULT_FROM_EMAIL,
        [req.requested_by.email, req.hod.email],
    )

    return Response({"status": "delivered"}, status=200)


# -----------------------
# Verify / Complete Action
# -----------------------
@action(detail=True, methods=["post"], permission_classes=[IsHODOrOperations])
def verify(self, request, pk=None):
    req = self.get_object()

    if req.status != "delivered":
        return Response({"error": "Requisition must be delivered before verification"}, status=400)

    req.status = "verified"
    req.save()

    # Audit log
    AuditLog.objects.create(
        object_type="Requisition",
        object_id=str(req.id),
        action="verified",
        performed_by=request.user,
        description=f"Requisition {req.id} verified by HOD"
    )

    # Optional: mark complete if verification equals completion
    req.status = "completed"
    req.save()

    AuditLog.objects.create(
        object_type="Requisition",
        object_id=str(req.id),
        action="completed",
        performed_by=request.user,
        description=f"Requisition {req.id} completed"
    )

    # Email notification
    send_mail(
        "Requisition Completed",
        f"Requisition {req.id} has been fully completed",
        settings.DEFAULT_FROM_EMAIL,
        [req.requested_by.email, req.hod.email],
    )

    return Response({"status": "completed"}, status=200)
