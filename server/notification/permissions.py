from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user_jwt
            and request.user_jwt.get("role") == "admin"
        )
