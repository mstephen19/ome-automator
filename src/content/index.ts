import { tabDataStore } from '../storage';
import { messages, tabData, config } from './cache';
import { commands } from '../tabs';
import { StatusError } from './status';
import { sequence, StoppedError } from './sequence';
import { Command } from '../types';

export const sequenceLoop = async (): Promise<void> => {
    try {
        await sequence();
    } catch (err) {
        // Stop running if stopped
        if (err instanceof StoppedError) return;

        if (err instanceof StatusError) {
            console.log('Disconnected detected. Restarting.');
            return sequenceLoop();
        }

        throw err;
    }

    return sequenceLoop();
};

// todo: Handle "Are you there?" popup

async function main() {
    // Initialize data
    await messages.init();
    await config.init();
    await tabData.init();

    if ([messages.data, config.data, tabData.data].some((val) => val === null)) {
        throw new Error('Critical data not found. Please open the Popup.');
    }

    const startListener = async () => {
        // Clear "started" time if unloading - script will stop
        window.addEventListener('beforeunload', () => tabDataStore.write({ ...tabData.data!, startedUnixMs: null }));

        await tabDataStore.write({
            // todo: Possible to get tabId within the tab?
            // todo: If so, possible to focus the tab from within content script?
            ...tabData.data!,
            startedUnixMs: Date.now(),
        });

        await sequenceLoop();

        commands.events.addEventListener(Command.Start, startListener, { once: true });
    };

    commands.events.addEventListener(Command.Start, startListener, { once: true });
}

main();
