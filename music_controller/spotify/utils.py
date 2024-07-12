from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
import requests
import os

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, 
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
    
        tokens.save()

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False

def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    response = requests.post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': os.environ.get('SPOTIFY_CLIENT_ID'),
        'client_secret': os.environ.get('SPOTIFY_CLIENT_SECRET')
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

# TODO: MAJOR REVISIONS TO BE MADE - CLASS BASED IMPLEMENTATION INSTEAD OF SEPARATE FUNCTIONS

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    headers = {'Authorization': f"Bearer {tokens.access_token}"}

    if post_:
        requests.post(BASE_URL + endpoint, headers=headers)
    if put_:
        requests.put(BASE_URL + endpoint, headers=headers)

    response = requests.get(BASE_URL + endpoint, {}, headers=headers)
    
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}
    
def play_song(session_id):
    access_token = get_user_tokens(session_id).access_token
    url = f"{BASE_URL}player/play"

    response = requests.put(url, {}, headers={
        "Authorization": f"Bearer {access_token}"
    })

    return response

def pause_song(session_id):
    access_token = get_user_tokens(session_id).access_token
    url = f"{BASE_URL}player/pause"

    response = requests.put(url, {}, headers={
        'Authorization': f'Bearer {access_token}'
    })

    return response