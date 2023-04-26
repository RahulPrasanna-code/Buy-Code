from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Product(models.Model):
    owner = models.ForeignKey(User,on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(decimal_places=2,max_digits=20)
    rating = models.DecimalField(default=0.0,decimal_places=1,max_digits=2)
    rating_count = models.IntegerField(default=0)
    description = models.TextField()
    thumb_nail = models.ImageField(upload_to="product_images")

class ProductImage(models.Model):
    image = models.ImageField(upload_to="product_images")
    product = models.ForeignKey(Product,on_delete=models.CASCADE)

class ProductCart(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def cart_total(self):
        return self.product.price * self.quantity

class ProductOrder(models.Model):
    buyer = models.ForeignKey(User,on_delete=models.CASCADE)
    date_and_time = models.DateTimeField()
    status = models.BooleanField(default=False)
    payment_status = models.BooleanField(default=False)

