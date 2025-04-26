from .models import TaskGroup, Task
from rest_framework import serializers


class TaskGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskGroup
        fields = "__all__"
        read_only_fields = ["created_at"]

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ["created_at"]