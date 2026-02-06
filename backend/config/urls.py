"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from accounts.api import UserViewSet, ProfileViewSet, AuthViewSet, GoogleLogin
from wall.api import WallPostViewSet
from events.api import EventViewSet
from matches.api import MatchingViewSet, MutualMatchViewSet

router = routers.DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'posts', WallPostViewSet)
router.register(r'events', EventViewSet)
router.register(r'matching', MatchingViewSet, basename='matching')
router.register(r'mutual', MutualMatchViewSet, basename='mutual')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('api-auth/', include('rest_framework.urls')),
]
