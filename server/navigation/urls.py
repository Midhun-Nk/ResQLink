from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MapLocationViewSet

router = DefaultRouter()
router.register(r'map-locations', MapLocationViewSet, basename='map-locations')

urlpatterns = [
    path('', include(router.urls)),
   
]