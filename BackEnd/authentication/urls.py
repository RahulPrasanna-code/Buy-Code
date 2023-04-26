from django.urls import path
from .views import TokenView,UserView,FeedbackView
from products.views import UserProductView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('users/<id>',UserView.as_view()),
    path('login/',obtain_auth_token),
    path('get_user/<key>',TokenView.as_view()),
    path('products/<user>',UserProductView.as_view()),
    path('feedback/',FeedbackView.as_view())
]
