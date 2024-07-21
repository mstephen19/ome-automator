import React, { useEffect, useState, createContext } from 'react';
import { messageStore } from '../../storage';

import type { Message } from '../../types';
import { storeProvider } from './StoreProvider';

const defaultMessageSequence: Message[] = [];

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
