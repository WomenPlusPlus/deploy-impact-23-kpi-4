# Generated by Django 4.2.5 on 2023-10-07 17:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("kpi_app", "0006_alter_periodicity_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="period",
            name="month",
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name="period",
            name="quarter",
            field=models.IntegerField(null=True),
        ),
    ]