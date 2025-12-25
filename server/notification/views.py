from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q

from .models import Notification
from .serializers import NotificationSerializer
from .permissions import IsAdminRole

User = get_user_model()


# =====================================================
# 🔔 PUBLIC + AUTHENTICATED NOTIFICATIONS (JWT BASED)
# =====================================================

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        jwt_user = getattr(self.request, "user_jwt", None)
        print("VIEW USER:", getattr(self.request, "user_jwt", None))


        # ✅ AUTHENTICATED USER
        if jwt_user:
            return Notification.objects.filter(
                Q(is_broadcast=True) |               # broadcasts
                Q(recipient_id=jwt_user["user_id"]) # personal
            ).order_by("-created_at")

        # ✅ PUBLIC (NO TOKEN)
        return Notification.objects.filter(
            is_broadcast=True,
            notification_type__in=["alert", "warning", "info"]
        ).order_by("-created_at")

    @action(detail=False, methods=["get"])
    def banner(self, request):
        jwt_user = getattr(request, "user_jwt", None)

        if jwt_user:
            banner = Notification.objects.filter(
                Q(is_broadcast=True) |
                Q(recipient_id=jwt_user["user_id"]),
                is_banner=True
            ).order_by("-created_at").first()
        else:
            banner = Notification.objects.filter(
                is_broadcast=True,
                is_banner=True
            ).order_by("-created_at").first()

        if not banner:
            return Response(None)

        serializer = self.get_serializer(banner)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        jwt_user = getattr(request, "user_jwt", None)

        if not jwt_user:
            return Response(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        notification = self.get_object()

        # 🚫 Broadcast read handled separately (future improvement)
        if notification.is_broadcast:
            return Response({"status": "broadcast read ignored"})

        # 🔒 OWNER CHECK
        if notification.recipient_id != jwt_user["user_id"]:
            return Response(
                {"detail": "Forbidden"},
                status=status.HTTP_403_FORBIDDEN
            )

        notification.is_read = True
        notification.save()

        return Response({"status": "marked as read"})


# =====================================================
# 👤 USER DROPDOWN (ADMIN ONLY)
# =====================================================

class UserMinimalSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]


class UserDropdownViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().only("id", "username", "email", "role")
    serializer_class = UserMinimalSerializer
    permission_classes = [IsAdminRole]


# =====================================================
# 🔐 ADMIN NOTIFICATIONS (BROADCAST FIXED)
# =====================================================

class AdminNotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    permission_classes = [IsAdminRole]

    def create(self, request, *args, **kwargs):
        send_to_all = request.data.get("send_to_all", False)
        is_banner = request.data.get("is_banner", False)

        title = request.data.get("title")
        message = request.data.get("message")
        notif_type = request.data.get("notification_type", "info")

        # ✅ BROADCAST
        if send_to_all:
            Notification.objects.create(
                title=title,
                message=message,
                notification_type=notif_type,
                is_banner=is_banner,
                is_broadcast=True,
                recipient=None
            )
            return Response({"status": "Broadcast sent"}, status=201)

        # ✅ PERSONAL (REQUIRED recipient)
        recipient_id = request.data.get("recipient")

        if not recipient_id:
            return Response(
                {"error": "recipient is required for personal notification"},
                status=400
            )

        recipient = User.objects.get(id=recipient_id)

        Notification.objects.create(
            title=title,
            message=message,
            notification_type=notif_type,
            is_banner=is_banner,
            is_broadcast=False,
            recipient=recipient
        )

        return Response({"status": "Personal notification sent"}, status=201)

