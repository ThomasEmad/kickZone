from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Rating
from .serializers import RatingSerializer
from pitches.models import Pitch

class RatePitchView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ViewHistoryView(generics.ListAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def book_pitch(request):
    # This is a placeholder. Actual booking logic should be in bookings app.
    return Response({'detail': 'Booking logic should be handled in the bookings app.'}, status=400)
