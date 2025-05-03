import Cookies from 'js-cookie'
import { AuthTokens } from '@/interface/auth'

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    EMAIL: 'user_email'
}

// Get tokens from cookies
export const getToken = (): {
    token: string | null
    refresh: string | null
    email: string | null
} => {
    const accessToken = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN)
    const refreshToken = Cookies.get(STORAGE_KEYS.REFRESH_TOKEN)
    const email = Cookies.get(STORAGE_KEYS.EMAIL)

    
    return {
        token: accessToken || null,
        refresh: refreshToken || null,
        email: email || null,
    }
}

// Common cookie options to ensure consistent behavior across browsers
const getCookieOptions = (expiresInDays = 7) => ({
    expires: expiresInDays,
    path: '/',
    sameSite: 'Lax' as const,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false
});

// Save tokens to cookies
export const saveTokens = (tokens: AuthTokens): void => {
    // Get existing tokens first
    const existingTokens = getToken();
    
    // Access token handling
    if (tokens.access) {
        Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.access, getCookieOptions(7))
    } else if (existingTokens.token) {
        // Keep existing access token if not provided
        Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, existingTokens.token, getCookieOptions(7))
    }
    
    // Refresh token handling
    if (tokens.refresh) {
        Cookies.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh, getCookieOptions(14))
    } else if (existingTokens.refresh) {
        // Keep existing refresh token if not provided
        Cookies.set(STORAGE_KEYS.REFRESH_TOKEN, existingTokens.refresh, getCookieOptions(14))
    }
    
    // Email handling
    if (tokens.email) {
        Cookies.set(STORAGE_KEYS.EMAIL, tokens.email, getCookieOptions(14))
    } else if (existingTokens.email) {
        // Keep existing email if not provided
        Cookies.set(STORAGE_KEYS.EMAIL, existingTokens.email, getCookieOptions(14))
    }
}

// Clear tokens from cookies
export const clearTokens = (): void => {
    Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN)
    Cookies.remove(STORAGE_KEYS.REFRESH_TOKEN)
    Cookies.remove(STORAGE_KEYS.EMAIL)
}