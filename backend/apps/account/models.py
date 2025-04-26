from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class CustomUser(AbstractUser):
    """
    **Fields:**
    - first_name: CharField to store the first name of the user.
    - last_name: CharField to store the last name of the user.
    - password: CharField to store the password of the user.
    - email: EmailField to store the email address of the user.
    - is_admin: BooleanField to store whether the user is an admin or not.
    - username: CharField to store the username of the user.
    - profile_picture: ForeignKey to store the profile picture of the user.
    - removed: BooleanField to store whether the user is removed or not.
    """

    profile_picture = models.CharField(max_length=512)
    removed = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="customuser_set",
        blank=True,
        help_text=(
            "The groups this user belongs to. A user will get all permissions "
            "granted to each of their groups."
        ),
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="customuser_permissions_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.username
    
class GroupMembership(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    group = models.ForeignKey('task.TaskGroup', on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'group')
    
    def __str__(self):
        return f"{self.user.username} - {self.group.name} ({self.role})"

