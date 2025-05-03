export interface User {
    id: number
    username: string
    first_name: string
    last_name: string
    email: string
    bio: string
    profile_picture: string
    books_read_count: number
    reviews_count: number
    is_admin: boolean
    date_joined: string
    full_name: string // property from model
    average_rating: number // property from model
    rating_distribution: Record<number, number> // Dictionary of rating -> count
}

export interface Book {
    id: number
    title: string
    genres_detail: Genre[]
    description: string
    isbn: string
    author: string
    publication_date: string
    created_by: User
    created_at: string
    updated_at: string
    rating?: number // to be changed when json
    total_reviews?: number
    cover_image: string
    // Properties likely from your Book model
    average_rating?: number
    reviews_count?: number
    reviews?: Review[]
}

export interface CreateBookReading {
    id?: number
    user?: number // Foreign key ID
    book?: number // Foreign key ID
    status?: 'want_to_read' | 'currently_reading' | 'read'
    date_added?: string
    date_started?: string | null
    date_finished?: string | null
}

export interface BookReading {
    id: number
    user: number // Foreign key ID
    book: Book // Foreign key ID
    status: 'want_to_read' | 'currently_reading' | 'read'
    date_added: string
    date_started?: string | null
    date_finished?: string | null
}

export interface Genre {
    id: number
    name: string
}

export interface ReadingList {
    id: number
    user: number // Foreign key ID
    book: number // Foreign key ID
    status: 'want_to_read' | 'currently_reading' | 'read'
    date_added: string
    date_started: string | null
    date_finished: string | null
    book_details?: Book // Optional expanded book details
    user_details?: User // Optional expanded user details
}

export interface Review {
    id: number
    user: number // Foreign key ID
    book: number // Foreign key ID
    title: string
    body: string
    rating: number // 1-5
    created_at: string
    updated_at: string
    user_details?: User // Optional expanded user details
    book_details?: Book // Optional expanded book details
    comments_count?: number // Optional count of comments
}

export interface Comment {
    id: number
    user: number // Foreign key ID
    review: number // Foreign key ID
    body: string
    created_at: string
    updated_at: string
    user_details?: User // Optional expanded user details
}

// For paginated API responses
export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// For paginated Sort Options
export interface SortOptions {
    bookRate: string
    activeUsers: string
    mostReviewed: string
}

export type UserListResponse = PaginatedResponse<User>
export type BookListResponse = PaginatedResponse<Book>
export type ReviewListResponse = PaginatedResponse<Review>
