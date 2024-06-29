from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthAURL.as_view()),
    path('redirect', SpotifyCallbackView.as_view()),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('pause-play-song', ControlSong.as_view()),
]