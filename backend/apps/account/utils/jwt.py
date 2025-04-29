from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError
from dotenv import load_dotenv
import os
import datetime
import uuid
from main.settings import JWT_SECRET_KEY

def sign_as_jwt(payload, algorithm="HS256"):
    load_dotenv()

    jwt_secret_key = JWT_SECRET_KEY
    
    # Add standard JWT claims
    now = datetime.datetime.now(datetime.timezone.utc)
    payload.update({
        'iat': int(now.timestamp()),  # Issued at (Unix timestamp)
        'exp': int((now + datetime.timedelta(hours=1)).timestamp()),  # Expires in 1 hour (Unix timestamp)
        'jti': str(uuid.uuid4()),  # Unique token identifier
        'iss': 'book-review-platform',  # Issuer
    })
    
    token = encode(payload, jwt_secret_key, algorithm)
    return token


def verify_jwt_token(token: str, email: str, algorithm="HS256"):
    load_dotenv()

    jwt_secret_key = os.getenv("JWT_SECRET_KEY")

    try:
        payload = decode(token, jwt_secret_key, algorithms=[algorithm])
    except Exception as e:
        raise InvalidTokenError(f"Invalid token: {str(e)}")

    if email != payload.get("email"):
        raise InvalidTokenError("Email mismatch")

    if "exp" in payload:
        exp_timestamp = payload["exp"]
        if datetime.datetime.now(datetime.timezone.utc).timestamp() > exp_timestamp:
            raise ExpiredSignatureError("Token has expired")

    return payload
