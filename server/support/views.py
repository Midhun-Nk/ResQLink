from rest_framework import viewsets
from .models import Disaster, FirstAidGuide, SafetyProtocol
from .serializers import DisasterSerializer, FirstAidGuideSerializer, SafetyProtocolSerializer

class DisasterViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Disasters to be viewed or edited.
    GET /api/disasters/ returns the full nested structure needed for the frontend.
    """
    queryset = Disaster.objects.all()
    serializer_class = DisasterSerializer
    lookup_field = 'slug'

class FirstAidViewSet(viewsets.ModelViewSet):
    queryset = FirstAidGuide.objects.all()
    serializer_class = FirstAidGuideSerializer

# Optional: If you need to edit specific lines individually
class ProtocolViewSet(viewsets.ModelViewSet):
    queryset = SafetyProtocol.objects.all()
    serializer_class = SafetyProtocolSerializer

from .models import ContactCategory
from .serializers import ContactCategorySerializer

class EmergencyContactViewSet(viewsets.ModelViewSet): # Changed to ModelViewSet
    queryset = ContactCategory.objects.all().prefetch_related('contacts')
    serializer_class = ContactCategorySerializer