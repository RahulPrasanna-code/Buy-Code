from django.shortcuts import render
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated
from rest_framework.response import Response
from products.serializers import ProductCartSerializer
from products.models import ProductCart
# Create your views here.


class ProductCartView(generics.ListAPIView):
    serializer_class = ProductCartSerializer

    def get_queryset(self):
        user = self.kwargs['user']
        query_set = ProductCart.objects.filter(user=user)
        if len(query_set) == 0:
            query_set = None
        return query_set

class ProductCartItemsView(generics.ListCreateAPIView):
    queryset = ProductCart.objects.all()
    serializer_class = ProductCartSerializer
    authentication_classes = [TokenAuthentication,SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def create(self, request, *args, **kwargs):

        product = request.data['product']
        user =  request.data['user']
        print(product,user)
        qs = ProductCart.objects.filter(user=user,product=product)
        print(qs)
        if qs.exists():
            return Response({"detail":"Wait a min"})
        return super().create(request, *args, **kwargs)

class ProductCartUpdateView(generics.UpdateAPIView):
    queryset = ProductCart.objects.all()
    serializer_class = ProductCartSerializer
    authentication_classes = [SessionAuthentication,TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

class ProductCartRemoveView(generics.DestroyAPIView):
    queryset = ProductCart.objects.all()
    serializer_class = ProductCartSerializer
    authentication_classes = [SessionAuthentication,TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'