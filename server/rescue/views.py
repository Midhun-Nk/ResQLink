from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model # <--- FIX IMPORT

from .models import RescueChannel
from .serializers import RescueChannelSerializer

# Get the custom user model
User = get_user_model()

class RescueChannelViewSet(viewsets.ModelViewSet):
    queryset = RescueChannel.objects.all().order_by('-is_live', '-created_at')
    serializer_class = RescueChannelSerializer
    
    # Use IsAuthenticated if you want to use request.user
    # Use AllowAny if you are still testing with manual user_ids
    permission_classes = [AllowAny] 

    # --- CUSTOM ACTION: JOIN / LEAVE ---
    @action(detail=True, methods=['post'])
    def join_leave(self, request, pk=None):
        channel = self.get_object()
        
        # 1. Try to get user from Token (request.user)
        if request.user.is_authenticated:
            user = request.user
        else:
            # 2. Fallback for testing: Get 'user_id' from body
            user_id = request.data.get('user_id')
            if user_id:
                try:
                    user = User.objects.get(id=user_id)
                except User.DoesNotExist:
                    return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                 return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        # 3. Toggle Join/Leave Logic
        if user in channel.participants.all():
            channel.participants.remove(user)
            status_msg = 'left'
        else:
            channel.participants.add(user)
            status_msg = 'joined'

        # 4. Return updated data
        return Response({
            'status': status_msg,
            'totalParticipants': channel.total_participants,
            'participants': channel.participant_avatars 
        })