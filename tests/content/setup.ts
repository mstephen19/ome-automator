import { vi } from 'vitest';
import { eventMock, TEST_EXTENSION_ID } from './utils';

import type { CommandMessage } from '../../src/types';

export const chromeTabMessages = eventMock<CommandMessage>();
export const observerMock = eventMock<MutationRecord[]>();

vi.stubGlobal('MutationObserver', observerMock.addListener);

vi.stubGlobal('chrome', {
    runtime: {
        id: TEST_EXTENSION_ID,
        onMessage: {
            addListener: chromeTabMessages.addListener,
            removeListener: chromeTabMessages.removeListener,
        },
    },
});

vi.mock('../elements', () => ({
    elements: {
        tip: () => ({ dataset: { tr: 'rules' } }),
    },
}));
