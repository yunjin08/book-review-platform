'use client'
import React, { useEffect, lazy, useState } from 'react'
import { getBooks } from '@/services/book'
import { initApiClient } from '@/lib/api'
import { getAccessToken } from '@/store/auth'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { FaBook, FaPlus } from 'react-icons/fa'

const BookCard = lazy(() => import('../common/BookCard'))

interface Book {
    id: number
    title: string
    author: string
    genres_detail: { id: number; name: string }[]
    rating: number
    coverUrl: string
}

export default function MostReviewedSection({
    onAddBookClick,
}: {
    onAddBookClick: () => void
}) {
    const { isAuthenticated } = useAuthStore()
    const [books, setBooks] = useState<Book[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

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
        setIsLoading(true)
        getBooks({})
            .then((result) => {
                console.log('Fetched books:', result.objects)
                setBooks(result.objects)
            })
            .catch((err) => {
                console.error('Failed to fetch books:', err)
                setError('Failed to load books. Please try again later.')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    return (
        <div className="flex flex-col w-full text-black px-3 md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
            <p className="text-2xl md:text-4xl font-bold mb-4">
                Most Reviewed Books
            </p>
            <p className="text-xs md:text-lg text-justify mb-4">
                These are the books that everyone&apos;s had something to say
                about: the ones sparking conversations, inspiring debates, or...
                getting people to ranting about why it&apos;s one of the books
                of all-time (like any other is, <i>lol</i>). Want to be in on
                the talk? Check out what&apos;s got everyone buzzing!
            </p>

            {isLoading ? (
                <div className="w-full text-center py-64">
                    <p className="text-lg">Loading books...</p>
                </div>
            ) : error ? (
                <div className="w-full text-center py-64">
                    <p className="text-lg text-red-500">{error}</p>
                </div>
            ) : books.length === 0 ? (
                <div className="w-full text-center py-64 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-xl mb-4">No books found</p>
                    <p className="text-gray-500 mb-6">
                        Be the first to add a review!
                    </p>
                    <Button
                        className="bg-slate-800 text-white hover:bg-slate-700 text-xs md:text-sm cursor-pointer"
                        onClick={() => {
                            onAddBookClick()
                        }} // Trigger modal
                    >
                        <FaBook className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Add Book</span>
                        <FaPlus className="ml-3 w-2 h-2 md:w-3 md:h-3" />
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full">
                    {books.map((book: Book, index: number) => (
                        <BookCard
                            key={index}
                            bookId={book.id}
                            title={book.title}
                            author={book.author}
                            genres={book.genres_detail || []}
                            rating={book.rating || 0}
                            coverUrl={book.coverUrl || '/logo.png'}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
