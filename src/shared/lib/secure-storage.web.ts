// expo-secure-store has no web implementation; fall back to localStorage (dev/preview only).
export const secureStorage = {
  get: async (key: string) =>
    typeof localStorage === 'undefined' ? null : localStorage.getItem(key),
  set: async (key: string, value: string) => localStorage.setItem(key, value),
  remove: async (key: string) => localStorage.removeItem(key),
};
