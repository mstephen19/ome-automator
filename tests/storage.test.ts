import { describe, it, expect, vi } from 'vitest';
import { chromeStorage } from '../src/storage';
import { chromeStorageMessages } from './_setup';

describe('Chrome Storage Wrapper', () => {
    const testStorage = chromeStorage(chrome.storage.local, 'test');

    describe('OnChange', () => {
        it('Should fire events when the target key changes.', () => {
            const listener = vi.fn();
            const cleanup = testStorage.onChange(listener);

            chromeStorageMessages.dispatch({ test: { newValue: 123 } });

            expect(listener).toHaveBeenCalledOnce();
            expect(listener).toHaveBeenCalledWith(123);

            cleanup();
        });

        it('Should not fire events when a change occurs, but not on the target key.', () => {
            const listener = vi.fn();
            const cleanup = testStorage.onChange(listener);

            chromeStorageMessages.dispatch({ randomKey: { newValue: 123 } });

            expect(listener).not.toHaveBeenCalledOnce();
            expect(listener).not.toHaveBeenCalledWith(123);

            cleanup();
        });
    });

    describe('Write', () => {
        it('Should call the underlying storage method.', () => {
            testStorage.write(1234);

            expect(chrome.storage.local.set).toHaveBeenCalledOnce();
            expect(chrome.storage.local.set).toHaveBeenCalledWith(
                expect.objectContaining({
                    test: 1234,
                })
            );
        });
    });

    describe('Read', () => {
        it('Should call the underlying storage method.', () => {
            testStorage.read();

            expect(chrome.storage.local.get).toHaveBeenCalledOnce();
            expect(chrome.storage.local.get).toHaveBeenCalledWith('test');
        });
    });
});
