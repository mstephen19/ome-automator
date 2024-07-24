import { Command, CommandMessage } from './types';
import { TypedEventTarget } from './utils';

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
    const events = new TypedEventTarget<{
        [Command.Start]: CustomEvent<undefined>;
        [Command.Stop]: CustomEvent<undefined>;
    }>();

    chrome.runtime.onMessage.addListener(({ extensionId, command }: CommandMessage) => {
        if (extensionId !== chrome.runtime.id) return;

        events.dispatchEvent(new CustomEvent(command));
    });

    return {
        events,
    };
};

export const commands = tabCommandReceiver();
