import { describe, expect, it, vi } from 'vitest';
import { chromeTabMessages } from './setup';

import { TEST_EXTENSION_ID } from './utils';
import { commands } from '../../src/content/commands';
import { Command } from '../../src/types';

describe('Tab Command Router', () => {
    it.each([Command.Start, Command.Stop])('Should forward received commands.', (command) => {
        const eventHandler = vi.fn((_: CustomEvent<number>) => {});
        commands.events.addEventListener(command, eventHandler);

        // Simulate stop button click
        chromeTabMessages.dispatch({
            extensionId: TEST_EXTENSION_ID,
            command: command,
            tabId: 123,
        });

        expect(eventHandler).toHaveBeenCalledOnce();
        expect(eventHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                type: command,
                detail: 123,
            })
        );
        commands.events.removeEventListener(command, eventHandler);
    });
});
