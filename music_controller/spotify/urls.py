from django.urls import path
from .views import AuthAURL, spotify_callback, IsAuthenticated

urlpatterns = [
    path('get-auth-url', AuthAURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view())
]