from rest_framework import viewsets
from .models import Pitch
from .serializers import PitchSerializer
from rest_framework.permissions import IsAuthenticated
from .filters import PitchFilter 
from django_filters.rest_framework  import DjangoFilterBackend 
from rest_framework.filters import SearchFilter , OrderingFilter 

class PitchViewSet(viewsets.ModelViewSet):
    queryset = Pitch.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = PitchSerializer 
    filter_backends = [DjangoFilterBackend,SearchFilter,OrderingFilter]
    filterset_class = PitchFilter 
    search_fields = ['id','name','location']
    ordering_fields = ['price_per_hour','name','created_at']
    ordering = ['price_per_hour']

