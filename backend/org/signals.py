# org/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Organization, Department
from services.models import AuditLog  # assuming centralized audit model

@receiver(post_save, sender=Organization)
def log_org_save(sender, instance, created, **kwargs):
    action = "created" if created else "updated"
    AuditLog.objects.create(
        object_type="Organization",
        object_id=instance.id,
        action=action,
        performed_by=getattr(instance, "updated_by", None),  # optional
        description=f"Organization {instance.name} {action}"
    )

@receiver(post_delete, sender=Organization)
def log_org_delete(sender, instance, **kwargs):
    AuditLog.objects.create(
        object_type="Organization",
        object_id=instance.id,
        action="deleted",
        description=f"Organization {instance.name} deleted"
    )

# Repeat for Department
