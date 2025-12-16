from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        OWNER = "OWNER", "Owner"
        PLAYER = "PLAYER", "Player"

    class Position(models.TextChoices):
        GK = "GK", "Goalkeeper"
        DEFENDER = "DEFENDER", "Defender"
        MIDFIELDER = "MIDFIELDER", "Midfielder"
        STRIKER = "STRIKER", "Striker"
        WINGER = "WINGER", "Winger"
        ALL_ROUNDER = "ALL_ROUNDER", "All Rounder"

    class SkillLevel(models.TextChoices):
        BEGINNER = "BEGINNER", "Beginner"
        NOVICE = "NOVICE", "Novice"
        INTERMEDIATE = "INTERMEDIATE", "Intermediate"
        ADVANCED = "ADVANCED", "Advanced"
        PROFESSIONAL = "PROFESSIONAL", "Professional"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.PLAYER)
    position = models.CharField(
        max_length=15,
        choices=Position.choices,
        blank=True,
        null=True,
        help_text="Player position (required if role is PLAYER)"
    )
    skill_level = models.CharField(
        max_length=15,
        choices=SkillLevel.choices,
        blank=True,
        null=True,
        help_text="Skill level (required if role is PLAYER)"
    )
    phone = models.CharField(max_length=15, blank=True)
    # avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def clean(self):
        super().clean()
        if self.role == self.Role.PLAYER:
            if not self.position:
                raise models.ValidationError({'position': 'Position is required for users with PLAYER role.'})
            if not self.skill_level:
                raise models.ValidationError({'skill_level': 'Skill level is required for users with PLAYER role.'})
        else:
            self.position = None
            self.skill_level = None

    def __str__(self):
        return f"{self.username} ({self.role})"
