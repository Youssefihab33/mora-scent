from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LoginViewSet, RegisterViewSet, UsersViewSet
router = DefaultRouter()

router.register('login', LoginViewSet, basename='login')
router.register('register', RegisterViewSet, basename='register')
router.register('', UsersViewSet, basename='customers')

urlpatterns = []

urlpatterns += router.urls
