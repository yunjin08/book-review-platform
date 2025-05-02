import { create } from 'zustand'
import { apiClient, axiosInstance } from '../lib/api'
import Cookies from 'js-cookie'
import { User } from '@/interface'

// STORAGE_KEYS for token management
const STORAGE_KEYS = {
    TOKENS: 'auth_tokens',
}

// Authentication tokens interface
export interface AuthTokens {
    access: string
    access_expiration?: string
    email?: string
}

// Auth state interface for the store
interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: Error | null
    isAPIInitialized: boolean

    // Auth actions
    login: (username: string, password: string) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => Promise<void>
    verifyToken: (token?: string, email?: string) => Promise<boolean>
    loadUserFromCookies: () => Promise<void>
    getProfile: (id: string) => Promise<void>
    setAPIInitialized: () => void
}

// Registration data interface
export interface RegisterData {
    username: string
    first_name: string
    last_name: string
    email: string
    password: string
}

// Get access token from cookies
export const getAccessToken = (): {
    token: string | null
    email: string | null
} => {
    const tokens = Cookies.get(STORAGE_KEYS.TOKENS)
    if (tokens) {
        try {
            const parsed = JSON.parse(tokens)
            return {
                token: parsed.access || null,
                email: parsed.email || null,
            }
        } catch (e) {
            console.error('Failed to parse tokens cookie', e)
            return { token: null, email: null }
        }
    }
    return { token: null, email: null }
}

// Save tokens to cookies
export const saveTokens = (tokens: AuthTokens): void => {
    Cookies.set(STORAGE_KEYS.TOKENS, JSON.stringify(tokens), {
        expires: 7,
        path: '/',
        sameSite: 'Lax',
    })
}

// Clear tokens from cookies
export const clearTokens = (): void => {
    Cookies.remove(STORAGE_KEYS.TOKENS)
}

// Auth store using Zustand
export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isAPIInitialized: false,

    login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
            const response = await apiClient.post<{
                token: string
                user: User
            }>('/account/authenticate/', { username, password })

            saveTokens({
                access: response.token,
                email: response.user.email,
            })

            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error ? error : new Error(String(error)),
                isLoading: false,
                isAuthenticated: false,
            })
        }
    },

    register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
            const response = await apiClient.post<{
                token: string
                user: User
            }>('/account/registration/', data)

            saveTokens({
                access: response.token,
                email: response.user.email,
            })

            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error ? error : new Error(String(error)),
                isLoading: false,
            })
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null })
        try {
            // Try to call the backend logout endpoint if we have an axios instance
            if (axiosInstance) {
                await axiosInstance.post('/account/logout/')
            }
        } catch (error) {
            console.error('Failed to logout on server', error)
            // Continue with logout process regardless of server response
        }

        // Always clear local state
        clearTokens()
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        })

        // Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = '/login'
        }
    },

    verifyToken: async (token?: string, email?: string) => {
        const { token: storedToken, email: storedEmail } = getAccessToken()
        const tokenToVerify = token || storedToken
        const emailToUse = email || storedEmail

        if (!tokenToVerify || !emailToUse) return false

        try {
            await apiClient.post('/account/verify-token/', {
                token: tokenToVerify,
                email: emailToUse,
            })
            return true
        } catch {
            return false
        }
    },

    getProfile: async () => {
        try {
            const response = await apiClient.get<User>(
                `/account/users/profile/`
            )
            set({ user: response })
        } catch (error) {
            console.error('AuthStore: Failed to get profile', error)
        }
    },

    loadUserFromCookies: async () => {
        const { token: accessToken, email } = getAccessToken()
        if (!accessToken || !email) return

        set({ isLoading: true })
        try {
            // Verify the token is valid
            const isValid = await get().verifyToken(accessToken, email)
            set({ isAuthenticated: isValid })
        } catch (error) {
            console.error('AuthStore: Failed to load user from cookies', error)
            set({
                isAuthenticated: false,
            })
        }

        set({ isLoading: false })
    },

    setAPIInitialized: () => {
        set({ isAPIInitialized: true })
    },
}))

// Don't auto-initialize - export an init function instead
export const initializeAuth = async (): Promise<void> => {
    // This should be called after API client is initialized
    if (typeof window !== 'undefined') {
        await useAuthStore.getState().loadUserFromCookies()
    }
}
