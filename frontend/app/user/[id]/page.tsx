'use client'

import { useParams } from 'next/navigation'
import UserPage from '@/components/user/userPage'
import NavBar from '@/components/common/NavBar'
import Footer from '@/components/common/Footer'

export default function UserPageWrapper() {
    const { id } = useParams()

    return (
        <div className="flex flex-col w-screen h-auto text-black">
            <NavBar />
            <UserPage userId={id as string} />
            <Footer />
        </div>
    )
}
