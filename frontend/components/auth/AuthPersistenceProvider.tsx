'use client'

import { initializeAuth } from '@/store/auth'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'
import Loader from '@/components/common/Loader'

interface PropsInterface {
    children: ReactNode
}

const AuthPersistenceProvider = (props: PropsInterface) => {
    const { children } = props
    const { isAuthenticated, isLoading, isAPIInitialized, setAPIInitialized } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        // Initialize auth on component mount
        const init = async () => {
            setAPIInitialized()
            await initializeAuth()
        }
        init()
    }, [])

    useEffect(() => {
        if (isAPIInitialized && !isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAPIInitialized, isAuthenticated, isLoading, router])

    // Block rendering until auth state is resolved
    if (!isAPIInitialized || isLoading) {
        return <Loader isLoading={true} /> // Show loader while resolving auth
    }

    return <>{children}</>
}

export default AuthPersistenceProvider
