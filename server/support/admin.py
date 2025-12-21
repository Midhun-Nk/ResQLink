
# Register your models here.
from django.contrib import admin
from .models import Disaster, SafetyProtocol, FirstAidGuide

class SafetyProtocolInline(admin.TabularInline):
    model = SafetyProtocol
    extra = 1

@admin.register(Disaster)
class DisasterAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'color_theme')
    inlines = [SafetyProtocolInline]

@admin.register(FirstAidGuide)
class FirstAidAdmin(admin.ModelAdmin):
    list_display = ('title', 'guide_type')

@admin.register(SafetyProtocol)
class ProtocolAdmin(admin.ModelAdmin):
    list_display = ('disaster', 'phase', 'order', 'content_preview')
    list_filter = ('disaster', 'phase')
    
    def content_preview(self, obj):
        return obj.content[:50]