from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

from .storage import OverwriteStorage, File_Rename
from api.models import Country, Product

class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('Username is a required field')

        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)


class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    nationality = models.ForeignKey(Country, on_delete=models.CASCADE, blank=True, null=True)
    profile_picture = models.ImageField(upload_to=File_Rename(
        'users/profile_picture/'), storage=OverwriteStorage(), blank=True, null=True)
    orderCount = models.IntegerField(default=0)
    totalSpent = models.DecimalField(
        max_digits=12, decimal_places=2, default=0)
    isBlocked = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    
    cart = models.JSONField(
        encoder=None, decoder=None, default=dict, blank=True)
    favorites = models.ManyToManyField(Product, related_name='favorite', blank=True)

    # Specify the required fields for user creation
    REQUIRED_FIELDS = ['email', 'password']
    objects = CustomUserManager()

    def __str__(self):
        return self.username
