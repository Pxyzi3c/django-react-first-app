from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from requests import Request, post
from .util import *
from api.models import Room
import os

SPOTIFY_SCOPES = [
    "user-read-currently-playing",  # Retrieve currently playing song
    "user-read-playback-state",  # Read if a song is playing
    "user-modify-playback-state",  # Pause, play/resume, and skip
    "user-read-private",  # User's profile information (email not included)
    "playlist-read-private",  # Access user's private playlists
]

class SpotifyAPI(APIView):
    def __init__(self):
        self.client_id = os.environ.get('SPOTIFY_CLIENT_ID'), 
        self.client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET'), 
        self.redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URL')
    
    def get_authentication_url(self):
        return Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': SPOTIFY_SCOPES,
            'response_type': 'code',
            'redirect_uri': self.client_id,
            'client_id': self.client_secret
        }).prepare().url
    
    def get_authenticate(self, request, format=None):
        url = self.get_authentication_url()
        return Response({'url': url}, status=status.HTTP_200_OK)
    
    def is_authenticated(self, request, format=None):
        try:
            is_authenticated = is_spotify_authenticated(self.request.session.session_key)
            return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error checking Spotify authentication: {e}")
            return Response({'error': 'Error checking Spotify authentication'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_spotify_callback_view(self, request, format=None):
        code = request.GET.get('code')
        error = request.GET.get('error')

        if error:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
    
        response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': self.redirect_uri,
            'client_id': self.client_id,
            'client_secret': self.client_secret
        })

        response_data = response.json()
        access_token = response_data.get('access_token')
        token_type = response_data.get('token_type')
        refresh_token = response_data.get('refresh_token')
        expires_in = response_data.get('expires_in')
        error = response_data.get('error')

        if not request.session.exists(request.session.session_key):
            request.session.create()

        update_or_create_user_tokens(
            request.session.session_key, 
            access_token, 
            token_type, 
            expires_in, 
            refresh_token
        )

        return redirect('frontend:')        

    def get_current_song(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)

        if 'error' in response or 'item' not in response:
            return Response(response.get('error') or {}, status=status.HTTP_204_NO_CONTENT)
        
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id
        }

        return Response(song, status=status.HTTP_200_OK)
    
    def pause_song(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)
    
    def play_song(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_403_FORBIDDEN)