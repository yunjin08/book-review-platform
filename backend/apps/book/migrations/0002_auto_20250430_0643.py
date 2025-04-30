from django.db import migrations

DEFAULT_GENRES = [
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Historical Fiction",
]

def add_default_genres(apps, schema_editor):
    Genre = apps.get_model('book', 'Genre')
    for genre_name in DEFAULT_GENRES:
        Genre.objects.get_or_create(name=genre_name)

class Migration(migrations.Migration):
    dependencies = [
        ('book', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_default_genres),
    ]