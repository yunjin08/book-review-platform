import { apiClient } from '@/lib/api-client';

export const getUsers = async (params: any) => {
    try {
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        const response = await apiClient.get(`account/users/?${queryString}`);
        return response
    } catch (error) {
        console.error('Error creating book:', error)
        throw error
    }
}

