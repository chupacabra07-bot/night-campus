from django.utils import timezone
import uuid
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Profile
from .serializers import UserSerializer, ProfileSerializer
from .utils import generate_thematic_nickname
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

class GoogleLogin(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('access_token')
        
        if not token:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verify the Google ID token
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                '482173332213-f7jpvem0soc2dgobvajsev1t0okk1avl.apps.googleusercontent.com'
            )
            
            # Extract user info
            email = idinfo.get('email')
            
            if not email:
                return Response({'error': 'Email not found in token'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'is_verified': True
                }
            )
            
            # Mark as verified if existing user
            if not created and not user.is_verified:
                user.is_verified = True
                user.save()
            
            # Create profile if needed
            profile, _ = Profile.objects.get_or_create(user=user)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
                'is_new_user': created or not profile.nickname
            })
            
        except ValueError as e:
            return Response({'error': f'Invalid token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Authentication failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        return Response({'error': 'Registration via OTP is disabled. Use Google Sign-In.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
        if not user.check_password(password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
            
        # Ensure profile exists
        Profile.objects.get_or_create(user=user)
        
        # Reward Lore for daily login
        profile = user.profile
        meta = profile.lore_meta or {}
        today = timezone.now().date().isoformat()
        if meta.get('daily_login') != today:
            profile.lore_score += 2
            meta['daily_login'] = today
            profile.lore_meta = meta
            profile.save(update_fields=['lore_score', 'lore_meta'])

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
            'is_new_user': not bool(user.profile.nickname)
        })

    @action(detail=False, methods=['post'])
    def verify_otp(self, request):
        return Response({'error': 'OTP verification is disabled. Use Google Sign-In.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def generate_nickname(self, request):
        # Retry up to 5 times to ensure uniqueness if needed, 
        # though collisions are extremely unlikely with 2-4 digit numbers
        for _ in range(5):
            nickname = generate_thematic_nickname()
            if not Profile.objects.filter(nickname=nickname).exists():
                return Response({'nickname': nickname})
        return Response({'nickname': generate_thematic_nickname()})

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        
        # Check for daily streak/lore update
        streak_increased = profile.update_streak()
        
        # Consolidation of lore rewards for daily check-in
        # (Only reward if they haven't been rewarded today via lore_meta)
        meta = profile.lore_meta or {}
        today = timezone.now().date().isoformat()
        if meta.get('daily_login') != today:
            profile.lore_score += 2
            meta['daily_login'] = today
            profile.lore_meta = meta
            profile.save(update_fields=['lore_score', 'lore_meta'])

        if request.method == 'PATCH':
            # Reward +1 Lore for completing profile setup (first time nickname is set)
            if 'nickname' in request.data and not profile.nickname:
                profile.nickname = request.data['nickname']
                profile.lore_score += 1
                profile.save(update_fields=['nickname', 'lore_score'])
                
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        
        serializer = self.get_serializer(profile)
        data = serializer.data
        data['streak_increased'] = streak_increased
        return Response(data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
