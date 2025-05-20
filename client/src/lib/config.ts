
// API URL configuration for development
const DEV_API_URL = 'http://localhost:5000';
const PROD_API_URL = 'https://your-api-url.com'; // Update this when deploying

export const API_URL = import.meta.env.PROD ? PROD_API_URL : DEV_API_URL;
