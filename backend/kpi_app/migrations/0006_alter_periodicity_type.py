# Generated by Django 4.2.5 on 2023-10-07 16:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("kpi_app", "0005_range_unique_range_definition"),
    ]

    operations = [
        migrations.AlterField(
            model_name="periodicity",
            name="type",
            field=models.CharField(
                choices=[
                    ("Yearly", "Yearly"),
                    ("Quarterly", "Quarterly"),
                    ("Monthly", "Monthly"),
                ]
            ),
        ),
    ]