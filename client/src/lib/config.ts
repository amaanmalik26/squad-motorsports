// If we are in production (live), use the Render URL.
// If we are developing locally, use localhost:5000.
// REPLACE 'https://your-backend.onrender.com' LATER with your actual URL!
export const API_URL = import.meta.env.PROD 
    ? 'https://squad-backend.onrender.com' 
    : API_URL + '';