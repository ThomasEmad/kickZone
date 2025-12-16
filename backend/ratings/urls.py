from django.urls import path
from .views import RatePitchView, ViewHistoryView, book_pitch

urlpatterns = [
    path('rate/', RatePitchView.as_view(), name='rate-pitch'),
    path('history/', ViewHistoryView.as_view(), name='view-history'),
    path('book/', book_pitch, name='book-pitch'),
]
