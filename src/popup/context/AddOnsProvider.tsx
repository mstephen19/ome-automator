import { createContext } from 'react';
import { addOnsStore } from '../../storage';

import { storeProvider } from './StoreProvider';
import { defaultAddOns } from '../../consts';

export const AddOnsContext = createContext(defaultAddOns);

/**
 * Retrieves messages from {@link configStore} on initial mount.
 *
 * Updates state when changes are detected.
 */
export const AddOnsProvider = storeProvider({
    store: addOnsStore,
    defaultValue: defaultAddOns,
    context: AddOnsContext,
    merge: (fromStore, defaultValue) => ({ ...defaultValue, ...fromStore }),
});
