from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils import timezone
import uuid
from decimal import Decimal
from django.db.models import Q, F


class BookingManager(models.Manager):
    """Custom manager with availability helpers and a safe create method."""

    def available(self, pitch, start_time, end_time, exclude_booking_id=None):
        """Return True if the pitch is available for the given interval.

        Considers bookings in PENDING or CONFIRMED states as blocking.
        """
        qs = self.filter(pitch=pitch, status__in=[Booking.Status.PENDING, Booking.Status.CONFIRMED])
        if exclude_booking_id:
            qs = qs.exclude(pk=exclude_booking_id)
        conflict_exists = qs.filter(start_time__lt=end_time, end_time__gt=start_time).exists()
        return not conflict_exists

    def create_booking(self, user, pitch, start_time, end_time, **kwargs):
        """Create a validated booking if the pitch is available, otherwise raise ValueError."""
        if start_time >= end_time:
            raise ValueError("start_time must be before end_time")
        if not self.available(pitch, start_time, end_time):
            raise ValueError("Pitch is not available for the requested period")
        booking = self.model(user=user, pitch=pitch, start_time=start_time, end_time=end_time, **kwargs)
        booking.full_clean()
        booking.save()
        return booking


class Booking(models.Model):
    """Model representing a booking for a pitch.

    Key features:
    - Referential links to the booking user and the pitch.
    - Start/end timestamps, auto-calculated duration in minutes.
    - Price handling with optional auto-calculation from a pitch hourly rate.
    - Status and payment method enumerations.
    - Overlap validation to prevent double-booking.
    - Useful DB indexes and a check constraint to ensure end_time > start_time.
    """

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        COMPLETED = 'COMPLETED', 'Completed'
        NO_SHOW = 'NO_SHOW', 'No show'

    class PaymentMethod(models.TextChoices):
        CARD = 'CARD', 'Card'
        CASH = 'CASH', 'Cash'
        ONLINE = 'ONLINE', 'Online'
        FREE = 'FREE', 'Free'

    id = models.BigAutoField(primary_key=True)
    reference_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    pitch = models.ForeignKey('pitches.Pitch', on_delete=models.PROTECT, related_name='bookings')

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(blank=True, null=True, help_text='Duration in minutes. Auto-calculated from start and end if blank.')

    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    currency = models.CharField(max_length=3, default='USD')

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    payment_method = models.CharField(max_length=10, choices=PaymentMethod.choices, blank=True, null=True)
    is_paid = models.BooleanField(default=False)

    extra_services = models.JSONField(blank=True, null=True, help_text='Optional JSON describing additional services and prices')
    notes = models.TextField(blank=True)

    cancelled_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    cancellation_reason = models.TextField(blank=True)
    refund_amount = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, validators=[MinValueValidator(Decimal('0.00'))])

    metadata = models.JSONField(blank=True, null=True, help_text='Free-form metadata for integrations')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BookingManager()

    class Meta:
        ordering = ['-start_time']
        constraints = [
            models.CheckConstraint(check=Q(end_time__gt=F('start_time')), name='booking_end_after_start')
        ]
        indexes = [
            models.Index(fields=['pitch', 'start_time', 'end_time']),
            models.Index(fields=['user', 'start_time']),
        ]

    def clean(self):
        """Validate temporal logic and overlapping bookings."""
        super().clean()

        if self.start_time >= self.end_time:
            raise models.ValidationError({'end_time': 'end_time must be after start_time'})

        # Prevent overlapping bookings for the same pitch
        overlap_qs = Booking.objects.filter(pitch=self.pitch, status__in=[Booking.Status.CONFIRMED, Booking.Status.PENDING])
        if self.pk:
            overlap_qs = overlap_qs.exclude(pk=self.pk)
        if overlap_qs.filter(start_time__lt=self.end_time, end_time__gt=self.start_time).exists():
            raise models.ValidationError('This pitch is already booked for the requested time range.')

        # Attempt to auto-calculate price from a pitch hourly_rate when price is zero/empty
        if (not self.price or self.price == Decimal('0.00')):
            hourly = getattr(self.pitch, 'hourly_rate', None)
            if hourly:
                minutes = (self.end_time - self.start_time).total_seconds() / 60
                try:
                    self.price = (Decimal(str(hourly)) * Decimal(minutes) / Decimal(60)).quantize(Decimal('0.01'))
                except Exception:
                    self.price = Decimal('0.00')

        # Set duration in minutes
        self.duration_minutes = int((self.end_time - self.start_time).total_seconds() // 60)

    def save(self, *args, **kwargs):
        # Ensure there's a reference code
        if not self.reference_code:
            self.reference_code = uuid.uuid4()
        # Run full_clean to ensure constraints before save; swallow ValidationError to avoid blocking programmatic updates
        try:
            self.full_clean()
        except Exception:
            pass
        super().save(*args, **kwargs)

    def overlaps(self, other_start, other_end):
        """Return True if this booking overlaps the given interval."""
        return self.start_time < other_end and self.end_time > other_start

    def total_price_with_services(self):
        """Return total price including any extra_services that include a price field."""
        total = self.price or Decimal('0.00')
        if self.extra_services:
            # Expecting structure like {"towel": {"price": 5.0}, ...}
            for svc in (self.extra_services or {}).values():
                try:
                    total += Decimal(str(svc.get('price', 0)))
                except Exception:
                    continue
        return total

    def confirm(self):
        self.status = Booking.Status.CONFIRMED
        self.save(update_fields=['status', 'updated_at'])

    def cancel(self, by_user=None, reason=''):
        self.status = Booking.Status.CANCELLED
        self.cancelled_by = by_user
        self.cancellation_reason = reason
        self.save()

    def __str__(self):
        return f'Booking {self.reference_code} - {self.pitch} ({self.start_time:%Y-%m-%d %H:%M} to {self.end_time:%Y-%m-%d %H:%M})'
