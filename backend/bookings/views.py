from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Booking
from .serializers import BookingSerializer
from django.utils import timezone
from rest_framework import filters

# Create your views here.

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet for managing bookings."""
    queryset = Booking.objects.select_related('user', 'pitch').all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['start_time', 'created_at', 'status']
    search_fields = ['reference_code', 'pitch__name', 'user__username']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not user.is_staff:
            qs = qs.filter(user=user)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsOwnerOrReadOnly])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        reason = request.data.get('reason', '')
        booking.cancel(by_user=request.user, reason=reason)
        return Response({'status': 'cancelled', 'id': booking.id})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_bookings(self, request):
        qs = self.get_queryset().filter(user=request.user)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
