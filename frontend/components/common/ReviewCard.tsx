import React from 'react'
import Image from 'next/image'
import { FaStar, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

interface ReviewCardProps {
    reviewTitle: string
    bookTitle: string
    rating: number
    review: string
    coverUrl: string
    onEdit?: () => void
    onDelete?: () => void
}

export default function ReviewCard({
    reviewTitle,
    bookTitle,
    rating,
    review,
    coverUrl,
    onEdit,
    onDelete,
}: ReviewCardProps) {
    return (
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:scale-[1.02] transition-transform items-center p-2">
            <div className="relative w-20 md:w-32 h-35 md:h-60 flex-shrink-0">
                <Image
                    src={coverUrl}
                    alt={bookTitle}
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            <div className="flex flex-col p-2 md:p-4 gap-1 md:gap-2 flex-grow">
                <div className="flex justify-between items-start gap-5">
                    <p className="font-bold text-sm md:text-lg lg:text-xl text-justify">
                        {reviewTitle}
                    </p>
                    <div className="flex gap-2">
                        <button onClick={onEdit} aria-label="Edit">
                            <FaEdit className="text-blue-600 hover:text-blue-800 w-4 h-4 md:w-5 md:h-5 cursor-pointer" />
                        </button>
                        <button onClick={onDelete} aria-label="Delete">
                            <MdDelete className="text-red-600 hover:text-red-800 w-4 h-4 md:w-5 md:h-5 cursor-pointer" />
                        </button>
                    </div>
                </div>

                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                    Book: <span className="italic">{bookTitle}</span>
                </p>
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={`h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 ${
                                i < rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>
                <p className="text-xs md:text-sm lg:text-base text-gray-800 text-justify">
                    {review}
                </p>
            </div>
        </div>
    )
}
