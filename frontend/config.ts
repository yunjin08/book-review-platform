const DEFAULT_LOCAL_API_URL = 'http://localhost:8000/api/v1/';

function getApiBaseUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const nodeEnv = process.env.NODE_ENV;

    // Allow HTTP localhost endpoint ONLY in development mode and when env var is unset
    if (!apiUrl) {
        if (nodeEnv === 'development') {
            return DEFAULT_LOCAL_API_URL;
        }
        throw new Error(
            'NEXT_PUBLIC_API_URL environment variable is not set. ' +
            'For production and staging builds, this variable must be set to a secure (HTTPS) API endpoint.' +
            ' Failing closed to prevent insecure default API connections.'
        );
    }

    // Require HTTPS for production/staging; allow localhost/http only if explicitly set and in development
    const isLocalhost =
        apiUrl.startsWith('http://localhost') ||
        apiUrl.startsWith('http://127.0.0.1');

    if (nodeEnv !== 'development') {
        if (!apiUrl.startsWith('https://')) {
            throw new Error(
                'In production or staging, NEXT_PUBLIC_API_URL must begin with "https://". ' +
                `Current value: ${apiUrl}`
            );
        }
    } else {
        // In development, allow both HTTP/S (e.g., for local devs)
        if (!apiUrl.startsWith('https://') && !isLocalhost) {
            throw new Error(
                'In development, NEXT_PUBLIC_API_URL must be HTTPS or point to localhost/127.0.0.1.' +
                ` Current value: ${apiUrl}`
            );
        }
    }

    return apiUrl;
}

export const config = {
    api: {
        baseURL: getApiBaseUrl(),
    },
} as const