import { useState } from 'react'
import { CardContent } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api'

import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

interface CommentProps {
    commentId: number
    reviewId: number
    userID: number
    username: string
    body: string
}

const CommentCard: React.FC<CommentProps> = ({
    commentId,
    reviewId,
    userID,
    username,
    body,
}) => {
    const { user } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false)
    const [editedBody, setEditedBody] = useState(body)
    const [isDeleted, setIsDeleted] = useState(false)

    const handleDelete = async () => {
        // Defense-in-depth: Ensure only the comment owner can delete
        if (!user || user.id !== userID) {
            alert('You are not authorized to delete this comment.')
            return
        }
        try {
            await apiClient.delete(`/review/comments/${commentId}/`)
            setIsDeleted(true)
        } catch (error) {
            console.error('Error deleting comment:', error)
            alert('Failed to delete comment. Please try again.')
        }
    }

    const handleSaveEdit = async () => {
        // Defense-in-depth: Ensure only the comment owner can edit
        if (!user || user.id !== userID) {
            alert('You are not authorized to edit this comment.')
            return
        }
        try {
            await apiClient.put(`/review/comments/${commentId}/`, {
                body: editedBody,
                review: reviewId,
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating comment:', error)
            alert('Failed to update comment. Please try again.')
        }
    }

    if (isDeleted) return null

    return (
        <CardContent className="p-3 rounded-lg bg-slate-200">
            <div className="flex flex-col">
                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-medium">
                        <b>{username}</b>
                    </span>
                    {user && user.id === userID && !isEditing && (
                        <div className="flex">
                            <button
                                className="mr-2"
                                onClick={() => setIsEditing(true)}
                            >
                                <FaEdit className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                            </button>
                            <button onClick={handleDelete}>
                                <MdDelete className="text-red-500 hover:text-red-700 cursor-pointer" />
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="flex flex-col gap-2 mt-2">
                        <Textarea
                            value={editedBody}
                            onChange={(e) => setEditedBody(e.target.value)}
                            rows={3}
                            className="bg-white"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={handleSaveEdit}>
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditedBody(body) // Reset
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700 mt-2">{editedBody}</p>
                )}
            </div>
        </CardContent>
    )
}

export default CommentCard