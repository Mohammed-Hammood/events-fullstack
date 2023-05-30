from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Event(models.Model):
    title = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    time = models.DateTimeField(null=True)
    location = models.CharField(max_length=255)
    image = models.ImageField(upload_to=f'event/image')
    likes = models.ManyToManyField(User, related_name='likes', blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)

    def like_event(self, user):
        if user not in self.likes.all():
            self.likes.add(user)

    def dislike_event(self, user):
        if user in self.likes.all():
            self.likes.remove(user)

    def __str__(self) -> str:
        return self.title
    class Meta:
        ordering = ['-id']