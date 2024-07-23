import { tabDataStore } from '../storage';
import { messages, tabData, config } from './cache';
import { commandReceiver } from '../tabs';
import { StatusError } from './status';
import { sequence, StoppedError } from './sequence';

export const sequenceLoop = async (): Promise<void> => {
    try {
        await sequence();
    } catch (err) {
        // Stop running if stopped
        if (err instanceof StoppedError) return;

        if (err instanceof StatusError) {
            return sequenceLoop();
        }

        throw err;
    }

    return sequenceLoop();
};

async function main() {
    // Initialize data
    await messages.init();
    await config.init();
    await tabData.init();

    if ([messages.data, config.data, tabData.data].some((val) => val === null)) {
        throw new Error('Critical data not found. Please open the Popup.');
    }

    let started = false;

    commandReceiver.onStart(async () => {
        if (started) return;
        started = true;

        // Clear "started" time if unloading - script will stop
        window.addEventListener('beforeunload', () => tabDataStore.write({ ...tabData.data!, startedUnixMs: null }));

        await tabDataStore.write({
            ...tabData.data!,
            startedUnixMs: Date.now(),
        });

        await sequenceLoop();

        started = false;
    });
}

main();
