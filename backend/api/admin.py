from django.contrib import admin

# Register your models here.
from .models import Category, Product

class categoryAdminDisplay(admin.ModelAdmin):
    list_display = ['id','nameAr','nameEn']
admin.site.register(Category, categoryAdminDisplay)

class productAdminDisplay(admin.ModelAdmin):
    list_display = ['id','nameAr','nameEn', 'price', 'stock']
admin.site.register(Product, productAdminDisplay)
