# books/models.py
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models import Avg

class Genre(models.Model):
    """Model for book genres"""
    name = models.CharField(max_length=100, unique=True)
    
    class Meta:
        verbose_name = _("Genre")
        verbose_name_plural = _("Genres")
        ordering = ['name']
        
    def __str__(self):
        return self.name

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
    authors = models.ManyToManyField(Author, related_name='books')
    genres = models.ManyToManyField(Genre, related_name='books')
    description = models.TextField(blank=True)
    cover_image = models.URLField(blank=True)
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
    
    @property
    def average_rating(self):
        """Calculate the average rating for this book"""
        return self.reviews.aggregate(Avg('rating'))['rating__avg'] or 0
    
    @property
    def total_reviews(self):
        """Get the total number of reviews for this book"""
        return self.reviews.count()