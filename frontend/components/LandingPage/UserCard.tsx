import React from 'react'
import Image from 'next/image'

interface UserCardProps {
    name: string
    profilePicture: string
    reviewsCount: number
    bio: string
}

// Define allowed remote image domains
const ALLOWED_IMAGE_DOMAINS = [
    'images.example.com',
    // Add other trusted domains here
]

// Utility function to validate profile picture URLs
function isAllowedProfilePicture(src: string): boolean {
    try {
        // If relative path (starts with slash, not interpreted as URL), allow
        if (src.startsWith('/')) {
            return true
        }
        const url = new URL(src)
        if (url.protocol !== 'https:') {
            return false
        }
        // Remove port for comparison
        const hostname = url.hostname
        // Only allow if hostname matches one of the allowed domains
        return ALLOWED_IMAGE_DOMAINS.some((domain) => hostname === domain)
    } catch {
        // If not a valid URL, reject
        return false
    }
}

export default function UserCard({
    name,
    profilePicture,
    reviewsCount,
    bio,
}: UserCardProps) {
    // Safe image selection
    let safeProfilePicture = '/logo.png'
    if (
        typeof profilePicture === 'string' &&
        profilePicture.trim() !== '' &&
        isAllowedProfilePicture(profilePicture.trim())
    ) {
        safeProfilePicture = profilePicture.trim()
    }

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