'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'
import { initApiWithAuth } from '@/lib/api-client'
import { initializeAuth, useAuthStore } from '@/store/auth'
import { config } from '@/config'
type ApiContextType = {
    isInitialized: boolean
    error: Error | null
}

const ApiContext = createContext<ApiContextType>({
    isInitialized: false,
    error: null,
})

export function ApiProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ApiContextType>({
        isInitialized: false,
        error: null,
    })

    const { setAPIInitialized } = useAuthStore()

    useEffect(() => {
        const init = async () => {
            try {
                // Get API URL from environment variable or use a default
                const apiBaseUrl = config.api.baseURL

                // Initialize the API client
                initApiWithAuth(apiBaseUrl)
                setState({ isInitialized: true, error: null })
                console.log('API client initialized with URL:', apiBaseUrl)
                await initializeAuth() // <-- Wait for auth to initialize
                setAPIInitialized() // <-- Only set after auth is ready
            } catch (error) {
                console.error('Failed to initialize API client:', error)
                setState({ isInitialized: false, error: error as Error })
            }
        }
        init()
    }, [])

    return <ApiContext.Provider value={state}>{children}</ApiContext.Provider>
}

// Hook to use the API context
export const useApi = () => useContext(ApiContext)
