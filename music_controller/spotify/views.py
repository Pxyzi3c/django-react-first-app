import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils import *
from api.models import Room
from .models import Vote
from django.conf import settings
from django.shortcuts import render, redirect

SPOTIFY_SCOPES = [
    "user-read-currently-playing",
    "user-modify-playback-state",
    "user-read-playback-state",
    "user-read-private",
    "playlist-read-private",
    "app-remote-control",
    "streaming",
]

class AuthSpotify(APIView):
    def get(self, request):
        url = self.generate_spotify_url()
        return Response({'url': url}, status=status.HTTP_200_OK)
    
    def generate_spotify_url(self):
        base_url = 'https://accounts.spotify.com/authorize'
        redirect_url = settings.SPOTIFY_REDIRECT_URL
        client_id = settings.SPOTIFY_CLIENT_ID

        return requests.Request('GET', base_url, params={
                'scope': ' '.join(SPOTIFY_SCOPES),
                'response_type': 'code',
                'redirect_uri': redirect_url,
                'client_id': client_id
        }).prepare().url

class SpotifyCallback(APIView):
    def get(self, request):
        code = request.query_params.get('code')
        error = request.query_params.get('error')
        token_url = 'https://accounts.spotify.com/api/token'
        client_id = settings.SPOTIFY_CLIENT_ID
        client_secret = settings.SPOTIFY_CLIENT_SECRET
        redirect_url = settings.SPOTIFY_REDIRECT_URL

        if error:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
    
        response = requests.post(token_url, data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_url,
            'client_id': client_id,
            'client_secret': client_secret
        })

        token_info = response.json()
        access_token = token_info['access_token']
        token_type = token_info['token_type']
        refresh_token = token_info['refresh_token']
        expires_in = token_info['expires_in']

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

        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)

        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()

class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)
    
class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_403_FORBIDDEN)
    
class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            skip_song(room.host)
        else:
            vote = Vote(user=self.request.session.session_key,
                        room=room, song_id=room.current_song)
            vote.save()

        return Response({}, status.HTTP_204_NO_CONTENT)