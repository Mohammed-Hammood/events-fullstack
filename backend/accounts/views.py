from rest_framework.decorators import api_view, permission_classes, authentication_classes
import json
from .serializers import UserCreateUpdateSerializer, UserSerializer
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, logout


User = get_user_model()


@api_view(['POST'])
@permission_classes([])
@authentication_classes([TokenAuthentication])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    logout(request)
    return Response({})



@api_view(['POST'])
def register_view(request):
    data = json.loads(request.body)
    serializer = UserCreateUpdateSerializer(data=data, many=False)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=serializer.data['username'])
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'user created',
            'user': serializer.data,
            'token': token.key,
        })
    return Response({
        'messages': 'Not created',
        'errors': serializer.errors,
    })


@api_view(['POST'])
def login_view(request):
    data = json.loads(request.body)
    password = data['password']
    username = data['username']
    user = authenticate(request=request, username=username, password=password)
    if user:
        serializer = UserSerializer(user, many=False)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': serializer.data,
            'token': token.key,
        })
    return Response({
        'error': 'Username or password is not correct',
        })



@api_view(['GET'])
@permission_classes([])
@authentication_classes([TokenAuthentication])
def user_view(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(instance=request.user, many=False)
        return Response({
            'user': serializer.data,
        })
    return Response({
        'user': None
    })

