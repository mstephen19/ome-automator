import { createContext } from 'react';
import { messageStore } from '../../storage';

import { storeProvider } from './StoreProvider';
import { defaultMessageSequence } from '../../consts';

export const MessageSequenceContext = createContext(defaultMessageSequence);

/**
 * Retrieves messages from {@link messageStore} on initial mount.
 *
 * Updates state when changes are detected.
 */
export const MessageSequenceProvider = storeProvider({
    store: messageStore,
    defaultValue: defaultMessageSequence,
    context: MessageSequenceContext,
});
