from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import Notification
from .serializers import NotificationSerializer

# --- PUBLIC NOTIFICATION VIEW (For Frontend Bell) ---
class NotificationViewSet(viewsets.ModelViewSet):
    """
    Public endpoint for the frontend to fetch notifications.
    No authentication required.
    """
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny] # Open to public

    def get_queryset(self):
        # Return ALL notifications sorted by newest
        return Notification.objects.all().order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        # Mark ALL notifications in the system as read
        Notification.objects.filter(is_read=False).update(is_read=True)
        return Response({'status': 'all marked as read'})


# --- ADMIN & DROPDOWN HELPERS (For Admin Panel) ---

# Simple serializer for the User dropdown
class UserMinimalSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserDropdownViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Helper endpoint to list users for the Admin 'Compose' dropdown.
    """
    queryset = User.objects.all()
    serializer_class = UserMinimalSerializer

class AdminNotificationViewSet(viewsets.ModelViewSet):
    """
    Admin endpoint to create/broadcast notifications.
    """
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer

    def create(self, request, *args, **kwargs):
        # Check if this is a "Broadcast" (Send to All)
        send_to_all = request.data.get('send_to_all', False)
        
        if send_to_all:
            # Create a notification for EVERY user
            users = User.objects.all()
            notifications = []
            
            # Prepare data
            title = request.data.get('title')
            message = request.data.get('message')
            notif_type = request.data.get('notification_type', 'info')

            for user in users:
                notifications.append(Notification(
                    recipient=user,
                    title=title,
                    message=message,
                    notification_type=notif_type
                ))
            
            # Efficient Bulk Insert
            Notification.objects.bulk_create(notifications)
            return Response({'status': f'Broadcast sent to {len(notifications)} users'}, status=status.HTTP_201_CREATED)
        
        else:
            # Standard single creation (one recipient)
            return super().create(request, *args, **kwargs)