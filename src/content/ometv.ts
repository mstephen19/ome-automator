import { memCache, messageStore, configStore } from '../storage';

const messages = memCache(messageStore);
const config = memCache(configStore);

enum Selector {
    StartButton = 'div.start-button',
    StopButton = 'div.stop-button',
    ChatInput = '#chat-text',
    Tip = 'div.message-bubble > span',
}

const elementRetriever =
    <T extends Element>(selector: string) =>
    () =>
        document.querySelector(selector) as T | undefined;

// todo: Necessary to retrieve every time?
// todo: Are there any cases where the element cannot be found?
const elements = {
    startButton: elementRetriever<HTMLDivElement>(Selector.StartButton),
    stopButton: elementRetriever<HTMLDivElement>(Selector.StopButton),
    chatInput: elementRetriever<HTMLInputElement>(Selector.ChatInput),
    tip: elementRetriever<HTMLSpanElement>(Selector.Tip),
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitFor = async (predicate: () => boolean, ms = 1_000) => {
    if (predicate()) return;
    await wait(ms);
    return waitFor(predicate, ms);
};

const enum Status {
    Idle = 'idle',
    Searching = 'searching',
    Connected = 'connected',
}

const tipStatusMap: Record<string, Status> = {
    rules: Status.Idle,
    searching: Status.Searching,
    connection: Status.Connected,
};

// todo: Any possibility of this not being reliable? E.g. the tip doesn't show?
const status = (): Status => {
    const tip = elements.tip()?.dataset.tr;

    return tip ? tipStatusMap[tip] : Status.Idle;
};

const clickStart = () => {
    const start = elements.startButton()!;
    start.click();
};

const clickStop = () => {
    const stop = elements.stopButton()!;
    stop.click();
};

/**
 * Update the chat box value and send the message.
 */
const sendMessage = (value: string) => {
    const input = elements.chatInput()!;

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

const startSequence = async () => {
    // Only click start if not already Searching/Connected
    if (status() === Status.Idle) {
        console.log('Clicking start.');
        // Ome.tv doesn't disable the "Start" button, even if it's not ready to use.
        // Unsure when in the load phase the button becomes available - seems to
        // be a WS message.
        await waitFor(() => {
            clickStart();

            // Click start repeatedly until the start button is disabled.
            return status() !== Status.Idle;
        });

        console.log('Clicked start.');
    }

    console.log('Waiting for connection.');
    // Wait until searching is complete.
    await waitFor(() => status() !== Status.Searching);

    // todo: If not connected somehow, what to do?
    if (status() !== Status.Connected) {
        console.log('Not connected.');
        return startSequence();
    }
    console.log('Waited for connection.');

    // Wait pre-sequence timeout
    console.log('Waiting pre-sequence timeout.');
    await wait(config.data!.startSequenceTimeoutSecs * 1_000);
    if (status() !== Status.Connected) {
        console.log('Not connected.');
        return startSequence();
    }
    console.log('Waited pre-sequence timeout.');

    for (const message of messages.data!) {
        // todo: What if disconnected on?
        // Exit out immediately & restart sequence
        // todo: Spintax support
        console.log('Sending message.');
        sendMessage(message.content);

        // Wait message timeout
        console.log('Waiting message timeout.');
        await wait(config.data!.messageTimeoutSecs * 1_000);
        console.log('Waited message timeout.');

        if (status() !== Status.Connected) {
            console.log('Not connected.');
            return startSequence();
        }
    }

    console.log('Clicking next.');
    clickStart();

    return startSequence();
};

async function main() {
    await messages.init();
    await config.init();

    await startSequence();

    // if ([messages.data, config.data].some((val) => val === null)) {
    //     return;
    // }

    // Messages can be null if the popup has not been opened
    // Popup initializes configuration.
}

// main();
