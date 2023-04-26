from django.shortcuts import render

from rest_framework import generics
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser

from .models import GlobalImage
from .serializers import GlobalImageSerializer

from products.models import ProductImage
from products.serializers import ProductImageSerializer

class ProductImageDeleteView(generics.DestroyAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    lookup_field = 'id'

class ProductImageView(generics.ListCreateAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer

class ProductImagesView(generics.ListAPIView):
    serializer_class = ProductImageSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        product = self.kwargs['product']
        query_set = ProductImage.objects.filter(product=product)
        if len(query_set) == 0:
            query_set = None
        return query_set

    def perform_create(self, serializer):
        serializer.save(image=self.request.data.get('image'))

class GlobalImageView(generics.ListCreateAPIView):
    queryset = GlobalImage.objects.all()
    serializer_class = GlobalImageSerializer
