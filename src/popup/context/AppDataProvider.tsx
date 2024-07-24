import { createContext } from 'react';
import { appDataStore } from '../../storage';

import { storeProvider } from './StoreProvider';
import { defaultAppData } from '../../consts';

export const AppDataContext = createContext(defaultAppData);

/**
 * Retrieves messages from {@link appDataStore} on initial mount.
 *
 * Updates state when changes are detected.
 */
export const AppDataProvider = storeProvider({
    store: appDataStore,
    defaultValue: defaultAppData,
    context: AppDataContext,
    merge: (fromStore, defaultValue) => ({ ...defaultValue, ...fromStore }),
});
