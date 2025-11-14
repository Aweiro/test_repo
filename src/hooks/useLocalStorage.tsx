import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key);
      if (data !== null) {
        try {
          setValue(JSON.parse(data));
        } catch {
          setValue(defaultValue);
        }
      } else {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    }
  }, [key, defaultValue]);

  const save = (newValue: T | ((prev: T) => T)) => {
    setValue((prev: T) => {
      const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;

      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }

      return valueToStore;
    });
  };

  return [value, save] as const;
}