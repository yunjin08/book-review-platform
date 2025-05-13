import { create } from 'zustand'
import { apiClient, axiosInstance } from '../lib/api'
import { User } from '@/interface'
import { saveTokens, clearTokens, getToken } from '@/utils/token'

// Auth state interface for the store
interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: Error | null
    isAPIInitialized: boolean

    // Auth actions
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (data: RegisterData) => Promise<void>
    logout: () => Promise<void>
    refreshToken: () => Promise<boolean>
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

// Auth store using Zustand
export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isAPIInitialized: false,

    login: async (username: string, password: string) => {
        try {
            const response = await apiClient.post<{
                token: string
                refresh: string
                user: User
            }>('/account/authenticate/', { username, password })

            saveTokens({
                access: response.token,
                refresh: response.refresh,
                email: response.user.email,
            })

            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
            })

            return { success: true };
        } catch (error) {
            set({
                error:
                    error instanceof Error ? error : new Error(String(error)),
                isLoading: false,
                isAuthenticated: false,
            })
            return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    },

    register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
            const response = await apiClient.post<{
                token: string
                refresh: string
                user: User
            }>('/account/registration/', data)

            saveTokens({
                access: response.token,
                refresh: response.refresh,
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
            // Must have axiosInstance to perform server logout
            if (!axiosInstance) {
                set({
                    isLoading: false,
                    error: new Error('Unable to contact server to log out. Please try again.'),
                })
                return;
            }
            await axiosInstance.post('/account/logout/')
        } catch (error) {
            console.error('Failed to logout on server', error)
            set({
                isLoading: false,
                error: error instanceof Error
                    ? error
                    : new Error(error ? String(error) : 'Failed to logout on server'),
            })
            return;
        }

        // Only clear local state and redirect when backend logout succeeds
        clearTokens()
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        })

        // Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = '/login'
        }
    },

    verifyToken: async (token?: string, email?: string) => {
        const { token: storedToken, email: storedEmail } = getToken()
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
        const { token: accessToken, email } = getToken()
        if (!accessToken || !email) return

        set({ isLoading: true })
        try {
            // Verify the token is valid
            const isValid = await get().verifyToken(accessToken, email)
            
            if (isValid) {
                set({ isAuthenticated: true })
            } else {
                // Try to refresh the token if validation fails
                const refreshed = await get().refreshToken()
                set({ isAuthenticated: refreshed })
            }
        } catch (error) {
            console.error('AuthStore: Failed to load user from cookies', error)
            
            // Try to refresh the token if there's an error
            try {
                const refreshed = await get().refreshToken()
                set({ isAuthenticated: refreshed })
            } catch (refreshError) {
                console.error('AuthStore: Failed to refresh token', refreshError)
                set({ isAuthenticated: false })
            }
        }

        set({ isLoading: false })
    },

    setAPIInitialized: () => {
        set({ isAPIInitialized: true })
    },

    refreshToken: async () => {
        const { refresh } = getToken()
        if (!refresh) return false

        try {
            const response = await apiClient.post<{
                token: string
            }>('/account/refresh-token/', { refresh })

            
            // Only update the access token
            saveTokens({
                access: response.token
            })

            set({ isAuthenticated: true })
            return true
        } catch (error) {
            console.error('Failed to refresh token', error)
            set({ isAuthenticated: false })
            return false
        }
    },
}))

// Don't auto-initialize - export an init function instead
export const initializeAuth = async (): Promise<void> => {
    // This should be called after API client is initialized
    if (typeof window !== 'undefined') {
        // Load user from cookies
        await useAuthStore.getState().loadUserFromCookies();
    }
}