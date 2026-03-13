from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import CustomUser
User = get_user_model()


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret

    class Meta:
        model = User
        fields = ['id', 'email', 'is_active', 'is_staff']
        read_only_fields = ['id', 'is_active', 'is_staff']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['password', 'groups', 'user_permissions']
        read_only_fields = ['id', 'date_joined', 'is_active',
                            'is_staff', 'is_superuser', 'last_login']
