from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'reference_code', 'user', 'pitch', 'start_time', 'end_time',
        'status', 'is_paid', 'price', 'currency', 'created_at', 'updated_at'
    )
    list_filter = ('status', 'is_paid', 'pitch', 'currency', 'created_at')
    search_fields = ('reference_code', 'user__username', 'pitch__name')
    readonly_fields = ('reference_code', 'created_at', 'updated_at', 'duration_minutes')
    autocomplete_fields = ['user', 'pitch']
    ordering = ('-start_time',)
    fieldsets = (
        (None, {
            'fields': ('user', 'pitch', 'start_time', 'end_time', 'duration_minutes', 'price', 'currency', 'status', 'is_paid')
        }),
        ('Details', {
            'fields': ('reference_code', 'payment_method', 'extra_services', 'notes', 'metadata')
        }),
        ('Cancellation', {
            'fields': ('cancelled_by', 'cancellation_reason', 'refund_amount')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
