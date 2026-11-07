import { useCallback, useEffect, useRef, useState } from 'react';

type Snapshot<T> = { key: string; data?: T; error?: unknown };

export type AsyncData<T> = {
  data: T | undefined;
  /** Error of the latest request. Data from an earlier successful request is kept. */
  error: unknown;
  /** True until the first request for the current key settles. */
  loading: boolean;
  /** True while a user-triggered `refresh` (pull to refresh) is running. */
  refreshing: boolean;
  refresh: () => Promise<void>;
  /** Refetches in the background, keeping the current data on screen. */
  reload: () => void;
};

/**
 * Loads data for `key` and reloads whenever `key` changes. A newer request aborts the previous one,
 * so a slow response never overwrites a fresher one.
 */
export function useAsyncData<T>(
  key: string,
  load: (signal: AbortSignal) => Promise<T>,
): AsyncData<T> {
  const [snapshot, setSnapshot] = useState<Snapshot<T> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const loadRef = useRef(load);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadRef.current = load;
  });

  const fetchData = useCallback((forKey: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return loadRef.current(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setSnapshot({ key: forKey, data });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setSnapshot((prev) => ({ key: forKey, data: prev?.key === forKey ? prev.data : undefined, error }));
      },
    );
  }, []);

  useEffect(() => {
    fetchData(key);
    return () => controllerRef.current?.abort();
  }, [key, fetchData]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData(key);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, key]);

  const reload = useCallback(() => {
    fetchData(key);
  }, [fetchData, key]);

  const current = snapshot?.key === key ? snapshot : null;

  return {
    data: current?.data,
    error: current?.error,
    loading: current === null,
    refreshing,
    refresh,
    reload,
  };
}
