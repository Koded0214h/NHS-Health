from rest_framework import serializers
from .models import Organization, Department
from django.core.exceptions import ValidationError


class DepartmentSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    organization_code = serializers.CharField(source='organization.code', read_only=True)
    
    class Meta:
        model = Department
        fields = ["id", "name", "code", "organization", "organization_name", 
                 "organization_code", "description", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "code", "created_at", "updated_at"]
        extra_kwargs = {
            'organization': {'required': True}
        }


class OrganizationSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    department_count = serializers.IntegerField(source='departments.count', read_only=True)
    
    class Meta:
        model = Organization
        fields = ["id", "name", "code", "address", "phone", "email", 
                 "is_active", "departments", "department_count", "created_at", "updated_at"]
        read_only_fields = ["id", "code", "created_at", "updated_at"]
    
    def validate_code(self, value):
        """Validate organization code format"""
        if value and not value.replace('-', '').isalnum():
            raise serializers.ValidationError("Organization code can only contain letters, numbers, and hyphens.")
        return value


class CreateOrganizationSerializer(serializers.ModelSerializer):
    """Serializer specifically for creating organizations"""
    
    class Meta:
        model = Organization
        fields = ["name", "code", "address", "phone", "email"]
        extra_kwargs = {
            'code': {'required': False, 'allow_blank': True}
        }


class UpdateOrganizationSerializer(serializers.ModelSerializer):
    """Serializer for updating organizations (excludes certain fields)"""
    
    class Meta:
        model = Organization
        fields = ["name", "address", "phone", "email", "is_active"]
        read_only_fields = ["code"]