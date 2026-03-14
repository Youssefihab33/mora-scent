from django.contrib.auth import get_user_model
User= get_user_model()

from django.db.models import Q
from django.contrib.auth.backends import ModelBackend

class EmailOrUsernameBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        try:
            # Allow login with either username or email
            user = User.objects.get(Q(username=username) | Q(email=username))
            if user.check_password(password):
                return user
        except (ValueError, User.DoesNotExist):
            return None