# Generated by Django 5.1.1 on 2025-01-22 17:22

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_companybranch'),
    ]

    operations = [
        migrations.AddField(
            model_name='companybranch',
            name='city',
            field=models.CharField(default=datetime.datetime(2025, 1, 22, 17, 21, 40, 665123), max_length=300),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='companybranch',
            name='country',
            field=models.CharField(default=datetime.datetime(2025, 1, 22, 17, 21, 57, 98956), max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='companybranch',
            name='state',
            field=models.CharField(default=datetime.datetime(2025, 1, 22, 17, 22, 7, 254333), max_length=200),
            preserve_default=False,
        ),
    ]
