from django.contrib import admin
from .models import Circle, Circle_KPI, KPI, User, Role, User_Circle, Audit, Period, Periodicity, Range


# Register your models here.
admin.site.register(Circle)
admin.site.register(Circle_KPI)
admin.site.register(KPI)
admin.site.register(User)
admin.site.register(Role)
admin.site.register(User_Circle)
admin.site.register(Audit)
admin.site.register(Period)
admin.site.register(Periodicity)
admin.site.register(Range)
