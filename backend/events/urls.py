from django.urls import path
from .views import (
    EventsAPIView,
    LikeToggleAPIView,
)


urlpatterns = [
    path('likes-toggle/<event_id>', LikeToggleAPIView.as_view(), name='like-toggle'),
    path('all-events', EventsAPIView.as_view(), name='all-events'),
    path('liked-events', EventsAPIView.as_view(), name='liked-events'),
    path('my-events', EventsAPIView.as_view(), name='my-events'),
]