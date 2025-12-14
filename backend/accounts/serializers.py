from rest_framework import serializers
from django.contrib.auth import get_user_model  
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from django.contrib.auth.hashers import check_password  
from .models import User 


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required = True , validators = [UniqueValidator( queryset =  User.objects.all() , message="Email already exist.")] )

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value


    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
    
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ('username','password')
     
    def validate(self,data):
        try:
            user = User.objects.filter(username = data['username'] ) 
        except User.DoesNotExist:
            raise  serializers.ValidationError('Invalid Username or Password')
        if not check_password(data['password',user.password]):
            raise serializers.ValidationError('Invalid username or Password')
        data['user'] = user 
        return data 
    
            
        
