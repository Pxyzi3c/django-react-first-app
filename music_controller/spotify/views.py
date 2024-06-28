from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from requests import Request, post
from .util import *
from api.models import Room
import os

scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

class AuthAURL(APIView):
    def get(self, request, format=None):
        url = self.generate_spotify_url();
        return Response({'url': url}, status=status.HTTP_200_OK)
    
    def generate_spotify_url(self):
        return Request('GET', 'https://accounts.spotify.com/authorize', params={
                'scope': scopes,
                'response_type': 'code',
                'redirect_uri': os.environ.get('SPOTIFY_REDIRECT_URL'),
                'client_id': os.environ.get('SPOTIFY_CLIENT_ID')
        }).prepare().url

class SpotifyCallbackView(APIView):
    def get(self, request, format=None):
        code = request.GET.get('code')
        error = request.GET.get('error')

        if error:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
    
        response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': os.environ.get('SPOTIFY_REDIRECT_URL'),
            'client_id': os.environ.get('SPOTIFY_CLIENT_ID'),
            'client_secret': os.environ.get('SPOTIFY_CLIENT_SECRET')
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

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        try:
            is_authenticated = is_spotify_authenticated(self.request.session.session_key)
            return Response({'status': is_authenticated, }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error checking Spotify authentication: {e}")
            return Response({'error': 'Error checking Spotify authentication'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CurrentSong(APIView):
    def get(self, request, format=None):
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