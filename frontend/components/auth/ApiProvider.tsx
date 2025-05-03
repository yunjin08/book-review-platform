'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'
import { initApiWithAuth } from '@/lib/api-client'
import { initializeAuth } from '@/store/auth'
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

    useEffect(() => {
        try {
            const apiBaseUrl = config.api.baseURL
            initApiWithAuth(apiBaseUrl)
            setState({ isInitialized: true, error: null })
        } catch (error) {
            console.error('Failed to initialize API client:', error)
            setState({ isInitialized: false, error: error as Error })
        } finally {
            initializeAuth()
        }
    }, [])

    return <ApiContext.Provider value={state}>{children}</ApiContext.Provider>
}

// Hook to use the API context
export const useApi = () => useContext(ApiContext)
