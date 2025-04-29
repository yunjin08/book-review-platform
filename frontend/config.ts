export const config = {
    api: {
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    },
} as const;
