from django.shortcuts import render
from rest_framework.authtoken.models import Token
from .serializers import TokenSerializer,FeedbackSerializer
from rest_framework import generics
# Create your views here.
from products.serializers import UserSerializer
from django.contrib.auth.models import User

from .models import Feedback

class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class =  UserSerializer
    lookup_field = 'id'


class TokenView(generics.RetrieveAPIView):
    queryset = Token.objects.all()
    serializer_class = TokenSerializer
    lookup_field = 'key'

class FeedbackView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    