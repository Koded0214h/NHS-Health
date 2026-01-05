from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404

from .models import CustomUser
from .serializers import (
    UserSerializer, 
    UserCreateSerializer, 
    LoginSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)


class IsAdminOrSelf(permissions.BasePermission):
    """Permission for users to edit their own profile or admin to edit any"""
    
    def has_object_permission(self, request, view, obj):
        # Allow read permissions to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Users can edit their own profile
        if obj == request.user:
            return True
        
        # Admins can edit any user
        return request.user.is_superuser or request.user.role == 'admin'


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(is_active=True).select_related('organization', 'department')
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['register', 'login', 'request_password_reset', 'reset_password']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['list']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSelf]
        elif self.action in ['destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter queryset based on user permissions"""
        user = self.request.user
        
        if not user.is_authenticated:
            return CustomUser.objects.none()
        
        # Admins can see all users
        if user.is_superuser or user.role == 'admin':
            return super().get_queryset()
        
        # Regular users can only see users in their organization
        if user.organization:
            return super().get_queryset().filter(organization=user.organization)
        
        # Users without organization can only see themselves
        return super().get_queryset().filter(id=user.id)

    def get_serializer_class(self):
        if self.action in ["create", "register"]:
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Send welcome email
        try:
            send_mail(
                "Welcome to NHS Health",
                f"Hi {user.full_name},\n\nYour account has been successfully created.\n\nYou can now login using your email: {user.email}\n\nBest regards,\nNHS Health Team",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except Exception as e:
            # Log email error but don't fail the registration
            print(f"Failed to send welcome email: {e}")

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check password
        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if user can login
        if not user.can_login:
            return Response({"error": "Account is inactive or suspended"}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def request_password_reset(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        try:
            user = CustomUser.objects.get(email=email, is_active=True)
        except CustomUser.DoesNotExist:
            # Don't reveal that user doesn't exist for security
            return Response({"message": "If your email exists in our system, you will receive a password reset link."})

        token = PasswordResetTokenGenerator().make_token(user)
        
        # In production, use a proper frontend URL
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        reset_link = f"{frontend_url}/reset-password?token={token}&email={user.email}"

        try:
            send_mail(
                "Reset your NHS Health password",
                f"Hi {user.full_name},\n\nClick the link below to reset your password:\n{reset_link}\n\nThis link will expire in 24 hours.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nNHS Health Team",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except Exception as e:
            return Response({"error": "Failed to send reset email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Password reset email sent"})

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def reset_password(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = CustomUser.objects.get(email=email, is_active=True)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()
        
        # Send confirmation email
        try:
            send_mail(
                "Your password has been reset",
                f"Hi {user.full_name},\n\nYour password has been successfully reset.\n\nIf you didn't make this change, please contact support immediately.\n\nBest regards,\nNHS Health Team",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except Exception as e:
            pass  # Don't fail if confirmation email doesn't send
        
        return Response({"message": "Password successfully reset"})

    @action(detail=True, methods=["post"])
    def suspend(self, request, pk=None):
        """Suspend a user account (admin only)"""
        if not request.user.is_superuser and request.user.role != 'admin':
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        user.is_suspended = True
        user.save()
        
        return Response({"message": f"User {user.email} has been suspended"})

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        """Activate a user account (admin only)"""
        if not request.user.is_superuser and request.user.role != 'admin':
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        user.is_suspended = False
        user.save()
        
        return Response({"message": f"User {user.email} has been activated"})


# Custom JWT view to include user data in response
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            email = request.data.get('email')
            try:
                user = CustomUser.objects.get(email=email)
                response.data['user'] = UserSerializer(user).data
            except CustomUser.DoesNotExist:
                pass
        
        return response