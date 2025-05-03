'use client'
import React, { useEffect, lazy } from 'react'
import { Button } from '@/components/ui/button'
import { FaBook, FaPlus } from 'react-icons/fa'
import { useBookStore } from '@/store/book'
import { Book } from '@/interface'
import { useAuthStore } from '@/store/auth'

const BookCard = lazy(() => import('../common/BookCard'))

export default function MostReviewedSection({
    sortOption,
    onAddBookClick,
}: {
    sortOption: { [key: string]: string }
    onAddBookClick: () => void
}) {
    const { isAuthenticated } = useAuthStore()
    const {
        fetchAll: fetchAllBooks,
        isLoading,
        error,
        items: books,
    } = useBookStore()

    useEffect(() => {
        const orderBy =
            sortOption['mostReviewed'] === 'most'
                ? '-total_reviews'
                : 'total_reviews'
        const params = {
            order_by: orderBy, // Dynamic ordering
        }
        if (isAuthenticated && fetchAllBooks) {
            try {
                fetchAllBooks(params)
            } catch (err) {
                console.error('Error fetching books:', err)
            }
        }
    }, [fetchAllBooks, sortOption, isAuthenticated])

    useEffect(() => {
        console.log('BOOKS HERE', books)
    }, [books])

    return (
        <div className="flex flex-col w-full text-black px-3 md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
            <p className="text-2xl md:text-4xl font-bold mb-4">
                Reviewed Books
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
                    <p className="text-lg text-red-500">
                        {error.name}: {error.message}
                    </p>
                </div>
            ) : books.length === 0 ? (
                <div className="w-full text-center py-64 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-xl mb-4">No books found</p>
                    <p className="text-gray-500 mb-6">
                        Be the first to add a review!
                    </p>
                    {isAuthenticated && (
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
                    )}
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
                            rating={book.average_rating || 0}
                            rating_count={book.total_reviews || 0}
                            coverUrl={book.cover_image || '/logo.png'}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
