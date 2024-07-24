import { Command, CommandMessage } from '../types';
import { TypedEventTarget } from '../utils';

const tabCommandReceiver = () => {
    const events = new TypedEventTarget<{
        [Command.Start]: CustomEvent<number>;
        [Command.Stop]: CustomEvent<number>;
    }>();

    chrome.runtime.onMessage.addListener(({ extensionId, command, tabId }: CommandMessage) => {
        if (extensionId !== chrome.runtime.id) return;

        console.log(command, tabId, 'received');

        events.dispatchEvent(new CustomEvent(command, { detail: tabId }));
    });

    return {
        events,
    };
};

export const commands = tabCommandReceiver();
