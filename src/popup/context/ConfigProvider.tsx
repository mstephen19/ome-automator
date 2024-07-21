import React, { useEffect, useState, createContext } from 'react';
import { configStore } from '../../storage';

import type { Config } from '../../types';
import { storeProvider } from './StoreProvider';

const defaultConfig: Config = {
    messageTimeoutSecs: 1,
    startSequenceTimeoutSecs: 0,
    stopAfterTimeoutMins: 0,
};

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
});
