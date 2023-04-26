from django.urls import path
from cart.views import ProductCartView,ProductCartItemsView,ProductCartUpdateView,ProductCartRemoveView

urlpatterns = [
    path('products/',ProductCartItemsView.as_view()),
    path('products/<user>',ProductCartView.as_view()),
    path('update/<id>',ProductCartUpdateView.as_view()),
    path('delete/<id>',ProductCartRemoveView.as_view())
]
