from django.urls import path
from .views import AuthAURL

urlpatterns = [
    path('get-auth-url', AuthAURL.as_view()),
]