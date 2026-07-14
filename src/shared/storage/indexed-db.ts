import { STORAGE_KEYS } from './storage-keys';

const DB_NAME = 'workout-atlas';
const STORE_NAME = 'kv';
const DB_VERSION = 1;

export type KvStore = {
  getItem: (name: string) => Promise<string | null>;
  setItem: (name: string, value: string) => Promise<void>;
  removeItem: (name: string) => Promise<void>;
};

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });

  return dbPromise;
}

function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = run(store);

        request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
        request.onsuccess = () => resolve(request.result as T);
      }),
  );
}

async function migrateFromLocalStorage(store: KvStore): Promise<void> {
  if (typeof localStorage === 'undefined') return;

  for (const key of Object.values(STORAGE_KEYS)) {
    const legacyValue = localStorage.getItem(key);
    if (legacyValue === null) continue;

    const existing = await store.getItem(key);
    if (existing === null) {
      await store.setItem(key, legacyValue);
    }

    localStorage.removeItem(key);
  }
}

export function createIndexedDbStore(): KvStore {
  const store: KvStore = {
    getItem: (name) => withStore('readonly', (objectStore) => objectStore.get(name)),
    setItem: (name, value) =>
      withStore('readwrite', (objectStore) => objectStore.put(value, name)).then(() => undefined),
    removeItem: (name) =>
      withStore('readwrite', (objectStore) => objectStore.delete(name)).then(() => undefined),
  };

  void migrateFromLocalStorage(store);

  return store;
}