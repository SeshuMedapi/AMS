# Generated by Django 5.1.1 on 2024-11-12 05:14

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_calendarevent'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendarevent',
            name='user',
            field=models.ForeignKey(default=50, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
