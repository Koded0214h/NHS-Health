from rest_framework import serializers, viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Organization, Department
from .serializers import (
    OrganizationSerializer, 
    DepartmentSerializer,
    CreateOrganizationSerializer,
    UpdateOrganizationSerializer
)


class IsAdminOrOperations(permissions.BasePermission):
    """
    Permission to only allow admin or operations users to create/modify.
    All authenticated users can view.
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        # Only allow POST, PUT, PATCH, DELETE for admin/operations
        return request.user.is_authenticated and (
            request.user.is_superuser or 
            request.user.role in ["operations", "admin"]
        )


class IsInOrganization(permissions.BasePermission):
    """
    Permission to ensure users can only access resources in their organization.
    Admins can access all organizations.
    """
    def has_object_permission(self, request, view, obj):
        # Admins can access everything
        if request.user.is_superuser or request.user.role == 'admin':
            return True
        
        # For Department objects, check if user's org matches department's org
        if hasattr(obj, 'organization'):
            return obj.organization == request.user.organization
        
        # For Organization objects, check if user belongs to this org
        if isinstance(obj, Organization):
            return obj == request.user.organization
        
        return False


class OrganizationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing organizations.
    """
    queryset = Organization.objects.filter(is_active=True).prefetch_related('departments')
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOperations]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]  # Removed DjangoFilterBackend
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrganizationSerializer
        elif self.action in ['update', 'partial_update']:
            return UpdateOrganizationSerializer
        return OrganizationSerializer

    def get_queryset(self):
        """
        Multi-tenant isolation: users only see organizations they have access to.
        """
        user = self.request.user
        
        # Superusers and admin role can see all organizations
        if user.is_superuser or user.role == 'admin':
            return self.queryset
        
        # Operations role can see all organizations
        if user.role == 'operations':
            return self.queryset
        
        # Regular users can only see their own organization
        if user.organization:
            return self.queryset.filter(id=user.organization.id)
        
        # Users without organization can't see any
        return Organization.objects.none()

    def perform_create(self, serializer):
        """Auto-generate code if not provided"""
        if not serializer.validated_data.get('code'):
            # Let the model's save method handle code generation
            pass
        serializer.save()

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate an organization (soft delete)"""
        if not request.user.is_superuser and request.user.role != 'admin':
            return Response(
                {"error": "Only administrators can deactivate organizations"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        organization = self.get_object()
        organization.is_active = False
        organization.save()
        
        return Response({"message": f"Organization {organization.name} has been deactivated"})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a deactivated organization"""
        if not request.user.is_superuser and request.user.role != 'admin':
            return Response(
                {"error": "Only administrators can activate organizations"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        organization = self.get_object()
        organization.is_active = True
        organization.save()
        
        return Response({"message": f"Organization {organization.name} has been activated"})


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing departments.
    """
    queryset = Department.objects.filter(is_active=True).select_related('organization')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOperations, IsInOrganization]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]  # Removed DjangoFilterBackend
    search_fields = ['name', 'code', 'organization__name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """
        Multi-tenant isolation: filter departments based on user's organization.
        """
        user = self.request.user
        
        # Superusers and admin role can see all departments
        if user.is_superuser or user.role == 'admin':
            return self.queryset
        
        # Operations role can see all departments
        if user.role == 'operations':
            return self.queryset
        
        # Regular users can only see departments in their organization
        if user.organization:
            return self.queryset.filter(organization=user.organization)
        
        # Users without organization can't see any departments
        return Department.objects.none()

    def perform_create(self, serializer):
        """Ensure user has permission to create department in this organization"""
        user = self.request.user
        organization = serializer.validated_data.get('organization')
        
        # Check if user can create department in this organization
        if not user.is_superuser and user.role not in ['admin', 'operations']:
            # Regular users can only create departments in their own organization
            if organization != user.organization:
                raise serializers.ValidationError(
                    {"organization": "You can only create departments in your own organization."}
                )
        
        serializer.save()

    def perform_update(self, serializer):
        """Ensure user has permission to update department"""
        user = self.request.user
        organization = serializer.validated_data.get('organization', self.get_object().organization)
        
        # Check if user can update department in this organization
        if not user.is_superuser and user.role not in ['admin', 'operations']:
            if organization != user.organization:
                raise serializers.ValidationError(
                    {"organization": "You can only update departments in your own organization."}
                )
        
        serializer.save()

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a department (soft delete)"""
        department = self.get_object()
        
        # Check permission
        if not self._has_organization_permission(request.user, department.organization):
            return Response(
                {"error": "You don't have permission to deactivate this department"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        department.is_active = False
        department.save()
        
        return Response({"message": f"Department {department.name} has been deactivated"})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a deactivated department"""
        department = self.get_object()
        
        # Check permission
        if not self._has_organization_permission(request.user, department.organization):
            return Response(
                {"error": "You don't have permission to activate this department"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        department.is_active = True
        department.save()
        
        return Response({"message": f"Department {department.name} has been activated"})

    def _has_organization_permission(self, user, organization):
        """Helper method to check organization permissions"""
        if user.is_superuser or user.role == 'admin':
            return True
        if user.role == 'operations':
            return True
        return user.organization == organization

    @action(detail=False, methods=['get'])
    def by_organization(self, request):
        """Get all departments for a specific organization"""
        organization_id = request.query_params.get('organization_id')
        
        if not organization_id:
            return Response(
                {"error": "organization_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            organization = Organization.objects.get(id=organization_id)
            
            # Check if user has permission to view departments in this organization
            user = request.user
            if not (user.is_superuser or user.role in ['admin', 'operations']) and organization != user.organization:
                return Response(
                    {"error": "You don't have permission to view departments in this organization"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            departments = Department.objects.filter(
                organization=organization, 
                is_active=True
            )
            serializer = self.get_serializer(departments, many=True)
            return Response(serializer.data)
            
        except Organization.DoesNotExist:
            return Response(
                {"error": "Organization not found"},
                status=status.HTTP_404_NOT_FOUND
            )