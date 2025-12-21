from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DisasterViewSet, FirstAidViewSet, ProtocolViewSet, EmergencyContactViewSet

router = DefaultRouter()
router.register(r'disasters', DisasterViewSet)
router.register(r'first-aid', FirstAidViewSet)
router.register(r'protocols', ProtocolViewSet)
router.register(r'emergency-contacts', EmergencyContactViewSet, basename='emergency-contacts')
urlpatterns = [
    path('safetyinfo/', include(router.urls)),
   
]