import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Check if localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }

      try {
        return JSON.parse(item);
      } catch (parseError) {
        console.error(`Error parsing localStorage item ${key}:`, parseError);
        return initialValue;
      }
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return initialValue;
    }
  });

  // Save value to localStorage whenever it changes
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      const serializedValue = JSON.stringify(storedValue);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving to localStorage for key ${key}:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
} 