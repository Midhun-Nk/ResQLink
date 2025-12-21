from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import RescueChannel
from .serializers import RescueChannelSerializer
class RescueChannelViewSet(viewsets.ModelViewSet):
    queryset = RescueChannel.objects.all().order_by('-is_live', '-created_at')
    serializer_class = RescueChannelSerializer

    # --- CUSTOM ACTION: JOIN / LEAVE ---
    @action(detail=True, methods=['post'])
    def join_leave(self, request, pk=None):
        channel = self.get_object()
        # Simulate user 1 for now (since no auth in frontend yet)
        user_id = request.data.get('user_id', 1) 
        user = User.objects.get(id=user_id)

        if user in channel.participants.all():
            channel.participants.remove(user)
            status_msg = 'left'
        else:
            channel.participants.add(user)
            status_msg = 'joined'

        # Return the updated count AND the updated list of avatars
        return Response({
            'status': status_msg,
            'totalParticipants': channel.total_participants,
            'participants': channel.participant_avatars # This ensures the UI updates the images
        })
        channel = self.get_object()
        # In a real app, use request.user. For this demo, we simulate a user ID from the body
        # or fallback to the first user if testing without auth
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(id=user_id) if user_id else User.objects.first()
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user in channel.participants.all():
            channel.participants.remove(user)
            return Response({'status': 'left', 'totalParticipants': channel.total_participants})
        else:
            channel.participants.add(user)
            return Response({'status': 'joined', 'totalParticipants': channel.total_participants})