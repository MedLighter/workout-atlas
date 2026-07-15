import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createIndexedDbStore, type KvStore } from './indexed-db';

function createAsyncStorageStore(): KvStore {
  return {
    getItem: async (name) => AsyncStorage.getItem(name),
    setItem: async (name, value) => {
      await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name) => {
      await AsyncStorage.removeItem(name);
    },
  };
}

function createNativeStore(): KvStore {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Storage = require('expo-sqlite/kv-store').default as KvStore | undefined;
    if (!Storage?.getItem) {
      throw new Error('expo-sqlite kv-store is unavailable');
    }

    return {
      getItem: async (name) => Storage.getItem(name),
      setItem: async (name, value) => {
        await Storage.setItem(name, value);
      },
      removeItem: async (name) => {
        await Storage.removeItem(name);
      },
    };
  } catch (error) {
    console.warn(
      '[workout-atlas] ExpoSQLite unavailable, falling back to AsyncStorage. Rebuild the native app (npm run android) to enable SQLite.',
      error,
    );
    return createAsyncStorageStore();
  }
}

function createStore(): KvStore {
  if (Platform.OS === 'web') {
    return createIndexedDbStore();
  }
  return createNativeStore();
}

const kvStore: KvStore = createStore();

export default kvStore;
export type { KvStore };