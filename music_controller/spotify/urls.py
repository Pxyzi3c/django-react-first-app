from django.urls import path
from .views import AuthAURL, SpotifyCallbackView, IsAuthenticated

urlpatterns = [
    path('get-auth-url', AuthAURL.as_view()),
    path('redirect', SpotifyCallbackView.as_view()),
    path('is-authenticated', IsAuthenticated.as_view())
]