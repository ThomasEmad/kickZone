from rest_framework import serializers
from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    pitch = serializers.StringRelatedField(read_only=True)
    pitch_id = serializers.PrimaryKeyRelatedField(queryset=None, source='pitch', write_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'user', 'pitch', 'pitch_id', 'score', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'pitch', 'created_at']

    def __init__(self, *args, **kwargs):
        from pitches.models import Pitch
        super().__init__(*args, **kwargs)
        self.fields['pitch_id'].queryset = Pitch.objects.all()

    def validate(self, data):
        user = self.context['request'].user
        pitch = data.get('pitch')
        if Rating.objects.filter(user=user, pitch=pitch).exists():
            raise serializers.ValidationError('You have already rated this pitch.')
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        rating = Rating.objects.create(user=user, **validated_data)
        return rating
