
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from knox import views as knox_views
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'settings', StoreSettingsViewSet, basename='settings')
router.register(r'coupons', CouponViewSet)
router.register(r'shipping-companies', ShippingCompanyViewSet)
router.register(r'shipping-zones', ShippingZoneViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterAPI.as_view()),
    path('auth/login/', LoginAPI.as_view()),
    path('auth/user/', UserAPI.as_view()),
    path('auth/logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('chat/', ChatAPI.as_view()),
]
