import React from 'react'
import ReviewCard from '../common/ReviewCard'

interface BookReview {
    bookTitle: string
    reviewTitle: string
    rating: number
    review: string
    coverUrl: string
}

// Updated test data with reviewTitle and review
const reviews: BookReview[] = [
    {
        bookTitle: 'The Great Gatsby',
        reviewTitle: 'A Haunting Reflection of the American Dream',
        rating: 5,
        review: 'Fitzgerald paints a vivid picture of jazz-age decadence and the illusions we chase. This book lingers long after the last page.',
        coverUrl: '/logo.png',
    },
    {
        bookTitle: 'To Kill a Mockingbird',
        reviewTitle: "broke me so bad - Justice Through a Child's Eyes",
        rating: 5,
        review: 'A deeply moving exploration of racial injustice told through the innocent perspective of Scout. A must-read for empathy and understanding.',
        coverUrl: '/logo.png',
    },
    {
        bookTitle: '1984',
        reviewTitle:
            "WAS THAT THE BITE OF '87?: Dystopia That Hits Too Close to Home",
        rating: 4,
        review: 'Chilling and eerily prescient. Orwell’s vision of surveillance and control is more relevant than ever.',
        coverUrl: '/logo.png',
    },
    {
        bookTitle: 'Pride and Prejudice',
        reviewTitle: 'LOVED IT!!!!: Wit, Romance, and Social Commentary',
        rating: 5,
        review: 'Elizabeth Bennet is one of literature’s sharpest heroines. Austen’s social critique is both biting and beautiful.',
        coverUrl: '/logo.png',
    },
    {
        bookTitle: 'Moby Dick',
        reviewTitle: 'Kinda A**: A Whale of a Metaphor',
        rating: 3,
        review: 'Epic and ambitious, but bogged down in detail. Worth the voyage if you can weather the long winds.',
        coverUrl: '/logo.png',
    },
    {
        bookTitle: 'Jeanne Dielman, 23, quai du Commerce, 1080 Bruxelles',
        reviewTitle:
            'LOVED IT!!! A Journey That Sparked Generations (though what is with the very long title?)',
        rating: 5,
        review: "Charming, adventurous, and timeless. Tolkien’s world is full of heart and heroism. I have a lot of words to say, not for the reason of review, but just because I need this review to extend beyond the confines of this section. It pains me, I crawl and stumble and vomit all over again and again, by the thought that this review could not get any longer. And even if it does, I continue wishing that it goes on even further, and further and further. What is it with me? Maybe I just need to start reading this book. Maybe that's it. So long, for now...",
        coverUrl: '',
    },
]

export default function UserReviewsSection() {
    return (
        <div className="flex flex-col w-full text-black px-3 md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
            <p className="text-2xl md:text-4xl font-bold mb-4">Your Reviews</p>
            <p className="text-xs md:text-lg text-justify mb-4">
                Take a look back on what you have said about the books you have
                read. Maybe the creative inspiration you need to read again is
                not another book, but your own stroke of genius (or{' '}
                <i>profound</i> lack thereof).
            </p>
            <div className="flex flex-col gap-3 md:gap-6 w-full">
                {reviews.map((entry, index) => (
                    <ReviewCard
                        key={index}
                        bookTitle={entry.bookTitle}
                        reviewTitle={entry.reviewTitle}
                        rating={entry.rating}
                        review={entry.review}
                        coverUrl={entry.coverUrl || '/logo.png'}
                    />
                ))}
            </div>
        </div>
    )
}
