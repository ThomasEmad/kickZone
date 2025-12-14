from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        OWNER = "OWNER", "Owner"
        PLAYER = "PLAYER", "Player"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.PLAYER)
    phone = models.CharField(max_length=15, blank=True)
    # avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
