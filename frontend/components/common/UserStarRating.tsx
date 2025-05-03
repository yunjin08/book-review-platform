import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

interface UserStarRatingProps {
    rating?: number
    onChange: (value: number) => void
}

const UserStarRating: React.FC<UserStarRatingProps> = ({
    rating = 0,
    onChange,
}) => {
    const [hover, setHover] = useState(0)

    return (
        <div className="flex mb-2">
            {[...Array(5)].map((_, i) => {
                const current = i + 1
                return (
                    <FaStar
                        key={i}
                        className={`h-6 w-6 cursor-pointer transition-colors ${
                            current <= (hover || rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                        }`}
                        onClick={() => onChange(current)}
                        onMouseEnter={() => setHover(current)}
                        onMouseLeave={() => setHover(0)}
                    />
                )
            })}
        </div>
    )
}

export default UserStarRating
