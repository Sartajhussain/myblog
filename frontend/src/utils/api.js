// API Base URL configuration
// In development: use localhost:8000
// In production: use Render URL from environment or current domain

const getAPIBaseURL = () => {
  // ENV variable use karo (best practice)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Development
  if (import.meta.env.DEV) {
    return "http://localhost:8000/api/v1";
  }

  // Production (FIXED)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : "";

  return `${protocol}//${hostname}${port}/api/v1`;
};

export const API_BASE_URL = getAPIBaseURL();
export default API_BASE_URL;



