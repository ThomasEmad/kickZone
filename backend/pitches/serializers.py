from rest_framework import serializers
from .models import Pitch

class PitchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pitch
        fields = ('name','location','price_per_hour')
    def create(self, validated_data):
        user = self.context['request'].user 
        return Pitch.objects.create(owner = user , **validated_data)
    
    def validate_price(self,price):
        if price <= 0 :
            raise serializers.ValidationError("Price per hour must be greater than 0 ")
        return price 
    
    def validate(self, data):
        user = self.context['request'].user 
        if Pitch.objects.filter(owner = user,name = data['name']).exists():
            raise serializers.ValidationError("You already have a pitch with this name ")
        return data 
        
