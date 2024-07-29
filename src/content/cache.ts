import { addOnsStore, configStore, memCache, messageStore, tabDataStore } from '../storage';

export const messages = memCache(messageStore);
export const config = memCache(configStore);
export const tabData = memCache(tabDataStore);
export const addOns = memCache(addOnsStore)
