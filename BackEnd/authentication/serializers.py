from rest_framework.authtoken.models import Token
from rest_framework import serializers
from products.serializers import GroupSerializer
from .models import Feedback

class TokenSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)
    email = serializers.CharField(source='user.email',read_only=True)
    class Meta:
        model = Token
        fields = ['user','user_name','email']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id','name','email','subject','content']