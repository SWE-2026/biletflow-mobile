// Web build of localStore: expo-file-system does not support web, so values go to localStorage.

const PREFIX = 'biletflow.local.';

export const localStore = {
  read<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  },
  write(key: string, value: unknown) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  },
  remove(key: string) {
    localStorage.removeItem(PREFIX + key);
  },
  keys(prefix: string): string[] {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX + prefix))
      .map((key) => key.slice(PREFIX.length));
  },
};
