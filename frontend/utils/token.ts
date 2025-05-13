import Cookies from 'js-cookie'
import { AuthTokens } from '@/interface/auth'

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    EMAIL: 'user_email'
}

/**
 * IMPORTANT SECURITY NOTICE:
 * 
 * Access tokens and refresh tokens MUST NOT be stored in client-accessible JavaScript cookies, storage, or context.
 * Tokens should only ever be set, read, and cleared by the backend using HttpOnly and Secure flags on Set-Cookie.
 * 
 * This code removes all client-side storage for auth tokens to prevent session hijacking via XSS. See CWE-1004.
 */

// Get email (non-sensitive) from cookies if needed. Tokens cannot be read client-side if using HttpOnly cookies.
export const getEmail = (): string | null => {
    const email = Cookies.get(STORAGE_KEYS.EMAIL)
    return email || null
}

// Common cookie options for non-sensitive information (like email)
const getCookieOptions = (expiresInDays = 7) => ({
    expires: expiresInDays,
    path: '/',
    sameSite: 'Lax' as const,
    secure: process.env.NODE_ENV === 'production'
    // Do NOT include httpOnly: false -- only server can set HttpOnly cookies
})

// Save email (non-sensitive) to cookies; do not save tokens in JS-accessible cookies
export const saveEmail = (email: string): void => {
    if (email) {
        Cookies.set(STORAGE_KEYS.EMAIL, email, getCookieOptions(14))
    }
}

// Clear email from cookies; tokens are NOT handled in JS cookies anymore
export const clearEmail = (): void => {
    Cookies.remove(STORAGE_KEYS.EMAIL)
}

/**
 * Deprecated/Removed: Token management in frontend cookies has been eliminated for security.
 * All access/refresh token handling should rely on secure, HttpOnly cookies set via backend.
 * 
 * Attempting to set or get tokens from JS-accessible cookies is unsafe and no longer supported.
 */