import { createGenericStore } from '../lib/zustand'
import { Book, Genre, CreateBookReading, BookReading } from '@/interface'

export const useBookStore = createGenericStore<Book>('/book', {
    actions: ['fetchAll', 'fetchOne', 'create', 'update', 'remove'],
})

export const useGenreStore = createGenericStore<Genre>('/book/genre', {
    actions: ['fetchAll'],
})

export const useCreateBookReadingStore = createGenericStore<CreateBookReading>(
    '/account/reading-list',
    {
        actions: ['create'],
    }
)

export const useBookReadingStore = createGenericStore<BookReading>(
    '/account/reading-list',
    {
        actions: ['fetchAll'],
    }
)
