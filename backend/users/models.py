from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, Group, Permission
from django.core.exceptions import ValidationError
from org.models import Organization, Department

class CustomUserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        
        # Set defaults
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_suspended", False)
        
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(email, full_name, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    NOTIFICATION_LEVEL = [
        ("all", "All"),
        ("approvals", "Only Approvals"),
        ("escalations", "Only Escalations"),
    ]
    
    ROLES = [
        ("admin", "Administrator"),
        ("officer", "Officer"),
        ("hod", "Head of Department"),
        ("store_manager", "Store Manager"),
        ("operations", "Operations"),
    ]

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, blank=True, null=True)

    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        null=True,  # Allow null for new users
        blank=True
    )
    department = models.ForeignKey(
        Department, 
        on_delete=models.SET_NULL,  # Use SET_NULL instead of CASCADE
        null=True, 
        blank=True
    )
    role = models.CharField(max_length=50, choices=ROLES, default="officer")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)

    email_notifications = models.BooleanField(default=True)
    notification_level = models.CharField(max_length=20, choices=NOTIFICATION_LEVEL, default="all")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    groups = models.ManyToManyField(
        Group, 
        related_name="custom_users", 
        blank=True,
        verbose_name="groups",
        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups."
    )
    user_permissions = models.ManyToManyField(
        Permission, 
        related_name="custom_user_permissions", 
        blank=True,
        verbose_name="user permissions",
        help_text="Specific permissions for this user."
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.full_name} ({self.email})"

    def clean(self):
        # Validate that if department is set, it belongs to the organization
        if self.department and self.organization:
            if self.department.organization != self.organization:
                raise ValidationError("Department must belong to the selected organization.")

    @property
    def can_login(self):
        """Check if user is allowed to login"""
        return self.is_active and not self.is_suspended

    @property
    def is_administrator(self):
        """Check if user is an admin"""
        return self.role == "admin" or self.is_superuser