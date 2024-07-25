import { vi } from 'vitest';

export const TEST_EXTENSION_ID = 'test';

export const eventMock = <Event>() => {
    const listeners = new Set<(arg: Event) => void>();

    return {
        addListener: vi.fn((listener: (arg: Event) => void) => {
            console.log('Add Listener', listener);
            listeners.add(listener);
            console.log(listeners);
        }),
        removeListener: vi.fn((listener: (arg: Event) => void) => listeners.delete(listener)),
        dispatch: vi.fn((message: Event) => listeners.forEach((listener) => listener(message))),
    };
};
