from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, UserViewSet

router = DefaultRouter()

# 1. Admin User CRUD -> /api/v1/users/
router.register(r'users', UserViewSet, basename='user')

# 2. Auth Actions -> /api/v1/auth/register/, /api/v1/auth/login/
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]