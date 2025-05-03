# books/models.py
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models import Avg
from django.db.models.signals import post_migrate  # Add this import
from django.dispatch import receiver

DEFAULT_GENRES = [
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Historical Fiction",
]

class Genre(models.Model):
    """Model for book genres"""
    name = models.CharField(max_length=100, unique=True)
    
    class Meta:
        verbose_name = _("Genre")
        verbose_name_plural = _("Genres")
        ordering = ['name']
        
    def __str__(self):
        return self.name
# Signal to add default books
@receiver(post_migrate)
def create_default_genres(sender, **kwargs):
    """Create default genres after migration."""
    if sender.name == 'books':  # Replace 'books' with your app name
        for genre_name in DEFAULT_GENRES:
            Genre.objects.get_or_create(name=genre_name)

class Author(models.Model):
    """Model for book authors"""
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    
    class Meta:
        verbose_name = _("Author")
        verbose_name_plural = _("Authors")
        ordering = ['name']
        
    def __str__(self):
        return self.name

class Book(models.Model):
    """Model for books"""
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, default='Anonymous Author')
    genres = models.ManyToManyField(Genre, related_name='books')
    description = models.TextField(blank=True)
    cover_image = models.URLField(blank=True, null=True)
    isbn = models.CharField(max_length=13, blank=True)
    publication_date = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey("account.CustomUser", on_delete=models.SET_NULL, null=True, related_name='added_books')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _("Book")
        verbose_name_plural = _("Books")
        ordering = ['title']
        
    def __str__(self):
        return self.title
