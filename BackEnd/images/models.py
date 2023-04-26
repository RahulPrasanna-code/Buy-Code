from django.db import models

# Create your models here.
class GlobalImage(models.Model):
    image = models.ImageField(upload_to='global_images')