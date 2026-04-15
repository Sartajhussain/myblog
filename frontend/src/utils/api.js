// API Base URL configuration
// Frontend adds /api/v1 in each call, so this returns just the base domain
// In development: http://localhost:8000
// In production: https://blog-application-774e.onrender.com

const getAPIBaseURL = () => {
  // ENV variable use karo (best practice)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Development
  if (import.meta.env.DEV) {
    return "http://localhost:8000";
  }

  // Production fallback - use current domain (Render URL)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : "";

  return `${protocol}//${hostname}${port}`;
};

export const API_BASE_URL = getAPIBaseURL();
export default API_BASE_URL;



