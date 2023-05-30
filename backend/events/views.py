from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import EventSerializer, EventCreateUpdateSerializer
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser, JSONParser
from .models import Event
from rest_framework.response import Response
import json


class EventsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes  = [TokenAuthentication]
    
    parser_classes = [MultiPartParser,  FileUploadParser, JSONParser]

    def get_min_number(self, request):
        try:
            return int(request.query_params['min'])
        except:
            return 0

    def get(self, request):
        events = []
        min = self.get_min_number(request)
        limit = 10
        max = min + limit
        if "my-events" in request.path:
            events = Event.objects.filter(user=request.user)[min: max]
        elif "liked-events" in request.path:
            events = Event.objects.filter(likes__id=request.user.id)[min: max]
        elif "all-events" in request.path:
            events = Event.objects.all()[min: max]
        serializer = EventSerializer(events, many=True)
        return Response({
            'events': serializer.data,
        })


    def get_data(self, request):
        data = {}
        data['user'] =  request.user.id
        try:
            data['title'] = request.data['title']
            data['description'] = request.data['description']
            data['time'] = request.data['time']
            data['location'] = request.data['location']
            data['image'] = request.data['image'] 
        except:
            pass
        return data
        
    def post(self, request):
        data = self.get_data(request)
        serializer = EventSerializer(data=data,   many=False)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'event': serializer.data,
            })
        return Response({
            'errors': serializer.errors,
        })
    def put(self, request):
        data = json.loads(request.body)
        context = self.get_data(request)
        try:
            event = Event.objects.get(id=int(data['id']), user=request.user)
        except Event.DoesNotExist:
            return Response({'errors': 'Not found'}, status=404)
        serializer = EventCreateUpdateSerializer(instance=event,  data=context,  many=False)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'event': serializer.data
            })
        return Response({
            'errors': serializer.errors,
        })
    
    def delete(self, request):
        data = json.loads(request.body)
        try:
            event = Event.objects.get(id=int(data['id']), user=request.user)
            event.delete()

            return Response({
                'message': 'Event is deleted' 
            })
        except Event.DoesNotExist:
            return Response({
                'errors': 'Event does not exist',
            })


class LikeToggleAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, event_id):
        try:
            event = Event.objects.get(id=int(event_id))
            event.like_event(user=request.user)
            return Response({
                'message': f'{request.user.username} liked event "{event.title}"'
            })
        except Event.DoesNotExist:
            return Response({
                'error': 'Event not found',
            }, status=404)

    def delete(self, request, event_id):
        try:
            event = Event.objects.get(id=int(event_id))
            event.dislike_event(user=request.user)
            return Response({
                'message': f'{request.user.username} disliked event "{event.title}"'
            })
        except Event.DoesNotExist:
            return Response({
                'error': 'Event not found',
            }, status=404)
