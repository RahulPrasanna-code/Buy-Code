# Generated by Django 4.1.3 on 2022-11-18 05:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0007_remove_product_product_images'),
    ]

    operations = [
        migrations.AddField(
            model_name='productimage',
            name='product',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='products.product'),
            preserve_default=False,
        ),
    ]
