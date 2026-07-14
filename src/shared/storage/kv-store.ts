import { Platform } from 'react-native';
import { createIndexedDbStore, type KvStore } from './indexed-db';

function createNativeStore(): KvStore {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Storage = require('expo-sqlite/kv-store').default as KvStore;
  return {
    getItem: async (name) => Storage.getItem(name),
    setItem: async (name, value) => {
      await Storage.setItem(name, value);
    },
    removeItem: async (name) => {
      await Storage.removeItem(name);
    },
  };
}

const kvStore: KvStore = Platform.OS === 'web' ? createIndexedDbStore() : createNativeStore();

export default kvStore;
export type { KvStore };