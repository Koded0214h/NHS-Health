from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationViewSet, DepartmentViewSet

router = DefaultRouter()
router.register(r"organizations", OrganizationViewSet, basename="organizations")
router.register(r"departments", DepartmentViewSet, basename="departments")

urlpatterns = [
    path("", include(router.urls)),
]