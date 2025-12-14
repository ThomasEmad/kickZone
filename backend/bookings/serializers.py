from rest_framework import serializers
from .models import Booking
from pitches.models import Pitch
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

class UserDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PitchDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pitch
        fields = ['id', 'name', 'location', 'hourly_rate']

class BookingSerializer(serializers.ModelSerializer):
    user = UserDisplaySerializer(read_only=True)
    pitch = PitchDisplaySerializer(read_only=True)
    pitch_id = serializers.PrimaryKeyRelatedField(queryset=Pitch.objects.all(), source='pitch', write_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'reference_code', 'user', 'pitch', 'pitch_id',
            'start_time', 'end_time', 'duration_minutes',
            'price', 'currency', 'total_price',
            'status', 'payment_method', 'is_paid',
            'extra_services', 'notes',
            'cancelled_by', 'cancellation_reason', 'refund_amount',
            'metadata', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'reference_code', 'user', 'pitch', 'duration_minutes', 'total_price', 'created_at', 'updated_at']

    def get_total_price(self, obj):
        return obj.total_price_with_services()

    def validate(self, data):
        # Extract pitch, start_time, end_time
        pitch = data.get('pitch') or self.instance and self.instance.pitch
        start_time = data.get('start_time') or self.instance and self.instance.start_time
        end_time = data.get('end_time') or self.instance and self.instance.end_time
        if not (pitch and start_time and end_time):
            return data
        # Check for overlaps
        qs = Booking.objects.filter(pitch=pitch, status__in=[Booking.Status.PENDING, Booking.Status.CONFIRMED])
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.filter(start_time__lt=end_time, end_time__gt=start_time).exists():
            raise serializers.ValidationError('This pitch is already booked for the requested time range.')
        if start_time >= end_time:
            raise serializers.ValidationError('end_time must be after start_time')
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        pitch = validated_data.pop('pitch')
        booking = Booking(user=user, pitch=pitch, **validated_data)
        booking.full_clean()
        booking.save()
        return booking

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.full_clean()
        instance.save()
        return instance
