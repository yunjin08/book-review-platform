import random
from django.core.management.base import BaseCommand
from apps.book.models import Book, Genre, Author
from apps.account.models import CustomUser
from apps.review.models import Review

# Sample data
GENRES = [
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Historical Fiction",
    "Thriller",
    "Non-Fiction",
    "Biography",
    "Self-Help",
    "Adventure",
]

BOOKS = [
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "description": "A novel set in the Jazz Age that explores themes of wealth, love, and the American Dream.",
        "cover_image": "https://i.ebayimg.com/images/g/AREAAOSw3L1f2LHF/s-l1200.jpg",
        "isbn": "9780743273565",
        "publication_date": "1925-04-10",
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "description": "A dystopian novel that delves into the dangers of totalitarianism and extreme political ideology.",
        "cover_image": "https://cdn.britannica.com/21/182021-050-666DB6B1/book-cover-To-Kill-a-Mockingbird-many-1961.jpg",
        "isbn": "9780451524935",
        "publication_date": "1949-06-08",
    },
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "description": "A novel about racial injustice and moral growth in the Deep South.",
        "cover_image": "https://cdn.britannica.com/21/182021-050-666DB6B1/book-cover-To-Kill-a-Mockingbird-many-1961.jpg",
        "isbn": "9780061120084",
        "publication_date": "1960-07-11",
    },
]

USERS = [
    {"username": "john_doe", "email": "john@example.com", "password": "password123"},
    {"username": "jane_doe", "email": "jane@example.com", "password": "password123"},
    {"username": "admin", "email": "admin@example.com", "password": "admin123", "is_staff": True, "is_superuser": True},
]

REVIEWS = [
    "Amazing book! Highly recommend.",
    "A thought-provoking read.",
    "Couldn't put it down!",
    "Not my favorite, but still worth reading.",
    "A classic that everyone should read.",
]

class Command(BaseCommand):
    help = "Populate the database with initial data for first-time users."

    def handle(self, *args, **kwargs):
        # Create genres
        self.stdout.write("Creating genres...")
        for genre_name in GENRES:
            Genre.objects.get_or_create(name=genre_name)

        # Create authors and books
        self.stdout.write("Creating books...")
        for book_data in BOOKS:
            author, _ = Author.objects.get_or_create(name=book_data["author"])
            book, _ = Book.objects.get_or_create(
                title=book_data["title"],
                author=book_data["author"],
                description=book_data["description"],
                cover_image=book_data["cover_image"],
                isbn=book_data["isbn"],
                publication_date=book_data["publication_date"],
            )
            # Assign random genres to the book
            genres = Genre.objects.order_by("?")[:3]  # Assign 3 random genres
            book.genres.set(genres)

        # Create users
        self.stdout.write("Creating users...")
        for user_data in USERS:
            user, created = CustomUser.objects.get_or_create(
                username=user_data["username"],
                email=user_data["email"],
                defaults={"is_staff": user_data.get("is_staff", False), "is_superuser": user_data.get("is_superuser", False)},
            )
            if created:
                user.set_password(user_data["password"])
                user.save()

        # Create reviews
        self.stdout.write("Creating reviews...")
        books = Book.objects.all()
        users = CustomUser.objects.filter(is_superuser=False)
        for book in books:
            for user in users:
                if random.choice([True, False]):  # Randomly decide whether to create a review
                    Review.objects.create(
                        user=user,
                        book=book,
                        title=f"Review of {book.title}",
                        body=random.choice(REVIEWS),
                        rating=random.randint(1, 5),
                    )

        self.stdout.write(self.style.SUCCESS("Database populated with initial data!"))
import random
from django.core.management.base import BaseCommand
from apps.book.models import Book, Genre, Author
from apps.account.models import CustomUser
from apps.review.models import Review

# Sample data
GENRES = [
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Historical Fiction",
    "Thriller",
    "Non-Fiction",
    "Biography",
    "Self-Help",
    "Adventure",
]

BOOKS = [
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "description": "A novel set in the Jazz Age that explores themes of wealth, love, and the American Dream.",
        "cover_image": "https://i.ebayimg.com/images/g/AREAAOSw3L1f2LHF/s-l1200.jpg",
        "isbn": "9780743273565",
        "publication_date": "1925-04-10",
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "description": "A dystopian novel that delves into the dangers of totalitarianism and extreme political ideology.",
        "cover_image": "https://cdn.britannica.com/21/182021-050-666DB6B1/book-cover-To-Kill-a-Mockingbird-many-1961.jpg",
        "isbn": "9780451524935",
        "publication_date": "1949-06-08",
    },
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "description": "A novel about racial injustice and moral growth in the Deep South.",
        "cover_image": "https://cdn.britannica.com/21/182021-050-666DB6B1/book-cover-To-Kill-a-Mockingbird-many-1961.jpg",
        "isbn": "9780061120084",
        "publication_date": "1960-07-11",
    },
]

USERS = [
    {"username": "john_doe", "email": "john@example.com", "password": "password123"},
    {"username": "jane_doe", "email": "jane@example.com", "password": "password123"},
    {"username": "admin", "email": "admin@example.com", "password": "admin123", "is_staff": True, "is_superuser": True},
]

REVIEWS = [
    "Amazing book! Highly recommend.",
    "A thought-provoking read.",
    "Couldn't put it down!",
    "Not my favorite, but still worth reading.",
    "A classic that everyone should read.",
]

class Command(BaseCommand):
    help = "Populate the database with initial data for first-time users."

    def handle(self, *args, **kwargs):
        # Create genres
        self.stdout.write("Creating genres...")
        for genre_name in GENRES:
            Genre.objects.get_or_create(name=genre_name)

        # Create authors and books
        self.stdout.write("Creating books...")
        for book_data in BOOKS:
            author, _ = Author.objects.get_or_create(name=book_data["author"])
            book, _ = Book.objects.get_or_create(
                title=book_data["title"],
                author=book_data["author"],
                description=book_data["description"],
                cover_image=book_data["cover_image"],
                isbn=book_data["isbn"],
                publication_date=book_data["publication_date"],
            )
            # Assign random genres to the book
            genres = Genre.objects.order_by("?")[:3]  # Assign 3 random genres
            book.genres.set(genres)

        # Create users
        self.stdout.write("Creating users...")
        for user_data in USERS:
            user, created = CustomUser.objects.get_or_create(
                username=user_data["username"],
                email=user_data["email"],
                defaults={"is_staff": user_data.get("is_staff", False), "is_superuser": user_data.get("is_superuser", False)},
            )
            if created:
                user.set_password(user_data["password"])
                user.save()

        # Create reviews
        self.stdout.write("Creating reviews...")
        books = Book.objects.all()
        users = CustomUser.objects.filter(is_superuser=False)
        for book in books:
            for user in users:
                if random.choice([True, False]):  # Randomly decide whether to create a review
                    Review.objects.create(
                        user=user,
                        book=book,
                        title=f"Review of {book.title}",
                        body=random.choice(REVIEWS),
                        rating=random.randint(1, 5),
                    )

        self.stdout.write(self.style.SUCCESS("Database populated with initial data!"))
