import { useState, useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import UserStarRating from './UserStarRating'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

import { FaStar } from 'react-icons/fa'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { FaComment } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'
import CommentCard from './CommentCard'

interface Comment {
    id: number
    user: number
    username: string
    body: string
}

interface Review {
    id: number
    user: {
        id: number
        username: string
    }
    rating: number
    body: string
    comments?: Comment[]
}

interface ReviewCardProps {
    isModalOpen: boolean
    bookId: number
}

const ReviewCard: React.FC<ReviewCardProps> = ({ isModalOpen, bookId }) => {
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null)
    const [editedReviewText, setEditedReviewText] = useState('')
    const [editRating, setEditRating] = useState(0)
    const [CommentingToReviewId, setCommentingToReviewId] = useState(0)
    const [CommentText, setCommentText] = useState('')

    const { user } = useAuthStore()

    const [reviews, setReviews] = useState<
        {
            id: number
            user: {
                userID: number
                username: string
            }
            rating: number
            body: string
            comments: Comment[]
        }[]
    >([])

    useEffect(() => {
        if (isModalOpen) {
            const fetchReviews = async () => {
                try {
                    const response = await apiClient.get(
                        `/review/reviews/?book_id=${bookId}`
                    )


                    const mappedReviews = response.objects.map(
                        (review: Review) => ({
                            id: review.id,
                            user: {
                                userID: review.user.id,
                                username: review.user.username,
                            },
                            rating: review.rating,
                            body: review.body,
                            comments: review.comments || [],
                        })
                    )

                    setReviews(mappedReviews)
                } catch (error) {
                    console.error('Error fetching reviews:', error)
                }
            }

            fetchReviews()
        }
    }, [isModalOpen, bookId])

    const handleDeleteReview = async (reviewId: number) => {
        try {
            await apiClient.delete(`/review/reviews/${reviewId}/`)
            setReviews((prevReviews) =>
                prevReviews.filter((review) => review.id !== reviewId)
            )
        } catch (error) {
            console.error('Error deleting review:', error)
            alert('Failed to delete review. Please try again.')
        }
    }

    const handleEditReview = (
        reviewId: number,
        currentBody: string,
        currentRating: number
    ) => {
        setEditingReviewId(reviewId)
        setEditedReviewText(currentBody)
        setEditRating(currentRating)
    }

    const handleSaveEditedReview = async (reviewId: number) => {
        try {
            const originalReview = reviews.find((r) => r.id === reviewId)
            if (!originalReview) return

            await apiClient.put(`/review/reviews/${reviewId}/`, {
                book: bookId,
                rating: editRating,
                body: editedReviewText,
            })

            setReviews((prev) =>
                prev.map((r) =>
                    r.id === reviewId
                        ? { ...r, body: editedReviewText, rating: editRating }
                        : r
                )
            )

            setEditingReviewId(null)
            setEditedReviewText('')
        } catch (error) {
            console.error('Error updating review:', error)
            alert('Failed to update review. Please try again.')
        }
    }

    const handleCommentClick = (reviewId: number) => {
        setCommentingToReviewId(reviewId)
        setCommentText('')
    }

    const handleCommentCancel = () => {
        setCommentingToReviewId(0)
        setCommentText('')
    }

    const handleCommentSubmit = async (reviewId: number) => {
        try {
            await apiClient.post(`/review/reviews/${reviewId}/comments/`, {
                body: CommentText,
                review: reviewId,
            })


            setCommentingToReviewId(0)
            setCommentText('')
        } catch (error) {
            console.error('Error posting comment:', error)
            alert('Failed to post comment. Please try again.')
        }
    }

    return (
        <div className="space-y-4">
            {reviews.map((review, index) => (
                <Card key={index} className="p-3 border-slate-500">
                    <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-1">
                            <span className="font-medium">
                                <b>{review.user.username}</b>
                            </span>
                            {editingReviewId !== review.id && (
                                <div className="flex items-end">
                                    <div
                                        className={
                                            user &&
                                            user.id === review.user.userID
                                                ? 'flex px-3 mr-3 border-r-2 border-slate-400'
                                                : 'flex px-3'
                                        }
                                    >
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < review.rating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    {user && user.id === review.user.userID && (
                                        <>
                                            <button
                                                className="mr-2"
                                                onClick={() =>
                                                    handleEditReview(
                                                        review.id,
                                                        review.body,
                                                        review.rating
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
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {editingReviewId === review.id ? (
                            <>
                                <UserStarRating
                                    rating={editRating}
                                    onChange={setEditRating}
                                />

                                <div className="flex flex-col space-y-2 mt-2">
                                    <Textarea
                                        value={editedReviewText}
                                        onChange={(e) =>
                                            setEditedReviewText(e.target.value)
                                        }
                                    />
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleSaveEditedReview(
                                                    review.id
                                                )
                                            }
                                            className="cursor-pointer hover:opacity-90"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                                setEditingReviewId(null)
                                            }
                                            className="cursor-pointer hover:bg-slate-200"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-700 mt-2">
                                {review.body}
                            </p>
                        )}
                    </CardContent>

                    <div className="mt-2 space-y-3">
                        {review.comments.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                commentId={comment.id}
                                reviewId={review.id}
                                userID={comment.user}
                                username={comment.username}
                                body={comment.body}
                            />
                        ))}
                    </div>

                    {CommentingToReviewId === review.id ? (
                        <CardContent className="p-3 border rounded-lg border-slate-500">
                            <div className="flex flex-col space-y-3">
                                <span className="font-medium">
                                    <b>{user.username}</b>
                                </span>
                                <Textarea
                                    value={CommentText}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                    placeholder="Write your comment..."
                                    rows={3}
                                    className="bg-slate-200 border-0 focus:outline-none focus:ring-0"
                                />
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            handleCommentSubmit(review.id)
                                        }
                                        className="text-white hover:opacity-90 cursor-pointer"
                                    >
                                        <MdSend className="mr-1" />
                                        Submit
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleCommentCancel}
                                        className="text-white hover:opacity-90 cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => handleCommentClick(review.id)}
                            className="cursor-pointer py-2 hover:opacity-90"
                        >
                            <FaComment className="mr-1" />
                            Comment
                        </Button>
                    )}
                </Card>
            ))}
        </div>
    )
}

export default ReviewCard
