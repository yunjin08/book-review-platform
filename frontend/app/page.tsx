'use client'

import LandingPage from '@/components/LandingPage/LandingPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function Home() {
    return (
        <ProtectedRoute>
            <LandingPage />
        </ProtectedRoute>
    )
}
