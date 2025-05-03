'use client'
import React, { useState, useEffect, lazy } from 'react'
import { Input } from '../ui/input'
import { Button } from '@/components/ui/button'
import { FaBook, FaPlus } from 'react-icons/fa'
import { IoSearchSharp } from 'react-icons/io5'
import { useBookStore } from '@/store/book'
import { Book } from '@/interface'
import { useAuthStore } from '@/store/auth'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const BookCard = lazy(() => import('../common/BookCard'))

const authors = ['All Authors', 'Author 1', 'Author 2']
const genres = ['All Genres', 'Fiction', 'Non-fiction', 'Fantasy']

export default function SearchBooksSection({
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

    const [searchTerm, setSearchTerm] = useState<string>('')

    useEffect(() => {
        const orderBy =
            sortOption['searchBooks'] === 'ascending'
                ? 'total_reviews' // Replace
                : '-total_reviews' // Replace
        const params: Record<string, string> = {
            order_by: orderBy,
        }

        if (isAuthenticated && fetchAllBooks) {
            try {
                fetchAllBooks(params)
            } catch (err) {
                console.error('Error fetching books:', err)
            }
        }
    }, [fetchAllBooks, isAuthenticated, searchTerm, sortOption])

    useEffect(() => {
        console.log('BOOKS HERE', books)
    }, [books])

    return (
        <div className="flex flex-col w-full text-black px-3 md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <p className="text-2xl md:text-4xl font-bold">Search Books</p>
                <div className="flex flex-row flex-wrap gap-3">
                    <div className="flex w-40 md:w-auto gap-2 mb-4">
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title or keyword..."
                            className="bg-white text-black placeholder:text-gray-500 w-60"
                        />
                        <Button
                            variant="outline"
                            className="bg-slate-800 text-white hover:bg-slate-700"
                            onClick={() => {
                                // Trigger the same effect via setting state
                                setSearchTerm((prev) => prev.trim())
                            }}
                        >
                            <IoSearchSharp className="w-4 h-4" />
                        </Button>
                    </div>

                    <Select
                        onValueChange={(value) =>
                            console.log('Author selected:', value)
                        }
                    >
                        <SelectTrigger className="w-40 bg-white text-sm">
                            <SelectValue placeholder="Filter by Author" />
                        </SelectTrigger>
                        <SelectContent>
                            {authors.map((author, index) => (
                                <SelectItem
                                    key={index}
                                    value={author
                                        .toLowerCase()
                                        .replace(/\s+/g, '')}
                                >
                                    {author}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={(value) =>
                            console.log('Genre selected:', value)
                        }
                    >
                        <SelectTrigger className="w-40 bg-white text-sm">
                            <SelectValue placeholder="Filter by Genre" />
                        </SelectTrigger>
                        <SelectContent>
                            {genres.map((genre, index) => (
                                <SelectItem
                                    key={index}
                                    value={genre
                                        .toLowerCase()
                                        .replace(/\s+/g, '')}
                                >
                                    {genre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <p className="text-xs md:text-lg text-justify mb-4">
                Looking for something to read? Let us help you find the book for
                you so you can leave us afterwards (it&apos;s OK,{' '}
                <i>gwaenchana</i>!). Check out the books that have been added by
                our community. You can also add your own book to the list and
                share your thoughts with others.
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
                            }}
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
