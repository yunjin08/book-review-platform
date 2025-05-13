"""
ASGI config for main project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from dotenv import load_dotenv
from django.core.asgi import get_asgi_application

load_dotenv()

# Secure allow-list of environment names
ALLOWED_ENVIRONMENTS = {"development", "production", "staging"}

env = os.getenv("ENVIRONMENT")

if env is None:
    raise RuntimeError(
        "ENVIRONMENT variable must be set (e.g., 'development', 'production', or 'staging')."
    )

if env not in ALLOWED_ENVIRONMENTS:
    raise RuntimeError(
        f"Invalid ENVIRONMENT value: '{env}'. Allowed values are: {', '.join(sorted(ALLOWED_ENVIRONMENTS))}."
    )

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", f"main.settings.{env}"
)

application = get_asgi_application()