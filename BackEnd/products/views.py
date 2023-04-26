from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,ProductSerializer
from rest_framework.permissions import IsAdminUser,IsAuthenticatedOrReadOnly,IsAuthenticated,DjangoModelPermissions
from rest_framework.authentication import TokenAuthentication,SessionAuthentication

from .models import Product


class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser,DjangoModelPermissions]

class SingleProductView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication,SessionAuthentication]
    permission_classes =[IsAuthenticatedOrReadOnly]

class ProductView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [SessionAuthentication,TokenAuthentication]


class UserProductView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication,TokenAuthentication]

    def get_queryset(self):
        user = self.kwargs['user']
        query_set = Product.objects.filter(owner=user)
        if len(query_set) == 0:
            query_set = None
        return query_set
        return super().get_queryset()
    
   

