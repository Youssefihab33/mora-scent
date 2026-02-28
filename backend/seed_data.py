
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Category, Product, StoreSettings

def seed():
    # Categories
    cat_perfumes, _ = Category.objects.get_or_create(ar='عطور', en='Perfumes')

    # Products
    Product.objects.get_or_create(
        name='شانيل رقم 5',
        nameEn='Chanel No. 5',
        price=1500,
        category=cat_perfumes,
        image='https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80',
        description='عطر كلاسيكي خالد.',
        descriptionEn='A timeless classic fragrance.',
        stock=10
    )

    Product.objects.get_or_create(
        name='ديور سوفاج',
        nameEn='Dior Sauvage',
        price=2000,
        category=cat_perfumes,
        image='https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80',
        description='تركيبة راديكالية ونبيلة.',
        descriptionEn='A radical and noble composition.',
        stock=5
    )

    # Store Settings
    StoreSettings.objects.get_or_create(
        name='Mora scent',
        logo='M',
        email='info@morascent.com',
        whatsapp='01550294614',
        currency='ج.م',
        defaultLanguage='ar',
        taxPercentage=14,
        policy='سياسة المتجر',
        aiDevelopmentEnabled=True
    )

    print("Database seeded successfully!")

if __name__ == '__main__':
    seed()
