from django.shortcuts import render
from main.utils.generic_api import GenericView
from .models import Task, TaskGroup
from .serializer import TaskGroupSerializer, TaskSerializer


class TaskGroupView(GenericView):
    queryset = TaskGroup.objects.all()
    serializer_class = TaskGroupSerializer
    # permission_classes = [IsAuthenticated]

class TaskView(GenericView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    # permission_classes = [IsAuthenticated]
