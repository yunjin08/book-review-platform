import { ReactNode, useEffect, useState } from 'react'

interface LoaderProps {
    children?: ReactNode
    isLoading: boolean
}

export default function Loader({ children, isLoading }: LoaderProps) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true) // Ensure this runs only on the client
    }, [])

    if (!isClient) {
        // During SSR, render only the children to avoid mismatches
        return <>{children}</>
    }

    if (!isLoading) {
        return <>{children}</>
    }

    return (
        <div className="relative">
            {children}
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        </div>
    )
}