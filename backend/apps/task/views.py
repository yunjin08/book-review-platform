from django.shortcuts import render
from .models import Task, TaskGroup


# Create your views here.

class TaskListCreateAPIView(ListCreateAPIView):
    """
    API endpoint for listing and creating tasks
    """
#     serializer_class = TaskSerializer
#     permission_classes = [IsAuthenticated, IsTaskGroupMember]

#     def get_queryset(self):
#         queryset = Task.objects.filter(group__members=self.request.user)
        
#         # Apply filters
#         status_filter = self.request.query_params.get('status')
#         if status_filter:
#             queryset = queryset.filter(status=status_filter)
            
#         priority = self.request.query_params.get('priority')
#         if priority:
#             queryset = queryset.filter(priority=priority)
            
#         assigned_to = self.request.query_params.get('assigned_to')
#         if assigned_to:
#             if assigned_to == 'me':
#                 queryset = queryset.filter(assigned_to=self.request.user)
#             else:
#                 queryset = queryset.filter(assigned_to__id=assigned_to)
        
#         # Search
#         search_query = self.request.query_params.get('search')
#         if search_query:
#             queryset = queryset.filter(
#                 Q(title__icontains=search_query) | 
#                 Q(description__icontains=search_query)
#             )
        
#         # Sort
#         sort_by = self.request.query_params.get('sort_by', 'due_date')
#         if sort_by.startswith('-'):
#             queryset = queryset.order_by(sort_by)
#         else:
#             queryset = queryset.order_by(sort_by)
        
#         return queryset.distinct()

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
        
#         group_id = request.data.get('group')
#         group = get_object_or_404(TaskGroup, id=group_id)
        
#         if not group.members.filter(id=request.user.id).exists():
#             return Response(
#                 {'error': 'You are not a member of this group'}, 
#                 status=status.HTTP_403_FORBIDDEN
#             )
            
#         serializer.save(created_by=request.user, group=group)
#         headers = self.get_success_headers(serializer.data)
#         return Response(
#             serializer.data, 
#             status=status.HTTP_201_CREATED, 
#             headers=headers
#         )

# class TaskRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
#     """
#     API endpoint for retrieving, updating and deleting tasks
#     """
#     serializer_class = TaskSerializer
#     permission_classes = [IsAuthenticated, IsTaskGroupMember]
#     lookup_field = 'pk'

#     def get_queryset(self):
#         return Task.objects.filter(group__members=self.request.user)


# class TaskCompleteAPIView(APIView):
#     """
#     API endpoint for marking a task as complete
#     """
#     permission_classes = [IsAuthenticated, IsTaskGroupMember]

#     def post(self, request, pk):
#         task = get_object_or_404(Task, pk=pk, group__members=request.user)
#         task.status = Task.COMPLETED
#         task.save()
#         return Response(
#             {'status': 'task completed'},
#             status=status.HTTP_200_OK
#         )
