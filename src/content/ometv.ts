import { memCache, messageStore, configStore } from '../storage';

const messages = memCache(messageStore);
const config = memCache(configStore);

enum Selector {
    StartButton = '[data-tr="start"]',
    StopButton = '[data-tr="stop"]',
    ChatInput = '#chat-text',
}

const elementRetriever =
    <T extends Element>(selector: string) =>
    () =>
        document.querySelector(selector) as T;

// todo: Necessary to retrieve every time?
// todo: Are there any cases where the element cannot be found?
const elements = {
    startButton: elementRetriever<HTMLSpanElement>(Selector.StartButton),
    stopButton: elementRetriever<HTMLSpanElement>(Selector.StopButton),
    chatInput: elementRetriever<HTMLInputElement>(Selector.ChatInput),
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const clickStart = () => {
    const start = elements.startButton();
    start.click();
};

const clickStop = () => {
    const stop = elements.stopButton();
    stop.click();
};

/**
 * Update the chat box value and send the message.
 */
const sendMessage = (value: string) => {
    const input = elements.chatInput();

    input.value = value;

    input.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: false,
        })
    );
};

async function main() {
    await messages.init();
    await config.init();

    // Begin sequence

    await wait(config.data!.startSequenceTimeoutSecs * 1_000);

    for (const message of messages.data!) {
    }

    // if ([messages.data, config.data].some((val) => val === null)) {
    //     return;
    // }
}

main();
