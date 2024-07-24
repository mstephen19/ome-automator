import { createContext } from 'react';
import { configStore } from '../../storage';

import { storeProvider } from './StoreProvider';
import { defaultConfig } from '../../consts';

export const ConfigContext = createContext(defaultConfig);

/**
 * Retrieves messages from {@link configStore} on initial mount.
 *
 * Updates state when changes are detected.
 */
export const ConfigProvider = storeProvider({
    store: configStore,
    defaultValue: defaultConfig,
    context: ConfigContext,
    merge: (fromStore, defaultValue) => ({ ...defaultValue, ...fromStore }),
});
