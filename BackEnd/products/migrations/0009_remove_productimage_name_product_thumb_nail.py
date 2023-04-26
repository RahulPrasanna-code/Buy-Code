# Generated by Django 4.1.3 on 2022-11-18 13:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0008_productimage_product'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productimage',
            name='name',
        ),
        migrations.AddField(
            model_name='product',
            name='thumb_nail',
            field=models.ImageField(default='http://127.0.0.1:8000/uploads/product_images/default.jpg', upload_to='product_images'),
            preserve_default=False,
        ),
    ]