from django.contrib import admin

from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser

# Register your models here.
class CustomerAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        
        (
            "Main information",
            {
                "fields": ['nationality', 'nickname', 'profile_picture'],
            },
        ),
    ) + UserAdmin.fieldsets
    search_fields = ('username', 'email', 'nickname')
    ordering = ('username',)
admin.site.register(CustomUser, CustomerAdmin)