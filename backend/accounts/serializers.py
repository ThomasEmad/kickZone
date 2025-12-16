from rest_framework import serializers
from django.contrib.auth import get_user_model  
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from django.contrib.auth.hashers import check_password  
from .models import User 


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required = True , validators = [UniqueValidator( queryset =  User.objects.all() , message="Email already exist.")] )
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.PLAYER)
    position = serializers.ChoiceField(choices=User.Position.choices, required=False, allow_null=True, allow_blank=True)
    skill_level = serializers.ChoiceField(choices=User.SkillLevel.choices, required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'position', 'skill_level')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate(self, data):
        role = data.get('role', User.Role.PLAYER)
        position = data.get('position')
        skill_level = data.get('skill_level')
        if role == User.Role.PLAYER:
            if not position:
                raise serializers.ValidationError({'position': 'Position is required for users with PLAYER role.'})
            if not skill_level:
                raise serializers.ValidationError({'skill_level': 'Skill level is required for users with PLAYER role.'})
        else:
            data['position'] = None
            data['skill_level'] = None
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            role=validated_data.get('role', User.Role.PLAYER),
            position=validated_data.get('position'),
            skill_level=validated_data.get('skill_level')
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



