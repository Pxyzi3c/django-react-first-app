from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', SpotifyAPI.get_authenticate),
    path('redirect', SpotifyAPI.get_spotify_callback_view),
    path('is-authenticated', SpotifyAPI.is_authenticated),
    path('current-song', SpotifyAPI.get_current_song),
    path('pause-song', SpotifyAPI.pause_song),
    path('play-song', SpotifyAPI.play_song),
]