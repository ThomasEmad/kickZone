from django.urls import path 
from .views import BookingViewSet

urlpatterns = [
  path('',BookingViewSet,name='bookings') 
]