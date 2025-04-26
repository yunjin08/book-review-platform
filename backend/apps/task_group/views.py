# api/views.py
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
# from django.db.models import Q
# from .models import TaskGroup, Task, GroupMembership, Invitation
# from .serializers import (
#     TaskGroupSerializer, TaskSerializer, GroupMembershipSerializer, 
#     InvitationSerializer, UserSerializer
# )
# from .permissions import IsGroupMember, IsGroupAdmin, IsTaskGroupMember


class TaskGroupListCreateAPIView(ListCreateAPIView):
    """
    API endpoint for listing and creating task groups
    """
    # serializer_class = TaskGroupSerializer
    # permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     return TaskGroup.objects.filter(members=self.request.user).distinct()

    # def perform_create(self, serializer):
    #     group = serializer.save(created_by=self.request.user)
    #     GroupMembership.objects.create(
    #         user=self.request.user,
    #         group=group,
    #         role=GroupMembership.ADMIN
    #     )


class TaskGroupRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating and deleting task groups
    """
    # serializer_class = TaskGroupSerializer
    # permission_classes = [IsAuthenticated, IsGroupMember]
    # lookup_field = 'pk'

    # def get_queryset(self):
    #     return TaskGroup.objects.filter(members=self.request.user)


class TaskGroupInviteAPIView(APIView):
    """
    API endpoint for inviting users to a task group
    """
    permission_classes = [IsAuthenticated, IsGroupAdmin]

    # def post(self, request, pk):
    #     group = get_object_or_404(TaskGroup, pk=pk, members=request.user)
    #     email = request.data.get('email')
        
    #     if not email:
    #         return Response(
    #             {'error': 'Email is required'}, 
    #             status=status.HTTP_400_BAD_REQUEST
    #         )
        
    #     # TODO: Generate invitation logic
    #     # TODO: Send email notification
        
    #     return Response(
    #         {'status': f'Invitation sent to {email}'},
    #         status=status.HTTP_200_OK
    #     )
