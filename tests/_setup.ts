import { vi } from 'vitest';
import { eventMock, TEST_EXTENSION_ID } from './content/utils';

import type { CommandMessage } from '../src/types';

export const chromeTabMessages = eventMock<CommandMessage>();
export const observerMock = eventMock<MutationRecord[]>();
export const chromeStorageMessages = eventMock<Record<string, any>>();

vi.stubGlobal(
    'CustomEvent',
    class Stub extends Event {
        constructor(type: any, data: any) {
            super(type);

            (this as any).detail = data?.detail;
        }
    }
);

vi.stubGlobal('MutationObserver', observerMock.addListener);

vi.stubGlobal('chrome', {
    runtime: {
        id: TEST_EXTENSION_ID,
        onMessage: {
            addListener: chromeTabMessages.addListener,
            removeListener: chromeTabMessages.removeListener,
        },
        getManifest: () => ({}),
    },
    storage: {
        local: {
            set: vi.fn(),
            get: vi.fn(() => ({})),
            onChanged: {
                addListener: chromeStorageMessages.addListener,
                removeListener: chromeStorageMessages.removeListener,
            },
        },
    },
});

vi.mock('../elements', () => ({
    elements: { tip: () => ({ dataset: { tr: 'rules_agreement_default' } }) },
}));
