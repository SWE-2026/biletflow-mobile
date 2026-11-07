import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * Calls `reload` when the screen regains focus (not on the first focus, which the initial load
 * covers) and, with `intervalMs`, periodically while the screen stays focused.
 */
export function useRefreshOnFocus(reload: () => void, intervalMs?: number) {
  const firstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
      } else {
        reload();
      }
      if (!intervalMs) return undefined;
      const id = setInterval(reload, intervalMs);
      return () => clearInterval(id);
    }, [reload, intervalMs]),
  );
}
