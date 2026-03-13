
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from .models import *
from .serializers import *
import google.genai
import os
from dotenv import load_dotenv
load_dotenv()


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.AllowAny]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data
        customer_data = data.get('customer')
        customer, _ = Customer.objects.get_or_create(phone=customer_data.get('phone'), defaults={
                                                     'name': customer_data.get('name'), 'email': customer_data.get('email')})
        order = Order.objects.create(customer=customer, subtotal=data.get('subtotal'), shippingCost=data.get('shippingCost'), discount=data.get('discount'), total=data.get('total'), paymentMethod=data.get('paymentMethod'), couponCode=data.get(
            'couponCode'), customer_name=customer_data.get('name'), customer_phone=customer_data.get('phone'), customer_email=customer_data.get('email'), city=customer_data.get('city'), region=customer_data.get('region'), address=customer_data.get('address'))
        for item in data.get('items'):
            OrderItem.objects.create(order=order, product_id=item.get('id'), name=item.get('name'), nameEn=item.get(
                'nameEn'), price=item.get('price'), quantity=item.get('quantity'), image=item.get('image'))
        customer.orderCount += 1
        customer.totalSpent += order.total
        customer.save()
        return Response(self.get_serializer(order).data, status=status.HTTP_201_CREATED)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]


class StoreSettingsViewSet(viewsets.ModelViewSet):
    queryset = StoreSettings.objects.all()
    serializer_class = StoreSettingsSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if StoreSettings.objects.count() == 0:
            StoreSettings.objects.create()
        return StoreSettings.objects.all()[:1]


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.AllowAny]


class ShippingCompanyViewSet(viewsets.ModelViewSet):
    queryset = ShippingCompany.objects.all()
    serializer_class = ShippingCompanySerializer
    permission_classes = [permissions.AllowAny]


class ShippingZoneViewSet(viewsets.ModelViewSet):
    queryset = ShippingZone.objects.all()
    serializer_class = ShippingZoneSerializer
    permission_classes = [permissions.AllowAny]


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"user": UserSerializer(user).data, "token": AuthToken.objects.create(user)[1]})


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    def get_object(self): return self.request.user


class ChatAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        messages, lang = request.data.get(
            'messages', []), request.data.get('lang', 'ar')
        store_settings = StoreSettings.objects.first()
        products_context = "\n".join(
            [f"- {p.name} / {p.nameEn} ({p.category.en}): {p.price}." for p in Product.objects.all()])
        system_instruction = f"You are a smart assistant for '{store_settings.name}' perfume store. Products:\n{products_context}"
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                return Response({"error": "AI API Key not configured"}, status=500)
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel(
                'gemini-1.5-flash', system_instruction=system_instruction)
            chat = model.start_chat(history=[{"role": "user" if m['role'] == 'user' else "model", "parts": [
                                    m['text']]} for m in messages[:-1]])
            response = chat.send_message(messages[-1]['text'])
            return Response({"text": response.text})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
