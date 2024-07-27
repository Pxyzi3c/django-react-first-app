from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('info', index, name='info'),
    path('join', index, name='join-room'),
    path('create', index, name='create-room'),
    path('room/<str:roomCode>', index, name='room-page'),
]