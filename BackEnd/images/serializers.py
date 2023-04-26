from .models import GlobalImage
from rest_framework import serializers

class GlobalImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalImage
        fields = ['id','image']