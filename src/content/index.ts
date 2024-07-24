import { tabDataStore } from '../storage';
import { messages, tabData, config } from './cache';
import { commands } from './commands';
import { resetToIdle, sequenceLoop } from './sequence';
import { Command } from '../types';
import { status } from './status';

async function main() {
    // Initialize data
    await messages.init();
    await config.init();
    await tabData.init();

    if ([messages.data, config.data, tabData.data].some((val) => val === null)) {
        // todo: Display warning
        throw new Error('Critical data not found. Please open the Popup.');
    }

    const startListener = async ({ detail: tabId }: CustomEvent<number>) => {
        // Status is now needed, initialize it if not already.
        await status.init();

        // Updates the store to let the popup know the script is no longer running (unloading).
        window.addEventListener('beforeunload', resetToIdle);

        // Sets the running tab - Propagates to the UI
        await tabDataStore.write({
            runningTab: tabId,
            startedUnixMs: Date.now(),
        });

        try {
            await sequenceLoop();
        } catch (err) {
            // ! Handling errors fairly silently here.
            resetToIdle();
            return;
        } finally {
            // No longer needed until "start" is called again.
            window.removeEventListener('beforeunload', resetToIdle);
        }

        commands.events.addEventListener(Command.Start, startListener, { once: true });
    };

    // Wait for "Start" button to be clicked.
    commands.events.addEventListener(Command.Start, startListener, { once: true });
}

main();
