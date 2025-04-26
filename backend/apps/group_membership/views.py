from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import TaskGroup, GroupMembership

# Create your views here.
class TaskGroupMembersAPIView(APIView):
    """
    API endpoint for listing group members
    """
    # permission_classes = [IsAuthenticated, IsGroupMember]

    # def get(self, request, pk):
    #     # group = get_object_or_404(TaskGroup, pk=pk, members=request.user)
    #     # memberships = GroupMembership.objects.filter(group=group)
    #     # serializer = GroupMembershipSerializer(memberships, many=True)
    #     # return Response(serializer.data)
