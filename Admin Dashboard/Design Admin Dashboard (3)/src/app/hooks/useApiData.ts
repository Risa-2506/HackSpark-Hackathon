import { useState, useEffect, useCallback } from 'react';
import { fetchShopStats, fetchUserStats, ShopStats, UserStats } from '../services/api';

export interface ApiData {
  shopStats: ShopStats[];
  userStats: UserStats[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

/**
 * Custom hook to fetch and manage API data with auto-refresh
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 30000 = 30 seconds)
 */
export function useApiData(refreshInterval: number = 30000): ApiData {
  const [shopStats, setShopStats] = useState<ShopStats[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [shops, users] = await Promise.all([
        fetchShopStats(),
        fetchUserStats(),
      ]);

      setShopStats(shops);
      setUserStats(users);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching API data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh at specified interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, refreshInterval]);

  return {
    shopStats,
    userStats,
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
}

/**
 * Hook to fetch only shop statistics
 */
export function useShopStats(refreshInterval: number = 30000) {
  const [shopStats, setShopStats] = useState<ShopStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchShopStats();
      setShopStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shop stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, refreshInterval]);

  return { shopStats, isLoading, error, refetch: fetchData };
}

/**
 * Hook to fetch only user statistics
 */
export function useUserStats(refreshInterval: number = 30000) {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchUserStats();
      setUserStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, refreshInterval]);

  return { userStats, isLoading, error, refetch: fetchData };
}