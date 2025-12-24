from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Count
from .models import Notification
from .serializers import NotificationSerializer

# --- HYBRID NOTIFICATION VIEW ---
class NotificationViewSet(viewsets.ModelViewSet):
    """
    Handles both Public Broadcasts and Private User Notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny] # Open to everyone

    def get_queryset(self):
        user = self.request.user
        
        if user.is_authenticated:
            # 1. LOGGED IN: Show ONLY my specific messages
            return Notification.objects.filter(recipient=user).order_by('-created_at')
        else:
            # 2. ANONYMOUS: Show ALL notifications (we will filter them in 'list')
            # We fetch 'alert' and 'warning' types primarily for public safety
            return Notification.objects.filter(
                notification_type__in=['alert', 'warning', 'info']
            ).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        """
        Custom logic to handle the Public view specifically.
        """
        queryset = self.get_queryset()

        # If user is logged in, standard behavior (show their list)
        if request.user.is_authenticated:
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        # --- PUBLIC ANONYMOUS LOGIC (Deduplication) ---
        # If anonymous, we only want to show unique Broadcasts.
        # We don't want to show 500 copies of "Flood Warning".
        
        unique_notifications = []
        seen_content = set()

        for notification in queryset:
            # Create a unique signature for the message
            # We ignore 'recipient' here so we merge duplicates
            identifier = (notification.title, notification.message, notification.notification_type)
            
            # Security Filter: Only show "Banner" items or Alerts to public
            # This prevents private messages like "Password Changed" from leaking 
            # if they accidentally got marked as 'info'
            is_public_worthy = notification.is_banner or notification.notification_type in ['alert', 'warning']

            if identifier not in seen_content and is_public_worthy:
                seen_content.add(identifier)
                unique_notifications.append(notification)
        
        # Limit public list to recent 10 to avoid overload
        serializer = self.get_serializer(unique_notifications[:10], many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def banner(self, request):
        """
        Get the latest active banner.
        """
        # If logged in, check MY banners
        if request.user.is_authenticated:
            banner = Notification.objects.filter(recipient=request.user, is_banner=True).order_by('-created_at').first()
        else:
            # If public, find the most recent system-wide banner
            banner = Notification.objects.filter(is_banner=True).order_by('-created_at').first()
        
        if banner:
            serializer = self.get_serializer(banner)
            return Response(serializer.data)
        return Response(None)


# --- ADMIN VIEWS (Unchanged) ---
class UserMinimalSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserDropdownViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().only('id', 'username', 'email')
    serializer_class = UserMinimalSerializer
    permission_classes = [IsAdminUser]

class AdminNotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [IsAdminUser]

    def create(self, request, *args, **kwargs):
        send_to_all = request.data.get('send_to_all', False)
        is_banner = request.data.get('is_banner', False)

        if send_to_all:
            title = request.data.get('title')
            message = request.data.get('message')
            notif_type = request.data.get('notification_type', 'info')

            notifications = []
            
            try:
                with transaction.atomic():
                    for user in User.objects.all().iterator():
                        notifications.append(Notification(
                            recipient=user,
                            title=title,
                            message=message,
                            notification_type=notif_type,
                            is_banner=is_banner
                        ))
                        if len(notifications) >= 5000:
                            Notification.objects.bulk_create(notifications)
                            notifications = []

                    if notifications:
                        Notification.objects.bulk_create(notifications)
                        
                return Response({'status': 'Broadcast sent'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        else:
            return super().create(request, *args, **kwargs)