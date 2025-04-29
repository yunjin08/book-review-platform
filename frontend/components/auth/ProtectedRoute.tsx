import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { useAuthStore } from '@/store/auth'
import Loader from '@/components/common/Loader'

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter()
    const { isAuthenticated, isLoading } = useAuthStore()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [router, isAuthenticated, isLoading])

    if (!isAuthenticated) {
        return null
    }

    return <Loader isLoading={isLoading}>{children}</Loader>
}
