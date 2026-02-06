from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import MatchingViewSet, MutualMatchViewSet

router = DefaultRouter()
router.register(r'mutual', MutualMatchViewSet, basename='mutual-match')

urlpatterns = [
    path('', include(router.urls)),
    path('pool/', MatchingViewSet.as_view({'get': 'current_pool'}), name='current-pool'),
    path('request/', MatchingViewSet.as_view({'post': 'request_meetup'}), name='request-meetup'),
]
