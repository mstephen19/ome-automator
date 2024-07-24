import { Command, CommandMessage } from '../types';
import { TypedEventTarget } from '../utils';

const tabCommandReceiver = () => {
    const events = new TypedEventTarget<{
        [Command.Start]: CustomEvent<undefined>;
        [Command.Stop]: CustomEvent<undefined>;
    }>();

    chrome.runtime.onMessage.addListener(({ extensionId, command }: CommandMessage) => {
        if (extensionId !== chrome.runtime.id) return;

        console.log(command, 'received');

        events.dispatchEvent(new CustomEvent(command));
    });

    return {
        events,
    };
};

export const commands = tabCommandReceiver();
