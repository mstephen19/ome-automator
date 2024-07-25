import { Command, CommandMessage } from '../types';
import { TypedEventTarget } from '../utils';
import { elements } from './elements';

const tabCommandRouter = () => {
    const events = new TypedEventTarget<{
        [Command.Start]: CustomEvent<number>;
        [Command.Stop]: CustomEvent<number>;
    }>();

    chrome.runtime.onMessage.addListener(({ extensionId, command, tabId }: CommandMessage) => {
        if (extensionId !== chrome.runtime.id) return;

        events.dispatchEvent(new CustomEvent(command, { detail: tabId }));
    });

    // Stops if the user clicks the "Stop" button.
    elements.stopButton()?.addEventListener('click', () => {
        // Passing invalid tab ID (-1)
        // Stopping sets the runningTab to null anyways
        events.dispatchEvent(new CustomEvent(Command.Stop, { detail: -1 }));
    });

    return {
        events,
    };
};

export const commands = tabCommandRouter();