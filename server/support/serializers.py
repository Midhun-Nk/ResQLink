from rest_framework import serializers
from .models import Disaster, FirstAidGuide, SafetyProtocol,ContactCategory, EmergencyContact

from django.db import transaction

class SafetyProtocolSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyProtocol
        fields = ['id', 'content', 'order']


class DisasterSerializer(serializers.ModelSerializer):
    phases = serializers.DictField(child=serializers.ListField(child=serializers.CharField()), write_only=True)
    phases_read = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Disaster
        fields = ['slug', 'title', 'icon_name', 'color_theme', 'phases', 'phases_read']

    def get_phases_read(self, obj):
        return {
            "before": obj.protocols.filter(phase='before').values_list('content', flat=True),
            "during": obj.protocols.filter(phase='during').values_list('content', flat=True),
            "after": obj.protocols.filter(phase='after').values_list('content', flat=True),
        }

    def to_representation(self, instance):
        # Merge the read_only field into the main response for easier frontend handling
        ret = super().to_representation(instance)
        ret['phases'] = ret.pop('phases_read')
        return ret

    def create(self, validated_data):
        phases_data = validated_data.pop('phases', {})
        disaster = Disaster.objects.create(**validated_data)
        self._save_protocols(disaster, phases_data)
        return disaster

    def update(self, instance, validated_data):
        phases_data = validated_data.pop('phases', None)
        # Update standard fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if phases_data is not None:
            # Clear old protocols and re-add new ones
            instance.protocols.all().delete()
            self._save_protocols(instance, phases_data)
        
        return instance

    def _save_protocols(self, disaster, phases_data):
        for phase_name, steps in phases_data.items():
            for index, content in enumerate(steps):
                if content.strip(): # Skip empty lines
                    SafetyProtocol.objects.create(
                        disaster=disaster,
                        phase=phase_name,
                        content=content,
                        order=index
                    )

# ... Keep FirstAidGuideSerializer as is ...
class FirstAidGuideSerializer(serializers.ModelSerializer):



    steps = serializers.SerializerMethodField()
    steps_text = serializers.CharField(write_only=True)

    class Meta:
        model = FirstAidGuide
        fields = ['id', 'title', 'guide_type', 'steps', 'steps_text']

    def get_steps(self, obj):
        if not obj.steps_text: return []
        return [step.strip() for step in obj.steps_text.split('\n') if step.strip()]
class EmergencyContactSerializer(serializers.ModelSerializer):
    color = serializers.CharField(source='color_theme')
    icon = serializers.CharField(source='icon_name')

    class Meta:
        model = EmergencyContact
        fields = ['name', 'number', 'icon', 'color']

class ContactCategorySerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='title')
    items = EmergencyContactSerializer(many=True, source='contacts')

    class Meta:
        model = ContactCategory
        fields = ['id', 'category', 'order', 'items']

    def create(self, validated_data):
        contacts_data = validated_data.pop('contacts')
        # Create Category
        category = ContactCategory.objects.create(**validated_data)
        # Create nested Contacts
        for contact in contacts_data:
            EmergencyContact.objects.create(category=category, **contact)
        return category

    def update(self, instance, validated_data):
        contacts_data = validated_data.pop('contacts', None)
        
        # Update Category fields
        instance.title = validated_data.get('title', instance.title)
        instance.order = validated_data.get('order', instance.order)
        instance.save()

        # Update Contacts (Strategy: Delete old, create new)
        if contacts_data is not None:
            instance.contacts.all().delete()
            for contact in contacts_data:
                EmergencyContact.objects.create(category=instance, **contact)
        
        return instance