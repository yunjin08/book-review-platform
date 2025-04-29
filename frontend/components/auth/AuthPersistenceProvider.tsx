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
    const { isAuthenticated, isLoading, isAPIInitialized } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        // Initialize auth on component mount
        const init = async () => {
            await initializeAuth()
        }

        init()
    }, [])

    // Only redirect if we've checked auth and user is not authenticated
    useEffect(() => {
        if (isAPIInitialized && !isLoading && !isAuthenticated) {
            // TODO: Comment this out when testing UI without auth
            router.push('/login')
        }
    }, [isAPIInitialized, isAuthenticated, isLoading, router])

    return <Loader isLoading={isLoading}>{children}</Loader>
}

export default AuthPersistenceProvider
