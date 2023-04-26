from rest_framework import serializers

from .models import ProductCart

def validate_product(value):
    qs = ProductCart.objects.filter()