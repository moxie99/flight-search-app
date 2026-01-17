// ============================================================================
// Optimization Hooks
// Reusable hooks for performance optimization patterns
// ============================================================================

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// -----------------------------------------------------------------------------
// useDebounce - Debounce a value
// -----------------------------------------------------------------------------

/**
 * Debounces a value by delaying updates until after a specified delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// -----------------------------------------------------------------------------
// useDebouncedCallback - Debounce a callback function
// -----------------------------------------------------------------------------

/**
 * Creates a debounced version of a callback function
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns A debounced version of the callback
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number
): (...args: TArgs) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: TArgs) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

// -----------------------------------------------------------------------------
// useThrottle - Throttle a value
// -----------------------------------------------------------------------------

/**
 * Throttles a value by limiting updates to at most once per interval
 * @param value - The value to throttle
 * @param interval - Minimum interval between updates in milliseconds
 * @returns The throttled value
 */
export const useThrottle = <T>(value: T, interval: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timeoutId = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastUpdate);

      return () => clearTimeout(timeoutId);
    }
  }, [value, interval]);

  return throttledValue;
};

// -----------------------------------------------------------------------------
// useThrottledCallback - Throttle a callback function
// -----------------------------------------------------------------------------

/**
 * Creates a throttled version of a callback function
 * @param callback - The function to throttle
 * @param interval - Minimum interval between calls in milliseconds
 * @returns A throttled version of the callback
 */
export function useThrottledCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  interval: number
): (...args: TArgs) => void {
  const lastRan = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: TArgs) => {
      const now = Date.now();
      const timeSinceLastRan = now - lastRan.current;

      if (timeSinceLastRan >= interval) {
        lastRan.current = now;
        callbackRef.current(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastRan.current = Date.now();
          callbackRef.current(...args);
        }, interval - timeSinceLastRan);
      }
    },
    [interval]
  );
}

// -----------------------------------------------------------------------------
// usePrevious - Track the previous value
// -----------------------------------------------------------------------------

/**
 * Returns the previous value of a variable
 * @param value - The value to track
 * @returns The previous value
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// -----------------------------------------------------------------------------
// useStableCallback - Create a stable callback reference
// -----------------------------------------------------------------------------

/**
 * Creates a stable callback that always references the latest function
 * Useful for passing callbacks to memoized children without causing re-renders
 * @param callback - The callback function
 * @returns A stable reference to the callback
 */
export function useStableCallback<TArgs extends unknown[], TReturn>(
  callback: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    (...args: TArgs) => callbackRef.current(...args),
    []
  );
}

// -----------------------------------------------------------------------------
// useDeepMemo - Memoize with deep comparison
// -----------------------------------------------------------------------------

/**
 * Like useMemo, but uses deep comparison for dependencies
 * @param factory - Factory function
 * @param deps - Dependencies array
 * @returns Memoized value
 */
export const useDeepMemo = <T>(factory: () => T, deps: unknown[]): T => {
  const ref = useRef<{ value: T; deps: unknown[] } | null>(null);

  const depsChanged = !ref.current || !deepEqual(ref.current.deps, deps);

  if (depsChanged) {
    ref.current = { value: factory(), deps };
  }

  return ref.current!.value;
};

// Deep equality check helper
const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return a === b;

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => deepEqual(aObj[key], bObj[key]));
};

// -----------------------------------------------------------------------------
// useIntersectionObserver - Intersection Observer hook for lazy loading
// -----------------------------------------------------------------------------

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

/**
 * Hook for using Intersection Observer API
 * Useful for lazy loading and visibility detection
 */
export const useIntersectionObserver = (
  options: IntersectionObserverOptions = {}
): [React.RefCallback<Element>, boolean] => {
  const { root = null, rootMargin = '0px', threshold = 0, enabled = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, root, rootMargin, threshold, enabled]);

  const ref: React.RefCallback<Element> = useCallback((node) => {
    setElement(node);
  }, []);

  return [ref, isIntersecting];
};

// -----------------------------------------------------------------------------
// useVirtualizedList - Simple virtualization helper
// -----------------------------------------------------------------------------

interface VirtualizedListOptions {
  itemCount: number;
  itemHeight: number;
  overscan?: number;
  containerHeight: number;
  scrollTop: number;
}

interface VirtualizedListResult {
  virtualItems: { index: number; start: number }[];
  totalHeight: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Calculates visible items for virtualized list rendering
 */
export const useVirtualizedList = ({
  itemCount,
  itemHeight,
  overscan = 3,
  containerHeight,
  scrollTop,
}: VirtualizedListOptions): VirtualizedListResult => {
  return useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const virtualItems: { index: number; start: number }[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({ index: i, start: i * itemHeight });
    }

    return {
      virtualItems,
      totalHeight: itemCount * itemHeight,
      startIndex,
      endIndex,
    };
  }, [itemCount, itemHeight, overscan, containerHeight, scrollTop]);
};

export default {
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledCallback,
  usePrevious,
  useStableCallback,
  useDeepMemo,
  useIntersectionObserver,
  useVirtualizedList,
};
