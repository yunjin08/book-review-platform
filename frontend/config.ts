export const config = {
    api: {
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/',
    },
} as const;
