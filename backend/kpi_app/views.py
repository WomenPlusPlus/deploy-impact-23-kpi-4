from django.views.generic import TemplateView
from rest_framework import viewsets

from .models import Circle, KPI
from .serializers import CircleSerializer, KPISerializer


class React(TemplateView):
    """
    Serve React frontend through Django static files.
    """
    template_name = 'index.html'


class CircleViewSet(viewsets.ModelViewSet):
    queryset = Circle.objects.all()
    serializer_class = CircleSerializer


class KPIViewSet(viewsets.ModelViewSet):
    queryset = KPI.objects.all()
    serializer_class = KPISerializer
