from django.urls import path,include
from .views import UserView,ProductView,SingleProductView

urlpatterns = [
    path('users',UserView.as_view()),
    path('',ProductView.as_view()),
    path('<pk>', SingleProductView.as_view()),
    path('api-auth/', include('rest_framework.urls')),
]
