'use client'
import React, { lazy, useEffect, useState } from 'react'
import { useUserStore } from '@/store/user'

const UserCard = lazy(() => import('./UserCard'))

export default function MostActiveSection({
    sortOption,
}: {
    sortOption: { [key: string]: string }
}) {
    const { fetchAll: fetchAllUsers, items: users, meta } = useUserStore()
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const orderBy =
        sortOption['activeUsers'] === 'most'
            ? '-reviews_count'
            : 'reviews_count'
    const params = {
        order_by: orderBy,
    }
    if (fetchAllUsers) {
        fetchAllUsers(params).catch((err: unknown) => {
            console.error('Failed to fetch users:', err)
        })
    }
    }, [currentPage, sortOption, fetchAllUsers])



    const handleNextPage = () => {
        if (meta && currentPage < meta.totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    return (
        <div className="flex flex-col w-full px-3 text-black md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
            <p className="text-2xl md:text-4xl font-bold mb-4">Active Users</p>
            <p className="text-xs md:text-lg text-justify mb-4">
                These are the users who have been leading the conversation,
                sharing their reviews, and keeping the community buzzing. From
                insightful critiques to passionate recommendations, these users
                are the ones contributing the most to the discussions. Want to
                see what&apos;s shaping the book world? Check out the most
                active voices here!
            </p>
            <div className="grid min-h-[25rem] grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full">
                {users.map((user, index) => (
                    <UserCard
                        key={user.id || index}
                        name={user.first_name + ' ' + user.last_name}
                        profilePicture={user.profile_picture || '/logo.png'}
                        reviewsCount={user.reviews_count}
                        bio={user.bio || 'No bio available'}
                    />
                ))}
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {meta.currentPage} of {meta.totalPages}
                    </span>
                    <button
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        onClick={handleNextPage}
                        disabled={currentPage >= meta.totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
