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
            console.log("INITIALIZED AUTH IN AUTH PERSISTENCE PROVIDER")
        }
        init()
    }, [])

    useEffect(() => {
        if (isAPIInitialized && !isLoading && !isAuthenticated) {
            console.log("PUSHING TO LOGIN")
            router.push('/login')
        }
    }, [isAPIInitialized, isLoading, router])

    // Block rendering until auth state is resolved
    if (!isAPIInitialized || isLoading) {
        return <Loader isLoading={true} /> // Show loader while resolving auth
    }

    return <>{children}</>
}

export default AuthPersistenceProvider
