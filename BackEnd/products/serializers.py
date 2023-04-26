from django.contrib.auth.models import User,Group
from .models import Product,ProductImage,ProductCart
from rest_framework import serializers

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    groups = GroupSerializer(many=True)
    class Meta:
        model = User
        fields = ['first_name','email','username','password','groups']


    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ['id','owner','description', 'name','price','rating','rating_count','thumb_nail']
        read_only_fields = []
    
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model =ProductImage
        fields = ['id','image','product']

class ProductCartSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name',read_only = True)
    product_price = serializers.CharField(source='product.price',read_only = True)
    product_rating = serializers.CharField(source='product.rating',read_only = True)
    product_ratingcount = serializers.CharField(source='product.rating_count',read_only = True)
    product_thumbnail = serializers.ImageField(source='product.thumb_nail',read_only = True)
    class Meta:
        model = ProductCart
        fields = ['id','user','product','quantity','product_name','product_price','product_rating','product_ratingcount','product_thumbnail']
