import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { apiClient } from '@/lib/api'
import { toast } from 'sonner'
import { useCreateBookReadingStore } from '@/store/book'
import { useBookReadingStore } from '@/store/book'
import UserStarRating from './UserStarRating'
import ReviewCard from './ReviewCard'

interface Review {
    id: number
    user: {
        id: number
        username: string
    }
    rating: number
    body: string
}

interface BookCardProps {
    bookId: number
    title: string
    author: string
    genres: { id: number; name: string }[]
    rating: number
    coverUrl: string
    rating_count?: number
}

export default function BookCard({
    bookId,
    title,
    author,
    genres,
    rating,
    coverUrl,
    rating_count,
}: BookCardProps) {
    const { create: createBookReading } = useCreateBookReadingStore()
    const { fetchAll: fetchAllBookReadingHistory, items: bookReadingHistory } =
        useBookReadingStore()

    // State for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false)
    // State for user's new rating
    const [newRating, setNewRating] = useState(0)
    // State for review text
    const [reviewText, setReviewText] = useState('')
    // State for the "Read" modal
    const [isReadModalOpen, setIsReadModalOpen] = useState(false)

    const handleSubmitReview = async () => {
        try {
            const response = await apiClient.post('/review/reviews/', {
                book: bookId,
                rating: newRating,
                body: reviewText,
            })

            console.log('Review submitted successfully:', response)

            // Reset the form and optionally close the modal
            setReviewText('')
            setNewRating(0)
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error submitting review:', error)
            toast(`Failed to submit review, ${(error?.detail).toLowerCase()}`, {
                style: { color: 'red' },
            })
        }
    }

    const handleAddReading = async () => {
        setIsReadModalOpen(true)
        const date_started = new Date().toISOString().split('T')[0] // Current date
        const date_finished = new Date(
            new Date().setDate(new Date().getDate() + 1)
        )
            .toISOString()
            .split('T')[0] // Add 1 day

        if (createBookReading) {
            createBookReading({ book: bookId, date_started, date_finished })
                .then((response) => {
                    console.log('Reading added successfully:', response)
                    if (fetchAllBookReadingHistory) {   
                        fetchAllBookReadingHistory()
                    }
                })
                .catch((error) => {
                    console.error('Error adding reading:', error)
                    toast(
                        `Failed to add reading, ${error?.detail?.toLowerCase()}`,
                        {
                            style: { color: 'red' },
                        }
                    )
                })
        }
    }

    return (
        <>
            <div
                className="flex flex-col bg-white rounded-lg shadow-md pb-2 md:p-4 hover:scale-105 transition-transform cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <div className="relative w-full">
                    <img
                        src={coverUrl}
                        alt={title}
                        className="rounded-md mb-4 w-full h-64  object-cover"
                    />
                </div>
                <h3 className="text-xs md:text-lg mx-2 text-black font-bold">
                    {title}
                </h3>
                <p className="text-[0.9rem] md:text-md mx-2 text-gray-700">
                    by {author}
                </p>
                <p className="text-xs md:text-[0.85rem] mx-2 text-gray-500 md:mb-2">
                    {genres.map((genre) => genre.name).join(', ')}
                </p>
                <div className="flex items-center mx-2 mt-auto">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={`h-3 w-3 md:h-5 md:w-5 ${
                                i < rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>
                <p className="text-xs md:text-[0.85rem] mx-2 text-gray-500 md:mb-2">
                    {rating_count} review
                    {rating_count && rating_count > 1 ? 's' : ''}
                </p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md md:max-w-2xl max-h-[85vh] text-black bg-white overflow-hidden flex flex-col">
                    <DialogHeader className="flex-shrink">
                        <DialogTitle className="text-xl md:text-2xl">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm md:text-base">
                            by {author} ·{' '}
                            {genres.map((genre) => genre.name).join(', ')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-grow pr-2">
                        <div className="grid grid-cols-3 border-t-2 border-slate-300 gap-4 my-4 p-2">
                            <div className="col-span-1">
                                <div className="relative w-full">
                                    <img
                                        src={coverUrl}
                                        alt={title}
                                        className="rounded-md mb-4 w-full h-64  object-cover"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <h3 className="text-lg font-bold mb-2">
                                    Book Summary
                                </h3>
                                <p className="text-sm text-gray-700 mb-2">
                                    Average Rating: {rating.toFixed(2)}/5
                                </p>
                                <p className="text-sm text-gray-700 mb-2">
                                    Rating Counts: {rating_count}
                                </p>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`h-5 w-5 ${
                                                i < rating
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <Button
                                    className="mt-4"
                                    onClick={() => handleAddReading()}
                                >
                                    Read
                                </Button>
                            </div>
                        </div>

                        <Separator className="my-4 bg-slate-400" />

                        <div>
                            <h3 className="text-lg font-bold mb-2">Reviews</h3>
                            <ReviewCard
                                isModalOpen={isModalOpen}
                                bookId={bookId}
                            />
                        </div>

                        <Separator className="my-4 bg-slate-400" />

                        <div>
                            <h3 className="text-lg font-bold mb-2">
                                Submit Your Review
                            </h3>
                            <UserStarRating
                                rating={newRating}
                                onChange={setNewRating}
                            />
                            <Textarea
                                placeholder="Write your review here..."
                                className="w-full h-24 mb-2 border-slate-500 ring-0 focus:ring-0"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-shrink-0 mt-4">
                        <Button
                            onClick={handleSubmitReview}
                            disabled={newRating === 0 || !reviewText.trim()}
                        >
                            Submit Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Read Modal */}
            <Dialog open={isReadModalOpen} onOpenChange={setIsReadModalOpen}>
                <DialogContent className="max-w-md text-black bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            Reading Confirmation
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <p className="text-sm text-gray-700">
                            You are reading this Book. This will be added to
                            your read history.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsReadModalOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
