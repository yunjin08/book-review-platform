from django.db import models
from apps.account.models import CustomUser

class GroupMembership(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    group = models.ForeignKey('task_group.TaskGroup', on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'group')
    
    def __str__(self):
        return f"{self.user.username} - {self.group.name} ({self.role})"
