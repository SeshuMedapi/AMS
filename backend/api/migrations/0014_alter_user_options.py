# Generated by Django 5.1.1 on 2025-01-29 12:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_companybranch_status'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'permissions': (('create_company', ''), ('view_company', ''), ('delete_company', ''), ('create_user', ''), ('edit_user', ''), ('activate_user', ''), ('view_users', ''), ('user_view', ''), ('view_calendar', ''), ('edit_calendar', ''), ('add_role', ''), ('edit_role', ''), ('activate_role', ''), ('punch_in', ''), ('request_leave', ''), ('approve_leave', ''), ('add_branch', ''))},
        ),
    ]
