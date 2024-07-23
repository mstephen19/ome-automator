import { Command, CommandMessage } from './types';

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
    } as CommandMessage);

const tabCommandReceiver = () => {
    const commandHandler = (commandToHandle: Command) => (handler: () => void | Promise<void>) => {
        const listener = async ({ extensionId, command }: CommandMessage) => {
            if (extensionId !== chrome.runtime.id || command !== commandToHandle) return;

            await handler();
        };

        chrome.runtime.onMessage.addListener(listener);

        return () => chrome.runtime.onMessage.addListener(listener);
    };

    return {
        onStart: commandHandler(Command.Start),
        onStop: commandHandler(Command.Stop),
    };
};

export const commandReceiver = tabCommandReceiver();
