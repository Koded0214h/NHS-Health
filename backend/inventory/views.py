from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F, Sum
from django.shortcuts import get_object_or_404

from .models import Item, Store, Inventory, InventoryMovement, VendorItem, StockAlert
from .serializers import (
    ItemSerializer, StoreSerializer, InventorySerializer, 
    InventoryMovementSerializer, VendorItemSerializer, StockAlertSerializer,
    CreateInventoryMovementSerializer
)


# Permissions
class IsInventoryAdmin(permissions.BasePermission):
    """Permission for inventory management"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Allow all authenticated users to view
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Only allow write operations for inventory roles
        return request.user.role in ["operations", "store_manager", "admin", "hod"]


class IsInOrganization(permissions.BasePermission):
    """Ensure users can only access resources in their organization"""
    def has_object_permission(self, request, view, obj):
        # Admins can access everything
        if request.user.is_superuser or request.user.role == 'admin':
            return True
        
        # Check if object belongs to user's organization
        if hasattr(obj, 'organization'):
            return obj.organization == request.user.organization
        
        # For inventory, check through item
        if hasattr(obj, 'item'):
            return obj.item.organization == request.user.organization
        
        # For stores
        if hasattr(obj, 'store'):
            return obj.store.organization == request.user.organization
        
        return False


# ViewSets
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.filter(is_active=True).select_related('organization')
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsInventoryAdmin, IsInOrganization]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'sku', 'description']
    ordering_fields = ['name', 'sku', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter by user's organization"""
        user = self.request.user
        
        # Admins can see all items
        if user.is_superuser or user.role == 'admin':
            return self.queryset
        
        # Others can only see items in their organization
        if user.organization:
            return self.queryset.filter(organization=user.organization)
        
        return Item.objects.none()

    def perform_create(self, serializer):
        """Set organization from user if not provided"""
        if not serializer.validated_data.get('organization'):
            serializer.save(organization=self.request.user.organization)
        else:
            serializer.save()


class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.filter(is_active=True).select_related('organization', 'department')
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated, IsInventoryAdmin, IsInOrganization]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['store_type', 'is_vendor', 'is_active']
    search_fields = ['name', 'code', 'contact_person', 'contact_email']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter by user's organization"""
        user = self.request.user
        
        if user.is_superuser or user.role == 'admin':
            return self.queryset
        
        if user.organization:
            return self.queryset.filter(organization=user.organization)
        
        return Store.objects.none()


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.select_related('item', 'store')
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated, IsInventoryAdmin, IsInOrganization]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['store', 'status', 'item__category']
    search_fields = ['item__name', 'item__sku', 'location', 'batch_number']
    ordering_fields = ['item__name', 'quantity_available', 'updated_at']
    ordering = ['item__name']

    def get_queryset(self):
        """Multi-org isolation"""
        user = self.request.user
        
        if user.is_superuser or user.role == 'admin':
            return self.queryset
        
        if user.organization:
            return self.queryset.filter(item__organization=user.organization)
        
        return Inventory.objects.none()

    @action(detail=True, methods=['get'])
    def movements(self, request, pk=None):
        """Get all movements for this inventory"""
        inventory = self.get_object()
        movements = inventory.movements.all().order_by('-created_at')
        serializer = InventoryMovementSerializer(movements, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get all low stock items"""
        queryset = self.get_queryset().filter(status='low_stock')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        """Get all out of stock items"""
        queryset = self.get_queryset().filter(status='out_of_stock')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get inventory summary"""
        queryset = self.get_queryset()
        
        summary = {
            'total_items': queryset.count(),
            'total_quantity': queryset.aggregate(total=Sum('quantity_available'))['total'] or 0,
            'total_reserved': queryset.aggregate(total=Sum('reserved_quantity'))['total'] or 0,
            'low_stock_count': queryset.filter(status='low_stock').count(),
            'out_of_stock_count': queryset.filter(status='out_of_stock').count(),
            'stores_count': queryset.values('store').distinct().count(),
            'categories_count': queryset.values('item__category').distinct().count(),
        }
        
        return Response(summary)


class InventoryMovementViewSet(viewsets.ModelViewSet):
    queryset = InventoryMovement.objects.select_related(
        'inventory', 'performed_by', 'destination_store'
    ).order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated, IsInventoryAdmin, IsInOrganization]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['movement_type', 'source_type', 'performed_by']
    search_fields = ['inventory__item__name', 'source_id', 'notes']
    ordering_fields = ['created_at', 'quantity']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateInventoryMovementSerializer
        return InventoryMovementSerializer

    def get_queryset(self):
        """Multi-org isolation"""
        user = self.request.user
        
        if user.is_superuser or user.role == 'admin':
            return self.queryset
        
        if user.organization:
            return self.queryset.filter(inventory__item__organization=user.organization)
        
        return InventoryMovement.objects.none()

    def perform_create(self, serializer):
        """Set performed_by to current user"""
        serializer.save(performed_by=self.request.user)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent movements"""
        queryset = self.get_queryset()[:50]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_stock_in(self, request):
        """Bulk stock in for multiple items"""
        # Implementation for bulk operations
        pass


class VendorItemViewSet(viewsets.ModelViewSet):
    queryset = VendorItem.objects.filter(is_active=True).select_related('vendor', 'item')
    serializer_class = VendorItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsInventoryAdmin, IsInOrganization]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['vendor', 'is_active']
    search_fields = ['item__name', 'item__sku', 'vendor__name']
    ordering_fields = ['item__name', 'price', 'lead_time_days']
    ordering = ['item__name']

    def get_queryset(self):
        """Multi-org isolation"""
        user = self.request.user
        
        if user.is_superuser or user.role == 'admin':
            return self.queryset
        
        if user.organization:
            return self.queryset.filter(
                Q(vendor__organization=user.organization) &
                Q(item__organization=user.organization)
            )
        
        return VendorItem.objects.none()


class StockAlertViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockAlert.objects.filter(is_resolved=False).select_related('inventory', 'resolved_by')
    serializer_class = StockAlertSerializer
    permission_classes = [permissions.IsAuthenticated, IsInventoryAdmin, IsInOrganization]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['alert_type', 'severity', 'is_resolved']
    ordering_fields = ['created_at', 'severity']
    ordering = ['-created_at']

    def get_queryset(self):
        """Multi-org isolation"""
        user = self.request.user
        
        if user.is_superuser or user.role == 'admin':
            return self.queryset
        
        if user.organization:
            return self.queryset.filter(inventory__item__organization=user.organization)
        
        return StockAlert.objects.none()

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve an alert"""
        alert = self.get_object()
        alert.is_resolved = True
        alert.resolved_by = request.user
        alert.resolved_at = timezone.now()
        alert.save()
        
        return Response({"message": "Alert resolved successfully"})