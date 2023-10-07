from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

import datetime


# Create your models here.
class Range(models.Model):
    min_value = models.DecimalField(
        decimal_places=2,
        max_digits=8
    )

    max_value = models.DecimalField(
        decimal_places=2,
        max_digits=8
    )

    display_value = models.CharField(
        max_length=150
    )

    # defined ranges should be unique
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    'min_value',
                    'max_value',
                    'display_value'
                ],
                name='unique_range_definition'
            )
        ]

    def __str__(self):
        return self.display_value


class Periodicity(models.Model):
    YEARLY = "Yearly"
    QUARTERLY = "Quarterly"
    MONTHLY = "Monthly"

    PERIODICITY_CHOICES = [
        (YEARLY, "Yearly"),
        (QUARTERLY, "Quarterly"),
        (MONTHLY, "Monthly")
    ]

    type = models.CharField(
        blank=False,
        choices=PERIODICITY_CHOICES
    )

    # create logic to apply periodicity

    description = models.CharField(max_length=150)

    class Meta:
        verbose_name_plural = "Periodicities"

    def __str__(self):
        return self.type


class Period(models.Model):
    YEAR = datetime.date.today().year

    year = models.IntegerField(default=YEAR)
    month = models.IntegerField(null=True)
    quarter = models.IntegerField(null=True)

    def __str__(self):
        return f"Year: {self.year}- Month: {self.month}- Quarter: {self.quarter}"


class Circle(models.Model):
    name = models.CharField(
        unique=True,
        blank=False,
        max_length=50
    )

    def __str__(self):
        return self.name


class KPI(models.Model):
    name = models.CharField(
        unique=True,
        blank=False
    )
    range = models.ForeignKey(Range, on_delete=models.CASCADE)
    periodicity = models.ForeignKey(Periodicity, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Circle_KPI(models.Model):
    circle_id = models.ForeignKey(Circle, on_delete=models.CASCADE)
    kpi_id = models.ForeignKey(KPI, on_delete=models.CASCADE)

    def __str__(self):
        return f"Circle ID: {self.circle_id} and KPI ID: {self.kpi_id}"


class Role(models.Model):
    ADMIN = 'admin'
    GATEKEEPER = 'gatekeeper'
    ECONOMIST = 'economist'
    MEMBER = 'member'

    available_roles = [
        (ADMIN, 'Admin'),
        (GATEKEEPER, 'Gatekeeper'),
        (ECONOMIST, 'Economist'),
        (MEMBER, 'Member')
    ]

    name = models.CharField(
        choices=available_roles,
        default=MEMBER
    )

    description = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class User(AbstractUser):
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.username


@receiver(post_save, sender=User)
def set_default_role(sender, instance, created, **kwargs):
    if created and not instance.role_id:
        instance.role_id = Role.objects.get(name=Role.MEMBER)
        instance.save()


class User_Circle(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    circle_id = models.ForeignKey(Circle, on_delete=models.CASCADE)

    def __str__(self):
        return f"User ID: {self.user_id} and Circle ID: {self.circle_id}"


class Audit(models.Model):
    circle_kpi = models.ForeignKey(Circle_KPI, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    period = models.ForeignKey(Period, on_delete=models.CASCADE)

    value = models.DecimalField(
        decimal_places=2,
        max_digits=16,
        null=True
    )

    # auto_now_add -> sets time when object is 1st created.
    created_timestamp = models.DateTimeField(auto_now_add=True)

    # auto_now -> sets time every time object is saved.
    updated_timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Audit #{self.id}"
