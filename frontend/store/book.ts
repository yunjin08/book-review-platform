import { createGenericStore } from '../lib/zustand';
import { Book, Genre } from '@/interface';
import { apiClient } from '@/lib/api-client';

export const useBookStore = createGenericStore<Book>('/book', {
    actions: ['fetchAll', 'fetchOne', 'create', 'update', 'remove'],
});

export const useGenreStore = createGenericStore<Genre>('/book/genre', {
    actions: ['fetchAll'],
});


export const addBookReading = async (bookId: number, date_started: string, date_finished: string) => {
    try {
        const response = await apiClient.post('/account/reading-list/', {
            book: bookId,
            date_started: date_started,
            date_finished: date_finished,
        })
        console.log('Reading added successfully:', response)
    } catch (error) {
        console.error('Error adding reading:', error)
    }
}

export const getBookReadingHistory = async () => {
    try {
        const response = await apiClient.get('/account/reading-list/')
        return response;
    } catch (error) {
        console.error('Error adding reading:', error)
    }
}