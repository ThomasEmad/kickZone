import django_filters 
from .models import Pitch 

class PitchFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price_per_hour',lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price_per_hour', lookup_expr='lte')
    location = django_filters.CharFilter(field_name='location',lookup_expr='icontains')
    is_available = django_filters.BooleanFilter()

    class Meta:
        model = Pitch 
        fields = ['location','is_available']