from .models import Invitation
from rest_framework import serializers


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = "__all__"
        read_only_fields = ["created_at"]
