from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer

# Import custom permission
from notification.permissions import IsAdminRole 

User = get_user_model()

# ================== AUTH VIEWSET (Register, Login, Profile) ===================
class AuthViewSet(viewsets.ViewSet):
    """
    Replicates Express 'registerUser', 'loginUser', and 'updateProfile'.
    """
    permission_classes = [AllowAny]

    # --- REGISTER ---
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                # Generate Token manually to match Express response
                refresh = RefreshToken.for_user(user)
                
                # Add custom claims if needed to match Express payload {id, email, role}
                refresh['email'] = user.email
                refresh['role'] = user.role

                return Response({
                    "message": "User registered successfully",
                    "token": str(refresh.access_token),
                    "user": UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"message": "Internal Server Error", "error": str(e)}, status=500)
        
        # If email exists or validation fails
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    # --- LOGIN ---
    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"message": "Email and Password are required"}, status=400)

        # Authenticate (Checks DB hash vs Input password)
        # Note: Works with BCrypt hashes imported from Express
        user = authenticate(username=email, password=password)

        if not user:
            return Response({"message": "Invalid credentials"}, status=401)

        # Generate Token
        refresh = RefreshToken.for_user(user)
        refresh['email'] = user.email
        refresh['role'] = user.role

        return Response({
            "message": "Login successful",
            "token": str(refresh.access_token),
            "user": UserSerializer(user).data
        }, status=200)

    # --- UPDATE PROFILE ---
    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        user = request.user # Django gets this from the Token
        data = request.data

        try:
            # Update standard fields (if provided)
            user.full_name = data.get('full_name', user.full_name)
            user.phone_number = data.get('phone_number', user.phone_number)
            user.blood_group = data.get('blood_group', user.blood_group)
            user.profile = data.get('profile', user.profile)

            # ⭐ JSON Location Merge Logic (Matching Express)
            # user.location = { ...user.location, ...location }
            if 'location' in data:
                current_loc = user.location if user.location else {}
                new_loc = data['location']
                user.location = {**current_loc, **new_loc}

            user.save()

            return Response({
                "message": "Profile updated successfully",
                "user": UserSerializer(user).data
            })
        except Exception as e:
             return Response({"message": "Something went wrong", "error": str(e)}, status=500)


# ================== USER MANAGEMENT (CRUD) ===================
class UserViewSet(viewsets.ModelViewSet):
    """
    Replicates getAllUsers, createUser, updateUser, deleteUser.
    Protected: Only Admins/SuperAdmins can access.
    """
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole] # Uses your custom permission

    # create() method overrides standard behavior to handle password hashing
    def create(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)