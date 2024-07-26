import { vi } from 'vitest';

export const TEST_EXTENSION_ID = 'test';

/**
 * Use for mocking an event dispatcher (e.g. chrome.runtime.onMessage)
 */
export const eventMock = <Event>() => {
    const listeners = new Set<(arg: Event) => void>();

    return {
        addListener: vi.fn((listener: (arg: Event) => void) => listeners.add(listener)),
        removeListener: vi.fn((listener: (arg: Event) => void) => listeners.delete(listener)),
        dispatch: vi.fn((message: Event) => listeners.forEach((listener) => listener(message))),
    };
};
