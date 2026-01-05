from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RequisitionViewSet

router = DefaultRouter()
router.register(r"requisitions", RequisitionViewSet, basename="requisitions")

urlpatterns = [
    path("", include(router.urls)),
]
