from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.conf import settings
from rest_framework import status
import logging
from apps.account.models import CustomUser
# Get logger instance
logger = logging.getLogger(__name__)

class IsTokenValidated(BasePermission):
    """
    Custom permission class that verifies JWT tokens in requests.
    """
    
    def has_permission(self, request, view):
        # Get the token from the Authorization header
        auth_header = request.headers.get('Authorization')
                        
        if not auth_header:
            logger.warning('No token provided in request')
            raise AuthenticationFailed(
                'No token provided',
                code=status.HTTP_401_UNAUTHORIZED
            )
            
        try:
            # Split the header to get the token part
            token = auth_header.split(' ')[1]
            logger.debug('Attempting to verify token')
            
            # Verify the token using SimpleJWT
            access_token = AccessToken(token)
            payload = access_token.payload
            
            # Removed logging of the full payload to prevent leaking sensitive information
            
            # Store the user in the request for later use
            request.user = CustomUser.objects.get(id=payload['user_id'])
            logger.info('Token successfully verified')
            
            return True
            
        except ExpiredSignatureError:
            logger.warning('Token has expired')
            raise AuthenticationFailed(
                'Token has expired',
                code=status.HTTP_401_UNAUTHORIZED
            )
        except InvalidTokenError:
            logger.warning('Invalid token provided')
            raise AuthenticationFailed(
                'Invalid token',
                code=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            logger.error(f'Unexpected error during token verification: {str(e)}')
            raise AuthenticationFailed(
                str(e),
                code=status.HTTP_401_UNAUTHORIZED
            )