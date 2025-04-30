'use client'

import Image from 'next/image'

interface UserProfileProps {
    userId: string
    bio?: string
    name?: string
    profileImage?: string
}

export default function UserProfileCard({
    userId,
    bio = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name = 'Helena Meadow',
    profileImage = '/logo.png',
}: UserProfileProps) {
    return (
        <div className="w-full bg-white shadow-sm border-b px-3 md:px-24 xl:px-72 ">
            <div className="py-6 flex flex-col md:flex-row items-start">
                <div className="flex-shrink-0 mr-6">
                    <div className="relative w-24 h-24 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                        <Image
                            src={profileImage || '/placeholder.svg'}
                            alt={`${name}'s profile`}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="h-full items-end">
                    <div className="flex justify-between items-start md:items-center">
                        <div className="text-xs text-gray-500 mt-1">
                            User ID: {userId}
                        </div>
                        <button className="bg-red-600 py-2 px-4 rounded-lg text-sm text-white cursor-pointer hover:bg-red-700 transition duration-200">
                            Log out
                        </button>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-xs text-gray-500 uppercase">BIO</p>
                        <p className="text-sm text-gray-800 text-justify">
                            {bio}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
