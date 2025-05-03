'use client'
import React, { lazy, useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { getAccessToken } from '@/store/auth'
import { initApiClient } from '@/lib/api'
import { getUsers } from '@/services/user'


const UserCard = lazy(() => import('./UserCard'))

interface User {
    name: string
    profilePicture: string
    reviewsCount: number
    bio: string
    first_name: string
    last_name: string
    reviews_count: number
}

export default function MostActiveSection({sortOption}: { sortOption: { [key: string]: string } }) {
    const { isAuthenticated } = useAuthStore()
    const [user, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)

    useEffect(() => {
        if (!isAuthenticated) {
            console.error(
                'User is not authenticated or access token is missing'
            )
            return
        }
        const accessToken = getAccessToken()

        initApiClient({
            baseURL:
                process.env.NEXT_PUBLIC_API_BASE_URL ||
                'http://localhost:8000/api/v1/',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken.token}`,
            },
        })
    }, [])


    useEffect(() => {
        const orderBy = sortOption['activeUsers'] === 'most' ? '-reviews_count' : 'reviews_count'
        const params = {
            reviews_count__gt: 0, // Filter users with reviews_count > 0
            // Pagination
            order_by: orderBy,    // Dynamic ordering
        };
        setIsLoading(true)
        getUsers(params)
            .then((result) => {
                console.log('Fetched users:', result.objects)
                setUsers(result.objects)
            })
            .catch((err) => {
                console.error('Failed to fetch books:', err)
                setError('Failed to load books. Please try again later.')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [sortOption])

    return (
        <div className="flex flex-col w-full px-3 text-black md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
            <p className="text-2xl md:text-4xl font-bold mb-4">
                Most Active Users
            </p>
            <p className="text-xs md:text-lg text-justify mb-4">
                These are the users who have been leading the conversation,
                sharing their reviews, and keeping the community buzzing. From
                insightful critiques to passionate recommendations, these users
                are the ones contributing the most to the discussions. Want to
                see what’s shaping the book world? Check out the most active
                voices here!
            </p>
            <div className="grid min-h-[20rem] grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full">
                {user.map((user, index) => (
                    <UserCard
                        key={index}
                        name={user.first_name + ' ' + user.last_name}
                        profilePicture={user.profilePicture || '/logo.png'}
                        reviewsCount={user.reviews_count}
                        bio={user.bio || 'No bio available'}
                    />
                ))}
            </div>
        </div>
    )
}
