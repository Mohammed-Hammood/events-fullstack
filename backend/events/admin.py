from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):

    list_display = ['id', 'title', 'timestamp', 'time', 'user']
    list_display_links = ['id', 'title', 'timestamp', 'time', 'user']

    list_filter = ['timestamp', ]

admin.site.register(Event, EventAdmin)