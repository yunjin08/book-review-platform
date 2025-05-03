'use client'
import React, { useEffect, lazy, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { FaBook, FaPlus } from 'react-icons/fa'
import { useBookStore } from '@/store/book'
import { Book } from '@/interface'

const BookCard = lazy(() => import('../common/BookCard'))

export default function MostReviewedSection({
    sortOption,
    onAddBookClick,
}: {
    sortOption: { [key: string]: string }
    onAddBookClick: () => void
}) {
    const { fetchAll: fetchAllBooks, items: books } = useBookStore()
    const { isAuthenticated } = useAuthStore()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch books after API is initialized
    useEffect(() => {
        const orderBy =
            sortOption['bookRate'] === 'highest'
                ? '-average_rating'
                : 'average_rating'
        const params = {
            order_by: orderBy,
        }
        setIsLoading(true)
        if (fetchAllBooks) {
            fetchAllBooks(params)
                .catch((err) => {
                    console.error('Failed to fetch books:', err)
                    setError('Failed to load books. Please try again later.')
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [isAuthenticated])

    return (
        <div className="flex flex-col w-full text-black px-3 md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
            <p className="text-2xl md:text-4xl font-bold mb-4">Rated Books</p>
            <p className="text-xs md:text-lg text-justify mb-4">
                These are the absolute <i>bangers</i>: the books so good they
                had readers screaming, crying, throwing up (like in a good way).
                From timeless classics to hidden gems, dive in and see what all
                the hype is about, because your next favorite read might just be
                waiting here, matey!
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
                            rating={book.total_reviews || 0}
                            coverUrl={book.cover_image || '/logo.png'}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
