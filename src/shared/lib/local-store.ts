import { Directory, File, Paths } from 'expo-file-system';

// Small JSON documents kept on the device (not secrets: those go in secureStorage). Each key is a
// file in the app's document directory, which the OS does not clear on low storage.

const directory = () => new Directory(Paths.document, 'biletflow-local');
const fileFor = (key: string) => new File(directory(), `${key.replace(/[^\w.-]/g, '_')}.json`);

export const localStore = {
  /** The stored value, or `null` when missing or unreadable. */
  read<T>(key: string): T | null {
    try {
      const file = fileFor(key);
      return file.exists ? (JSON.parse(file.textSync()) as T) : null;
    } catch {
      return null;
    }
  },
  write(key: string, value: unknown) {
    const dir = directory();
    if (!dir.exists) dir.create({ intermediates: true });
    const file = fileFor(key);
    if (!file.exists) file.create();
    file.write(JSON.stringify(value));
  },
  remove(key: string) {
    const file = fileFor(key);
    if (file.exists) file.delete();
  },
  /** Keys of the stored values whose key starts with `prefix`. */
  keys(prefix: string): string[] {
    const dir = directory();
    if (!dir.exists) return [];
    return dir
      .list()
      .filter((entry): entry is File => entry instanceof File && entry.name.endsWith('.json'))
      .map((file) => file.name.slice(0, -'.json'.length))
      .filter((key) => key.startsWith(prefix));
  },
};
