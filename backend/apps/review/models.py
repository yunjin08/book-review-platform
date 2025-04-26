# reviews/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from apps.account.models import CustomUser
from apps.book.models import Book

class Review(models.Model):
    """Model for book reviews"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    title = models.CharField(max_length=255, blank=True)
    body = models.TextField()
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _("Review")
        verbose_name_plural = _("Reviews")
        unique_together = ['user', 'book']  # One review per user per book
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.user.username}'s review of {self.book.title}"
    
    def save(self, *args, **kwargs):
        """Update user review count on save"""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Update user review count if this is a new review
        if is_new:
            user = self.user
            user.reviews_count = user.reviews.count()
            user.save(update_fields=['reviews_count'])

class Comment(models.Model):
    """Model for comments on reviews"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comments')
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='comments')
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _("Comment")
        verbose_name_plural = _("Comments")
        ordering = ['created_at']
        
    def __str__(self):
        return f"Comment by {self.user.username} on {self.review}"