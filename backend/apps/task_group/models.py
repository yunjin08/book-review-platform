from django.db import models
from apps.group_membership.models import GroupMembership
from apps.account.models import CustomUser

class TaskGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_groups')
    members = models.ManyToManyField(CustomUser, through=GroupMembership, related_name='task_groups')

    def __str__(self):
        return self.name