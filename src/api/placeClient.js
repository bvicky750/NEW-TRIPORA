/**
 * API Client for Travel Planning Backend
 * Handles all HTTP requests to the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

export class APIError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/**
 * Make an API request with retry logic
 */
async function apiRequest(endpoint, options = {}) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        timeout: 30000,
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new APIError(
          data.error || data.detail || 'API Error',
          data.code || 'UNKNOWN_ERROR',
          response.status
        );
      }

      return data;
    } catch (error) {
      lastError = error;
      
      // Don't retry on 4xx errors (client errors)
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // If this is the last attempt, throw
      if (attempt === MAX_RETRIES) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
    }
  }
  
  if (lastError instanceof APIError) {
    throw lastError;
  }
  
  throw new APIError(
    lastError?.message || 'Network error',
    'NETWORK_ERROR',
    0
  );
}

/**
 * Get detailed information about a place
 */
export async function getPlaceDetails(params) {
  const {
    query,
    vibe = 'Adventure',
    emoji = null,
    includePhotos = true,
    includeReviews = true,
    maxPhotos = 5,
    maxReviews = 5,
  } = params;

  const searchParams = new URLSearchParams({
    query,
    vibe,
    include_photos: includePhotos,
    include_reviews: includeReviews,
    max_photos: maxPhotos,
    max_reviews: maxReviews,
  });

  if (emoji) {
    searchParams.append('emoji', emoji);
  }

  return apiRequest(`/place-details?${searchParams.toString()}`);
}

/**
 * Search for multiple places
 */
export async function searchPlaces(params) {
  const {
    queries,
    vibe = 'Adventure',
    includePhotos = true,
    includeReviews = true,
    maxPhotos = 3,
    maxReviews = 3,
  } = params;

  const searchParams = new URLSearchParams({
    queries: Array.isArray(queries) ? queries.join(',') : queries,
    vibe,
    include_photos: includePhotos,
    include_reviews: includeReviews,
    max_photos: maxPhotos,
    max_reviews: maxReviews,
  });

  return apiRequest(`/places/search?${searchParams.toString()}`);
}

/**
 * Get batch place details for multiple places
 */
export async function batchPlaceDetails(places) {
  return apiRequest('/places/batch', {
    method: 'POST',
    body: JSON.stringify(places),
  });
}

/**
 * Health check
 */
export async function healthCheck() {
  return apiRequest('/health');
}

/**
 * Format place data for display
 */
export function formatPlaceData(place) {
  return {
    ...place,
    displayRating: parseFloat(place.rating).toFixed(1),
    reviewCountText: `${place.review_count} reviews`,
    photoCount: place.photos?.length || 0,
  };
}
