/**
 * Custom React Hooks for Place Data Fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { getPlaceDetails, searchPlaces, batchPlaceDetails, APIError } from '../api/placeClient';

/**
 * Hook to fetch place details
 */
export function usePlaceDetails(query, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const includePhotos = options.includePhotos;
  const includeReviews = options.includeReviews;
  const maxPhotos = options.maxPhotos;
  const maxReviews = options.maxReviews;
  const vibe = options.vibe;
  const emoji = options.emoji;

  const fetch = useCallback(async () => {
    if (!query) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getPlaceDetails({
        query,
        includePhotos,
        includeReviews,
        maxPhotos,
        maxReviews,
        vibe,
        emoji,
      });
      setData(result);
    } catch (err) {
      setError({
        message: err.message,
        code: err.code,
        status: err.status,
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [query, includePhotos, includeReviews, maxPhotos, maxReviews, vibe, emoji]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook to search multiple places
 */
export function useSearchPlaces(queries, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const includePhotos = options.includePhotos;
  const includeReviews = options.includeReviews;
  const maxPhotos = options.maxPhotos;
  const maxReviews = options.maxReviews;
  const vibe = options.vibe;

  const fetch = useCallback(async () => {
    if (!queries || queries.length === 0) {
      setData([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await searchPlaces({
        queries: Array.isArray(queries) ? queries : [queries],
        includePhotos,
        includeReviews,
        maxPhotos,
        maxReviews,
        vibe,
      });
      setData(Array.isArray(result) ? result : [result]);
    } catch (err) {
      setError({
        message: err.message,
        code: err.code,
        status: err.status,
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [queries, includePhotos, includeReviews, maxPhotos, maxReviews, vibe]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook to batch fetch multiple places
 */
export function useBatchPlaceDetails(places, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const includePhotos = options.includePhotos;
  const includeReviews = options.includeReviews;
  const maxPhotos = options.maxPhotos;
  const maxReviews = options.maxReviews;

  const fetch = useCallback(async () => {
    if (!places || places.length === 0) {
      setData([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const placesToFetch = places.map((place) => ({
        query: place.query || place.name,
        include_photos: includePhotos !== false,
        include_reviews: includeReviews !== false,
        max_photos: maxPhotos || 5,
        max_reviews: maxReviews || 5,
        vibe: place.vibe || 'Adventure',
        emoji: place.emoji || null,
      }));

      const result = await batchPlaceDetails(placesToFetch);
      setData(Array.isArray(result) ? result : [result]);
      setProgress(100);
    } catch (err) {
      setError({
        message: err.message,
        code: err.code,
        status: err.status,
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [places, includePhotos, includeReviews, maxPhotos, maxReviews]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, progress, refetch: fetch };
}

/**
 * Hook with caching for expensive operations
 */
export function usePlaceDetailsWithCache(query, options = {}) {
  const [cache, setCache] = useState({});
  const { data, loading, error, refetch } = usePlaceDetails(query, options);

  useEffect(() => {
    if (data && query) {
      setCache((prev) => ({
        ...prev,
        [query]: data,
      }));
    }
  }, [data, query]);

  const getCached = useCallback(
    (q) => cache[q] || null,
    [cache]
  );

  return { data, loading, error, refetch, cache, getCached };
}
