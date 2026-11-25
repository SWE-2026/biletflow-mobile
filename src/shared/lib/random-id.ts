/**
 * A random UUID (version 4). Uses `crypto.randomUUID` where the runtime has it; otherwise
 * Math.random, which is fine here: the ID only has to be unique, not secret.
 */
export function randomUuid(): string {
  const native = globalThis.crypto?.randomUUID;
  if (typeof native === 'function') return native.call(globalThis.crypto);
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
