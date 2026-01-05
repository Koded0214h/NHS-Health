from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItemViewSet, StoreViewSet, InventoryViewSet, 
    InventoryMovementViewSet, VendorItemViewSet, StockAlertViewSet
)

router = DefaultRouter()
router.register(r"items", ItemViewSet)
router.register(r"stores", StoreViewSet)
router.register(r"inventories", InventoryViewSet)
router.register(r"inventory-movements", InventoryMovementViewSet)
router.register(r"vendor-items", VendorItemViewSet)
router.register(r"stock-alerts", StockAlertViewSet)

urlpatterns = [
    path("", include(router.urls)),
]