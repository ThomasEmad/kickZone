from django.db import models
from django.conf import settings
from pitches.models import Pitch
from bookings.models import Booking
from django.db.models import Avg
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings')
    pitch = models.ForeignKey(Pitch, on_delete=models.CASCADE, related_name='ratings')
    score = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'pitch')
        ordering = ['-created_at']

    def clean(self):
        # User must have a confirmed/completed booking for this pitch
        has_booking = Booking.objects.filter(user=self.user, pitch=self.pitch, status__in=[Booking.Status.CONFIRMED, Booking.Status.COMPLETED]).exists()
        if not has_booking:
            raise models.ValidationError('You can only rate pitches you have booked.')

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

@receiver([post_save, post_delete], sender=Rating)
def update_pitch_average_rating(sender, instance, **kwargs):
    pitch = instance.pitch
    avg = pitch.ratings.aggregate(avg=Avg('score'))['avg']
    pitch.average_rating = avg or 0
    pitch.save(update_fields=['average_rating'])

# Create your models here.
