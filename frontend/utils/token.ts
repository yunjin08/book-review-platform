import Cookies from 'js-cookie'
import { AuthTokens } from '@/interface/auth'

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    EMAIL: 'user_email'
}

// Get tokens from cookies
// NOTE: access/refresh tokens are no longer accessible via JS for security (HttpOnly)
export const getToken = (): {
    token: string | null
    refresh: string | null
    email: string | null
} => {
    // Access & refresh tokens must be stored via HttpOnly cookies by the backend
    // They cannot be accessed via JavaScript for security (see CWE-1004).
    const accessToken = null;
    const refreshToken = null;
    const email = Cookies.get(STORAGE_KEYS.EMAIL)

    return {
        token: accessToken,
        refresh: refreshToken,
        email: email || null,
    }
}

// Common cookie options to ensure consistent behavior across browsers
const getCookieOptions = (expiresInDays = 7) => ({
    expires: expiresInDays,
    path: '/',
    sameSite: 'Lax' as const,
    secure: true // Always set cookies as Secure
    // httpOnly cannot be set from JS-cookie; 
    // tokens should not be settable from JS at all.
});

// Save tokens to cookies
export const saveTokens = (tokens: AuthTokens): void => {
    // Enforce that authentication tokens must NOT be written via JavaScript
    // They should be set from backend using HttpOnly+Secure flags
    if (tokens.access || tokens.refresh) {
        throw new Error(
            "Access and refresh tokens must not be stored via JavaScript cookies. They should be set server-side with HttpOnly and Secure flags for security best-practice."
        );
    }

    const existingTokens = getToken();

    // Only email is still settable via JS
    if (tokens.email) {
        Cookies.set(STORAGE_KEYS.EMAIL, tokens.email, getCookieOptions(14))
    } else if (existingTokens.email) {
        Cookies.set(STORAGE_KEYS.EMAIL, existingTokens.email, getCookieOptions(14))
    }
}

// Clear tokens from cookies
export const clearTokens = (): void => {
    // Since tokens are HttpOnly/server-set, can't remove them from JS
    // Only remove email key (safe for frontend)
    Cookies.remove(STORAGE_KEYS.EMAIL)
}