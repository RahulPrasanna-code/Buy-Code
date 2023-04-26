from django.urls import path,include
from .views import ProductImageView,ProductImagesView,ProductImageDeleteView,GlobalImageView

urlpatterns = [
    path('',ProductImageView.as_view()),
    path('product/<product>',ProductImagesView.as_view()),
    path('delete/<id>',ProductImageDeleteView.as_view()),
    path('global/',GlobalImageView.as_view())
]
