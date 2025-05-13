import React from 'react'
import Image from 'next/image'

interface UserCardProps {
    name: string
    profilePicture: string
    reviewsCount: number
    bio: string
}

// Helper function to check for remote URLs (absolute URLs and protocol-relative)
function isSafeProfilePicture(src: string | undefined): boolean {
    if (!src) return false
    // Disallow http://, https://, // (protocol-relative) and data: uris
    const lowerSrc = src.trim().toLowerCase()
    return !(
        lowerSrc.startsWith('http://') ||
        lowerSrc.startsWith('https://') ||
        lowerSrc.startsWith('//') ||
        lowerSrc.startsWith('data:')
    )
}

export default function UserCard({
    name,
    profilePicture,
    reviewsCount,
    bio,
}: UserCardProps) {
    // Only allow relative URLs (not absolute URLs) for profilePicture
    const safeProfilePicture = isSafeProfilePicture(profilePicture)
        ? profilePicture
        : '/logo.png'

    return (
        <div className="flex flex-col items-center justify-center h-[20rem] bg-white rounded-lg shadow-md p-2 md:p-4 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center justify-center w-full overflow-hidden mb-4">
                <Image
                    src={safeProfilePicture}
                    alt={name}
                    width={100}
                    height={150}
                    className="w-24 h-24 rounded-full object-cover"
                />
            </div>
            <h3 className="text-xs md:text-xl font-bold text-gray-700">{name}</h3>
            <p className="text-xs md:text-[1rem] text-gray-700">{bio}</p>
            <p className="text-xs md:text-[1rem] text-gray-500">
                Reviews: {reviewsCount}
            </p>
        </div>
    )
}