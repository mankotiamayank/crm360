// Centralized API Base URL configuration
// Automatically defaults to local backend (http://localhost:5000) or Render if specified in .env
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : 'https://crm360-backend-cdsb.onrender.com');
