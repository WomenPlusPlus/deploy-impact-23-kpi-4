from rest_framework import serializers
from .models import Circle, Circle_KPI, KPI, Range, Periodicity


class CircleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Circle
        fields = '__all__'


class RangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Range
        fields = '__all__'


class PeriodicitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Periodicity
        fields = ['type',]


class KPISerializer(serializers.ModelSerializer):
    range = RangeSerializer()
    periodicity = PeriodicitySerializer()

    kpi_circles = serializers.PrimaryKeyRelatedField(
        queryset=Circle.objects.all(),
        many=True,
        write_only=True
    )

    circles = serializers.SerializerMethodField()

    class Meta:
        model = KPI
        fields = [
            'id',
            'name',
            'periodicity',
            'range',
            'circles',
            'kpi_circles'
        ]

    def get_circles(self, obj):
        circles = Circle_KPI.objects.filter(kpi=obj).values('circles')
        circle_data = Circle.objects.filter(pk__in=circles).values('id', 'name')
        return circle_data

    def create(self, validated_data):
        range_data = validated_data.pop('range')
        periodicity_data = validated_data.pop('periodicity')
        circle_data = validated_data.pop('kpi_circles', [])

        periodicity_obj, created = Periodicity.objects.get_or_create(
            **periodicity_data
        )
        range_obj, created = Range.objects.get_or_create(**range_data)

        kpi = KPI.objects.create(
            periodicity_id=periodicity_obj.id,
            range_id=range_obj.id,
            **validated_data
        )

        for circle in circle_data:
            Circle_KPI.objects.get_or_create(circles=circle, kpi=kpi)

        return kpi
