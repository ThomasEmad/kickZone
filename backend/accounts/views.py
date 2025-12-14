from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.decorators import api_view 


@api_view(['POST'])
def login_account(request):
    serializer = LoginSerializer(data = request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']
        return Response({"messege":"Login Successfully!","username":user.username , "email": user.email})
    return Response(serializer.errors , status=404)

    
@api_view(['POST'])    
def register_account(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        data = {'username': user.username, 'email': user.email}
        return Response({'message': 'User registered', 'data': data}, status=201)
    return Response(serializer.errors, status=400)
