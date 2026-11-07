import React, { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'spider_favorite_posts';
const FAVORITES_EVENT_NAME = 'spider-favorites-updated';

function readFavoritesFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeFavoritesToStorage(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT_NAME, { detail: ids }));
  } catch (err) {
    console.warn('Failed to save favorites to localStorage:', err);
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readFavoritesFromStorage());

  useEffect(() => {
    const handleSync = () => {
      setFavoriteIds(readFavoritesFromStorage());
    };

    window.addEventListener(FAVORITES_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const isFavorite = useCallback(
    (postId: string) => favoriteIds.includes(postId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback((postId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const current = readFavoritesFromStorage();
    const exists = current.includes(postId);
    const updated = exists
      ? current.filter((id) => id !== postId)
      : [postId, ...current];
    setFavoriteIds(updated);
    writeFavoritesToStorage(updated);
  }, []);

  const removeFavorite = useCallback((postId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const current = readFavoritesFromStorage();
    const updated = current.filter((id) => id !== postId);
    setFavoriteIds(updated);
    writeFavoritesToStorage(updated);
  }, []);

  const clearFavorites = useCallback(() => {
    setFavoriteIds([]);
    writeFavoritesToStorage([]);
  }, []);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };
}
