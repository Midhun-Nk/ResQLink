from rest_framework import serializers
from django.contrib.auth import get_user_model  # <--- FIXED IMPORT
from .models import Notification

# Get the correct user model
User = get_user_model() 

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

# Simple serializer for the User dropdown
class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # <--- Now uses the correct Custom User
        fields = ['id', 'username', 'email']