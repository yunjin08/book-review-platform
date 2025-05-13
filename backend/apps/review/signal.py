# reviews/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import transaction
from .models import Review
import threading

# Thread-local storage for scheduled book IDs, ensures per-transaction deduplication
_scheduled_books = threading.local()

def _schedule_book_rating_update(book):
    """
    Schedules a rating stats update for the book after the current DB transaction commits,
    de-duplicating multiple schedule requests within the same transaction/thread.
    """
    if not hasattr(_scheduled_books, 'books'):
        _scheduled_books.books = set()
    # Deduplicate to avoid redundant updates in single transaction
    if book.pk in _scheduled_books.books:
        return
    _scheduled_books.books.add(book.pk)

    def run_update():
        try:
            book.update_rating_stats()
        finally:
            # Clean up after commit so next transaction starts fresh
            _scheduled_books.books.discard(book.pk)
    transaction.on_commit(run_update)

@receiver([post_save, post_delete], sender=Review)
def update_book_ratings(sender, instance, **kwargs):
    # Defensive: If deleted review, instance.book might be stale, but typically accessible.
    book = instance.book
    if book is not None:
        _schedule_book_rating_update(book)