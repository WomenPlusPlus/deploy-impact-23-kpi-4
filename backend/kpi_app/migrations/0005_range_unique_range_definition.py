# Generated by Django 4.2.5 on 2023-10-07 15:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("kpi_app", "0004_rename_periodicity_id_kpi_periodicity_and_more"),
    ]

    operations = [
        migrations.AddConstraint(
            model_name="range",
            constraint=models.UniqueConstraint(
                fields=("min_value", "max_value", "display_value"),
                name="unique_range_definition",
            ),
        ),
    ]