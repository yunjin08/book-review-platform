import { apiClient, axiosInstance, initApiClient } from './api'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth'
import { clearTokens, getToken } from '@/utils/token'
// Check if the URL matches a public endpoint that doesn't need authentication
const isPublicEndpoint = (url?: string): boolean => {
    if (!url) return false
    const publicEndpoints = [
        '/account/registration/',
        '/account/authenticate/',
        '/account/verify-token/',
        '/account/logout/',
        '/account/refresh-token/',
    ]
    return publicEndpoints.some((endpoint) => url.endsWith(endpoint))
}

// Type for custom headers
interface CustomHeaders extends Record<string, unknown> {
    _retry?: boolean
    Authorization?: string
}

// Manually handle logout instead of using useAuthStore to avoid circular imports
const handleLogout = async (): Promise<void> => {
    try {
        // Try to call the backend logout endpoint if we have an axios instance
        if (axiosInstance) {
            await axiosInstance.post('/account/logout/')
        }
    } catch (error) {
        console.error('Failed to logout on server', error)
    }

    // Clear tokens
    clearTokens()

    // Redirect to login page
    if (typeof window !== 'undefined') {
        window.location.href = '/login'
    }
}

// Request interceptor
const requestInterceptor = async (
    reqConfig: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
    if (isPublicEndpoint(reqConfig.url)) {
        return reqConfig
    }

    const { token } = getToken()
    if (token && reqConfig.headers) {
        reqConfig.headers.Authorization = `Bearer ${token}`
    }
    return reqConfig
}

// Request error interceptor
const requestErrorInterceptor = (error: unknown) => {
    console.error('Request Interceptor Error:', error)
    return Promise.reject(error)
}

// Response interceptor
const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
    return response
}

// Response error interceptor
const responseErrorInterceptor = async (
    error: AxiosError
): Promise<AxiosResponse> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
        headers: CustomHeaders
    }

    if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest.headers?._retry ||
        isPublicEndpoint(originalRequest.url)
    ) {
        return Promise.reject(error)
    }

    // Mark as retry attempted
    if (originalRequest.headers) {
        originalRequest.headers._retry = true
    }

    try {
        // Try to refresh the token
        const refreshed = await useAuthStore.getState().refreshToken()
        
        console.log("REFRESHED", refreshed)

        if (refreshed) {
            // If token refresh was successful, update the authorization header
            const { token } = getToken()
            console.log("TOKEN", token)
            if (token && axiosInstance) {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return axiosInstance(originalRequest)
            }
        }
        
        // If refresh failed or we couldn't get the new token
        console.log("REFRESHED FAILED OR COULDN'T GET NEW TOKEN")
        await handleLogout()
        return Promise.reject(error)
    } catch (refreshError) {
        console.error('Error refreshing token:', refreshError)
        console.log("ERROR REFRESHING TOKEN")
        await handleLogout()
        return Promise.reject(error)
    }
}

// Initialize API with interceptors
export const initApiWithAuth = (baseURL: string): void => {
    initApiClient({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    console.log("INITIALIZED API WITH AUTH IN API CLIENT")

    // Add interceptors to the axios instance
    if (axiosInstance) {
        axiosInstance.interceptors.request.use(
            requestInterceptor,
            requestErrorInterceptor
        )
        axiosInstance.interceptors.response.use(
            responseInterceptor,
            responseErrorInterceptor
        )
    } else {
        console.error('Axios instance is not initialized')
    }
}

// Export auth-related utilities
export { isPublicEndpoint }

// Re-export api client for convenience
export { apiClient }
