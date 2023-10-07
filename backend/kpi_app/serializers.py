from rest_framework import serializers
from .models import Circle, KPI, Range, Periodicity


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
        fields = '__all__'


class KPISerializer(serializers.ModelSerializer):
    range = RangeSerializer()
    periodicity = PeriodicitySerializer()

    class Meta:
        model = KPI
        fields = ['id', 'name', 'periodicity', 'range']

    # update create function to get or create range object
    def create(self, validated_data):
        range_data = validated_data.pop('range')
        range_obj, created = Range.objects.get_or_create(**range_data)
        kpi = KPI.objects.create(range_id=range_obj.id, **validated_data)
        return kpi
