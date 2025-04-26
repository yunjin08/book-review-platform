from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

class Invitation(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('DECLINED', 'Declined'),
    ]
    
    email = models.EmailField()
    group = models.ForeignKey(TaskGroup, on_delete=models.CASCADE, related_name='invitations')
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invitations')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    token = models.CharField(max_length=64, unique=True)
    
    def __str__(self):
        return f"Invitation to {self.email} for {self.group.name}"