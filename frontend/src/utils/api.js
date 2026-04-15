// API Base URL configuration
// In development: use localhost:8000
// In production: use Render URL from environment or current domain

const getAPIBaseURL = () => {
  // If VITE_API_URL environment variable is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In development, use localhost
  if (import.meta.env.DEV) {
    return "http://localhost:8000";
  }

  // In production, use current domain's API
  // Remove /api from the current URL if present, then append /api/v1
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : "";
  
  return `${protocol}//${hostname}${port}`;
};

export const API_BASE_URL = getAPIBaseURL();

export default API_BASE_URL;
