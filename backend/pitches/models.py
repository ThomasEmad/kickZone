from django.db import models
from ..accounts.models import User

class Pitch(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2)
    is_available = models.BooleanField(default=True)
    owner = models.ForeignKey(User,on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    average_rating = models.FloatField(default=0, help_text="Average user rating (auto-calculated)")

    def __str__(self):
        return self.name
