from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, AdminNotificationViewSet, UserDropdownViewSet
router = DefaultRouter()
# ... your other routes ...
router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'admin/notifications', AdminNotificationViewSet, basename='admin-notifications')
router.register(r'admin/users', UserDropdownViewSet, basename='admin-users')
urlpatterns = [
    path('', include(router.urls)),
]