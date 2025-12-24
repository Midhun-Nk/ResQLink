from rest_framework.permissions import BasePermission

# --- 1. SUPER ADMIN ONLY ---
class IsSuperAdmin(BasePermission):
    """
    Allows access only to Super Admins.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'super_admin')

# --- 2. ADMIN & SUPER ADMIN ---
class IsAdmin(BasePermission):
    """
    Allows access to Admins and Super Admins.
    """
    def has_permission(self, request, view):
        # Check if logged in first
        if not request.user or not request.user.is_authenticated:
            return False
        # Check role
        return request.user.role in ['super_admin', 'admin']

# --- 3. MANAGER (Hierarchy: Super > Admin > Manager) ---
class IsManager(BasePermission):
    """
    Allows access to Managers, Admins, and Super Admins.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['super_admin', 'admin', 'manager']

# --- 4. DYNAMIC ROLE CHECKER (The "Middleware" Factory) ---
def HasRole(allowed_roles):
    """
    Factory function to create a permission class on the fly.
    Usage: permission_classes = [HasRole(['agent', 'manager'])]
    """
    class RolePermission(BasePermission):
        def has_permission(self, request, view):
            if not request.user or not request.user.is_authenticated:
                return False
            
            # Super Admin always gets a pass (Optional logic)
            if request.user.role == 'super_admin':
                return True
                
            return request.user.role in allowed_roles
            
    return RolePermission