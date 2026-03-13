from django.db import models
from core.storage import File_Rename, OverwriteStorage

class Category(models.Model):
    nameAr = models.CharField(max_length=100)
    nameEn = models.CharField(max_length=100)
    def __str__(self): return self.nameEn


class Country(models.Model):
    name = models.CharField(max_length=100)
    # languages = models.ManyToManyField(Language, related_name='countries')
    flag = models.CharField(max_length=500)
    image = models.CharField(max_length=500)
    description = models.TextField(blank=True)


class Product(models.Model):
    nameAr = models.CharField(max_length=255)
    nameEn = models.CharField(max_length=255)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to=File_Rename('products/', 'nameEn'), storage=OverwriteStorage(), blank=True, null=True)
    descriptionAr = models.TextField()
    descriptionEn = models.TextField()
    stock = models.IntegerField(default=0)
    def __str__(self): return self.nameEn


class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, unique=True)
    orderCount = models.IntegerField(default=0)
    totalSpent = models.DecimalField(
        max_digits=12, decimal_places=2, default=0)
    isBlocked = models.BooleanField(default=False)
    notes = models.TextField(blank=True)


class Order(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name='orders')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shippingCost = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default='جديد')
    date = models.DateTimeField(auto_now_add=True)
    paymentMethod = models.CharField(max_length=50)
    couponCode = models.CharField(max_length=50, blank=True, null=True)
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=20)
    customer_email = models.EmailField(blank=True, null=True)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    address = models.TextField()


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255)
    nameEn = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    image = models.TextField()


class Review(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='reviews')
    userName = models.CharField(max_length=255)
    rating = models.IntegerField()
    comment = models.TextField()
    date = models.DateTimeField(auto_now_add=True)


class StoreSettings(models.Model):
    name = models.CharField(max_length=100, default='Mora scent')
    logo = models.TextField(default='M')
    email = models.EmailField(default='info@morascent.com')
    whatsapp = models.CharField(max_length=20, default='01550294614')
    currency = models.CharField(max_length=10, default='ج.م')
    defaultLanguage = models.CharField(max_length=5, default='ar')
    taxPercentage = models.IntegerField(default=14)
    policy = models.TextField(default='سياسة المتجر')
    aiDevelopmentEnabled = models.BooleanField(default=True)


class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discountType = models.CharField(max_length=20)
    discountValue = models.DecimalField(max_digits=10, decimal_places=2)
    minOrderValue = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)
    expiryDate = models.DateField()
    usageLimit = models.IntegerField(default=100)
    usageCount = models.IntegerField(default=0)
    isActive = models.BooleanField(default=True)


class ShippingCompany(models.Model):
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=100)
    isActive = models.BooleanField(default=True)


class ShippingZone(models.Model):
    city = models.CharField(max_length=100)
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    deliveryTime = models.CharField(max_length=100, default='2-3 أيام')
    isActive = models.BooleanField(default=True)
