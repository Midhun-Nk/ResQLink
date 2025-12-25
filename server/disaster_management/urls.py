
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('support.urls')),
    path('api/v1/', include('rescue.urls')),
  
    path('api/v1/', include('notification.urls')),
    path('api/v1/', include('navigation.urls')),
    path('api/v1/', include('users.urls')),
]
