import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaStar } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { apiClient } from '@/lib/api'
import { FaEdit } from 'react-icons/fa' // Edit icon
import { MdDelete } from 'react-icons/md' // Delete icon

interface Review {
    id: number
    user: {
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
}

export default function BookCard({
    bookId,
    title,
    author,
    genres,
    rating,
    coverUrl,
}: BookCardProps) {
    // State for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false)
    // State for user's new rating
    const [newRating, setNewRating] = useState(0)
    // State for hovering over stars
    const [hoverRating, setHoverRating] = useState(0)
    // State for review text
    const [reviewText, setReviewText] = useState('')

    const [reviews, setReviews] = useState<
        { id: number; user: string; rating: number; body: string }[]
    >([])

    useEffect(() => {
        if (isModalOpen) {
            console.log('BookID:', bookId)
            const fetchReviews = async () => {
                try {
                    const response = await apiClient.get(
                        `/review/reviews/?book_id=${bookId}`
                    )

                    const mappedReviews = response.objects.map(
                        (review: Review) => ({
                            id: review.id,
                            user: review.user.username,
                            rating: review.rating,
                            body: review.body,
                        })
                    )

                    console.log('Fetched reviews:', mappedReviews)
                    setReviews(mappedReviews)
                } catch (error) {
                    console.error('Error fetching reviews:', error)
                }
            }

            fetchReviews()
        }
    }, [isModalOpen, bookId])

    const handleStarClick = (rating: number) => {
        setNewRating(rating)
    }

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
            alert('Failed to submit review. Please try again.')
        }
    }

    const handleDeleteReview = async (reviewId: number) => {
        try {
            await apiClient.delete(`/review/reviews/${reviewId}/`)
            setReviews((prevReviews) =>
                prevReviews.filter((review) => review.id !== reviewId)
            )
            console.log('Review deleted successfully')
        } catch (error) {
            console.error('Error deleting review:', error)
            alert('Failed to delete review. Please try again.')
        }
    }

    return (
        <>
            <div
                className="flex flex-col bg-white rounded-lg shadow-md pb-2 md:p-4 hover:scale-105 transition-transform cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <div
                    className="relative w-full"
                    style={{ paddingBottom: '150%' }}
                >
                    <Image
                        src={coverUrl}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md mb-4"
                    />
                </div>
                <h3 className="text-xs md:text-lg mx-2 text-black font-bold md:mb-1">
                    {title}
                </h3>
                <p className="text-xs md:text-lg mx-2 text-gray-700 md:mb-1">
                    by {author}
                </p>
                <p className="text-xs md:text-lg mx-2 text-gray-500 md:mb-2">
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
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md md:max-w-2xl max-h-[85vh] text-black bg-white overflow-hidden flex flex-col">
                    <DialogHeader className="flex-shrink- border-b-2 border-slate-500">
                        <DialogTitle className="text-xl md:text-2xl">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm md:text-base">
                            by {author} ·{' '}
                            {genres.map((genre) => genre.name).join(', ')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-grow pr-2">
                        <div className="grid grid-cols-3 gap-4 my-4 border-2 border-slate-500 p-2 rounded-sm">
                            <div className="col-span-1">
                                <div
                                    className="relative w-full"
                                    style={{ paddingBottom: '150%' }}
                                >
                                    <img
                                        src={coverUrl}
                                        alt={title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <h3 className="text-lg font-bold mb-2">
                                    Book Summary
                                </h3>
                                <p className="text-sm text-gray-700 mb-4">
                                    Average Rating: {rating}/5
                                </p>
                                <div className="flex mb-4">
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
                            </div>
                        </div>

                        <Separator className="my-4 bg-slate-400" />

                        <div>
                            <h3 className="text-lg font-bold mb-2">Reviews</h3>
                            <div className="space-y-4">
                                {reviews.map((review, index) => (
                                    <Card
                                        key={index}
                                        className="p-3 border-slate-500 hover:bg-slate-100"
                                    >
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row justify-between items-center mb-1">
                                                <span className="font-medium">
                                                    <b>{review.user}</b>
                                                </span>
                                                <div className="flex items-end">
                                                    <div className="flex px-3 mr-3 border-r-2 border-slate-400">
                                                        {[...Array(5)].map(
                                                            (_, i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    className={`h-4 w-4 ${
                                                                        i <
                                                                        review.rating
                                                                            ? 'text-yellow-400'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                    <button
                                                        className="mr-2"
                                                        onClick={() =>
                                                            console.log(
                                                                'Edit button'
                                                            )
                                                        }
                                                    >
                                                        <FaEdit className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDeleteReview(
                                                                review.id
                                                            )
                                                        }
                                                    >
                                                        <MdDelete className="text-red-500 hover:text-red-700 cursor-pointer" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-2">
                                                {review.body}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-4 bg-slate-400" />

                        <div>
                            <h3 className="text-lg font-bold mb-2">
                                Submit Your Review
                            </h3>
                            <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`h-6 w-6 cursor-pointer ${
                                            i < (hoverRating || newRating)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                        onClick={() => handleStarClick(i + 1)}
                                        onMouseEnter={() =>
                                            setHoverRating(i + 1)
                                        }
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                ))}
                            </div>
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
        </>
    )
}
