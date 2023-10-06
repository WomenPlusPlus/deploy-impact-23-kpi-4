from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'circles', views.CircleViewSet, basename='circles')
router.register(r'kpis', views.KPIViewSet, basename='kpis')

urlpatterns = [
    path(r'', views.React.as_view()),
    path('api/', include(router.urls))
]
