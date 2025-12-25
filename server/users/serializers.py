from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Used for sending user data back to frontend.
    Matches the 'exclude: password' logic.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone_number', 'role', 'blood_group', 'location', 'profile', 'created_at']
        read_only_fields = ['id', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles Registration Input.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone_number', 'password', 'role', 'blood_group']

    def create(self, validated_data):
        # 1. Replicate Express Logic: userName = email.split('@')[0]
        email = validated_data['email']
        username = email.split('@')[0]
        
        # 2. Create User (Django handles password hashing automatically here)
        user = User.objects.create_user(
            username=username,
            email=email,
            full_name=validated_data.get('full_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            password=validated_data['password'], 
            role=validated_data.get('role', 'people'),
            blood_group=validated_data.get('blood_group', '')
        )
        return user