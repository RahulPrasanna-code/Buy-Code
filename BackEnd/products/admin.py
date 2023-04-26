from django.contrib import admin
from .models import ProductImage,Product,ProductCart
# Register your models here.
admin.site.register(ProductImage)
admin.site.register(Product)
admin.site.register(ProductCart)