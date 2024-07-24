import { AppData, Config, TabData, type Message } from './types';

export const enum SyncStorageKey {
    MessageSequence = 'message_sequence',
    Config = 'config',
    AppData = 'app_data',
    TabData = 'tab_data',
}

/**
 * Make & listen for changes on a single key within a {@link chrome.storage.StorageArea}.
 */
export const chromeStorage = <Data>(storage: chrome.storage.StorageArea, key: string) => {
    return {
        write: async (data: Data) => storage.set({ [key]: data }),
        read: async () => (await storage.get(key))[key] as Promise<Data | undefined>,
        onChange: (handler: (latest: Data) => void) => {
            const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
                // Only fire the handler for the key data it's prepared to handle
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

/**
 * {@link chromeStorage} subscriber.
 *
 * Cache a readable copy of the {@link chromeStorage} API. Updates the cache when `onChange` fires.
 *
 * Provides a realtime view of a store, allowing immediate access to the latest data.
 */
export const memCache = <Data>(api: ReturnType<typeof chromeStorage<Data>>) => {
    let latest: Data | null = null;

    return {
        init: async (defaultValue: Data) => {
            // ! Not merging any newest config changes
            // Not necessary, because Popup handles merges.
            latest = (await api.read()) ?? null;

            if (latest === null) {
                await api.write(defaultValue);
                latest = defaultValue;
            }

            api.onChange((latestData) => (latest = latestData));
        },
        get latest() {
            return latest;
        },
    };
};

export const messageStore = chromeStorage<Message[]>(chrome.storage.sync, SyncStorageKey.MessageSequence);
export const configStore = chromeStorage<Config>(chrome.storage.sync, SyncStorageKey.Config);
export const appDataStore = chromeStorage<AppData>(chrome.storage.sync, SyncStorageKey.AppData);
export const tabDataStore = chromeStorage<TabData>(chrome.storage.sync, SyncStorageKey.TabData);
