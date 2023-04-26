from django.db import models

# Create your models here.
class Feedback(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    subject = models.CharField(max_length=255)
    content = models.TextField(max_length=300)