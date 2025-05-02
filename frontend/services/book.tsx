import { apiClient } from '@/lib/api-client';

export const getGenre = async (params: any) => {
    try {
        const response = await apiClient.get('/book/genre/', params)
        return response
    } catch (error) {
        console.error('Error fetching genres:', error)
        throw error
    }
}

export const createBooks = async (data: any) => {
    try {
        const response = await apiClient.post('book/', data)
        return response
    } catch (error) {
        console.error('Error creating book:', error)
        throw error
    }
}

export const getBooks = async (params: any) => {
    try {
        const response = await apiClient.get('book/', params)
        return response
    } catch (error) {
        console.error('Error fetching books:', error)
        throw error
    }
}
