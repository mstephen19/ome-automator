import { tabDataStore } from '../storage';
import { messages, tabData, config } from './cache';
import { commands } from './commands';
import { resetToIdle, sequenceLoop } from './sequence';
import { Command } from '../types';
import { status } from './status';
import { defaultConfig, defaultMessageSequence, defaultTabData } from '../consts';
import { elements } from './elements';

async function main() {
    // Initialize data
    // After this call, these caches cannot be null - they are populated with default data.
    await messages.init(defaultMessageSequence);
    await config.init(defaultConfig);
    await tabData.init(defaultTabData);

    const startListener = async ({ detail: tabId }: CustomEvent<number>) => {
        // If the login popup is open or there's an error, do nothing, but still listen for "Start" button clicks.
        if (elements.loginPopup() || elements.errorPopup()) {
            commands.events.addEventListener(Command.Start, startListener, { once: true });
            return;
        }

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
