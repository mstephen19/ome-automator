import { configStore, memCache, messageStore, tabDataStore } from '../storage';
import { commandReceiver } from '../tabs';

export const messages = memCache(messageStore);
export const config = memCache(configStore);
export const tabData = memCache(tabDataStore);

const running = () => {
    let running = false;

    commandReceiver.onStart(() => void (running = true))
}