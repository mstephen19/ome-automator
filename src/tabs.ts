import { defaultTabData } from './consts';
import { tabDataStore } from './storage';
import { Command, CommandMessage, TabData } from './types';

/**
 * Set a tab to active, if not already.
 *
 * Note: Causes the popup to close.
 */
export const activateTab = async (tab: chrome.tabs.Tab) => {
    // If the tab is already active, don't bother activating it
    if (tab.active) return;

    await chrome.tabs.update(tab.id!, { active: true });
};

/**
 * Send a message to a tab with a specific {@link Command}.
 */
export const sendTabCommand = async (tab: chrome.tabs.Tab, command: Command) =>
    chrome.tabs.sendMessage(tab.id!, {
        extensionId: chrome.runtime.id,
        command,
        tabId: tab.id!,
    } as CommandMessage);

export const urlIsRelevant = (url: string | undefined) => Boolean(url && /^https:\/\/ome\.tv/i.test(url));

/**
 * Find the Ome.tv tab that is either:
 * 1. Currently running
 * 2. Active
 * or
 * 3. Open, but not active
 */
export const findRelevantTab = async (tabData: TabData): Promise<chrome.tabs.Tab | null> => {
    // If there is a tab marked as running already, check it.
    const runningTabExists = tabData.runningTab !== null;

    if (runningTabExists) {
        const retrievedTab = await chrome.tabs.get(tabData.runningTab!);

        // Still exists and is on Ome.tv, it's still valid.
        if (retrievedTab && urlIsRelevant(retrievedTab.url)) {
            return retrievedTab;
        }

        // If the runningTab is no longer on https://ome.tv/*, reset tab state.
        await tabDataStore.write(defaultTabData);
    }

    const tabs = await chrome.tabs.query({ url: 'https://ome.tv/*', currentWindow: true });
    // If there are multiple matching tabs and one is active, use that one.
    // Otherwise, use the first one.
    const target = tabs.reduce((prev, curr) => (curr.active ? curr : prev), tabs[0]);

    return target || null;
};
