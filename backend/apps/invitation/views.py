from django.shortcuts import render
from main.utils.generic_api import GenericView
from .models import Invitation
from .serializer import InvitationSerializer



# Create your views here.
class InvitationView(GenericView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    # permission_classes = [IsAuthenticated]
