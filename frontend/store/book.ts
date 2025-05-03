import { createGenericStore } from '../lib/zustand';
import { Book, Genre } from '@/interface';

export const useBookStore = createGenericStore<Book>('/book', {
    actions: ['fetchAll', 'fetchOne', 'create', 'update', 'remove'],
});

export const useGenreStore = createGenericStore<Genre>('/book/genre', {
    actions: ['fetchAll'],
});
