from django.db import models
from django.contrib.auth.models import AbstractUser
from apps.book.models import Book


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
    bio = models.TextField(blank=True)
    profile_picture = models.CharField(max_length=512)
    profile_picture = models.URLField(blank=True)
    books_read_count = models.PositiveIntegerField(default=0)
    reviews_count = models.PositiveIntegerField(default=0)

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
    
    @property
    def currently_reading_books(self):
        return self.reading_lists.filter(status='currently_reading')
    
    @property
    def read_books(self):
        return self.reading_lists.filter(status='read')
    
    def update_counts(self):
        """Update the counts for books read and reviews"""
        self.books_read_count = self.read_books.count()
        self.reviews_count = self.reviews.count()  # Assuming you have a Review model
        self.save()

    def __str__(self):
        return self.username

class ReadingList(models.Model):
    """Model for user reading lists (want to read, currently reading, etc.)"""
    READING_STATUS_CHOICES = [
        ('want_to_read', 'Want to Read'),
        ('currently_reading', 'Currently Reading'),
        ('read', 'Read'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reading_lists')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='in_reading_lists')
    status = models.CharField(max_length=20, choices=READING_STATUS_CHOICES, default='want_to_read')
    date_added = models.DateTimeField(auto_now_add=True)
    date_started = models.DateField(null=True, blank=True)
    date_finished = models.DateField(null=True, blank=True)
    
    class Meta:
        unique_together = ['user', 'book']
        
    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.get_status_display()})"