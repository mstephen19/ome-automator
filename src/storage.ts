import type { Message } from './types';

export const enum SyncStorageKey {
    MessageSequence = 'message_sequence',
}

const chromeStorage = <Data>(storage: chrome.storage.StorageArea, key: string, defaultValue: Data) => {
    return {
        write: async (data: Data) => storage.set({ [key]: data }),
        read: async () => (await storage.get(key))[key] as Promise<Data | undefined>,
        onChange: (handler: (latest: Data) => void) => {
            const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
                if (!(key in changes)) return;
                handler(changes[key].newValue as Data);
            };

            storage.onChanged.addListener(listener);

            return () => {
                storage.onChanged.removeListener(listener);
            };
        },
    };
};

export const messageStore = chromeStorage<Message[]>(chrome.storage.sync, SyncStorageKey.MessageSequence, []);
