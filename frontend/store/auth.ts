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
}

// Auth state interface for the store
interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: Error | null

    // Auth actions
    login: (username: string, password: string) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => Promise<void>
    verifyToken: (token?: string) => Promise<boolean>
    loadUserFromCookies: () => Promise<void>
    getProfile: (id: string) => Promise<void>
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
export const getAccessToken = (): string | null => {
    const tokens = Cookies.get(STORAGE_KEYS.TOKENS)
    if (tokens) {
        try {
            return JSON.parse(tokens).access || null
        } catch (e) {
            console.error('Failed to parse tokens cookie', e)
            return null
        }
    }
    return null
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

    login: async (username: string, password: string) => {
        console.log(
            'Login attempt with username:',
            username,
            'and password:',
            password
        )
        set({ isLoading: true, error: null })
        try {
            const response = await apiClient.post<{
                access: string
                user: User
            }>('/account/authenticate/', { username, password })

            saveTokens({
                access: response.access,
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
                access: string
                user: User
            }>('/account/registration/', data)

            saveTokens({
                access: response.access,
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

    verifyToken: async (token?: string) => {
        const tokenToVerify = token || getAccessToken()
        if (!tokenToVerify) return false

        try {
            await apiClient.post('/account/verify-token/', {
                token: tokenToVerify,
            })
            return true
        } catch {
            return false
        }
    },

    getProfile: async (id: string) => {
        try {
            const response = await apiClient.get<User>(`/account/users/${id}/`)
            set({ user: response })
        } catch (error) {
            console.error('AuthStore: Failed to get profile', error)
        }
    },

    loadUserFromCookies: async () => {
        const accessToken = getAccessToken()
        if (!accessToken) return

        set({ isLoading: true })
        try {
            // Verify the token is valid
            const isValid = await get().verifyToken(accessToken)
            set({ isAuthenticated: isValid, isLoading: false })
        } catch (error) {
            console.error('AuthStore: Failed to load user from cookies', error)
            set({
                isAuthenticated: false,
                isLoading: false,
            })
        }
    },
}))

// Don't auto-initialize - export an init function instead
export const initializeAuth = async (): Promise<void> => {
    // This should be called after API client is initialized
    if (typeof window !== 'undefined') {
        await useAuthStore.getState().loadUserFromCookies()
    }
}
