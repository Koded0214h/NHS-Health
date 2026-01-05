from django.db import models
import uuid
from django.core.exceptions import ValidationError


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=10, unique=True, blank=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.code:
            # Generate a unique code like NHS-ABC123
            self.code = f"NHS-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def clean(self):
        # Validate that code doesn't contain special characters
        if self.code and not self.code.replace('-', '').isalnum():
            raise ValidationError("Organization code can only contain letters, numbers, and hyphens.")

    def __str__(self):
        return f"{self.name} ({self.code})"


class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        related_name="departments"
    )
    code = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("name", "organization")
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.code:
            # Generate department code like NHS-ABC123-D001
            org_code = self.organization.code if self.organization else "ORG"
            self.code = f"{org_code}-D{str(uuid.uuid4().int)[:4]}"
        super().save(*args, **kwargs)

    def clean(self):
        # Validate department code format
        if self.code and not self.code.replace('-', '').isalnum():
            raise ValidationError("Department code can only contain letters, numbers, and hyphens.")

    def __str__(self):
        return f"{self.name} ({self.organization.code})"