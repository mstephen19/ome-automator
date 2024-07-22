import { memCache, messageStore, configStore } from '../storage';
import { sequence } from './sequence';
import { status, Status, raceWithStatus, StatusError } from './status';

const messages = memCache(messageStore);
const config = memCache(configStore);

export const start = async (): Promise<void> => {
    try {
        await sequence();
    } catch (error) {
        if (error instanceof StatusError) {
            console.log('Detected disconnection.');
            return;
        }

        throw error;
    } finally {
        console.log('Restarting sequence.');
        return start();
    }
};

async function main() {
    // Initialize data
    await messages.init();
    await config.init();

    if ([messages.data, config.data].some((val) => val === null)) {
        throw new Error('Message List or Configuration not found. Please open the Popup.');
    }

    // todo: Listen for "start"
    await start();
}

// main();
