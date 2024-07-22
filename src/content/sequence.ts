import { memCache, messageStore, configStore } from '../storage';
import { Config } from '../types';
import { pipeline, wait } from '../utils';
import { elements } from './elements';
import { status, Status, raceWithStatus, StatusError } from './status';

const messages = memCache(messageStore);
const config = memCache(configStore);

const clickStart = () => {
    const start = elements.startButton()!;
    start.click();
};

const clickStop = () => {
    const stop = elements.stopButton()!;
    stop.click();
};

/**
 * If {@link Status.Idle}, rapidly click the start button until the status changes
 * to something other than {@link Status.Idle}.
 */
const startSearch = async () => {
    console.log('startSearch()');
    // Only click start if not already Searching/Connected
    // If Searching -> Will be connected
    // If Connected -> Begin sequence in existing chat
    if (status.latest !== Status.Idle) return;

    // Wait for the status to be "Searching".
    // Using !== Status.Idle in the possible case of Idle -> Connected
    // todo: Timeout?
    const waitForNotIdle = new Promise((resolve) => {
        const cleanup = status.onChange((latest) => {
            if (latest !== Status.Idle) {
                resolve(undefined);
                cleanup();
            }
        });
    });

    // Ome.tv doesn't disable the "Start" button, even if it's not ready to use.
    // Rapidly click the "Start" button until no longer "idle".
    const interval = setInterval(() => {
        clickStart();
    }, 1_000);
    await waitForNotIdle;

    clearInterval(interval);
};

// todo: Timeout?
const waitForStatus = (predicate: (status: Status) => boolean) => () => {
    console.log('waitForStatus()');

    if (predicate(status.latest)) return;

    return new Promise((resolve) => {
        const cleanup = status.onChange((latest) => {
            if (!predicate(latest)) return;

            cleanup();
            resolve(undefined);
        });
    });
};

const assertConnected = () => {
    console.log('assertConnected()');

    if (status.latest !== Status.Connected) {
        console.log(status.latest);
        throw new StatusError();
    }
};

const sleep = (key: keyof Config, multiplier: number) => async () => {
    console.log('sleep()');
    await wait(config.data![key] * multiplier);
};

/**
 * Update the chat box value and send the message.
 */
const sendMessage = (value: string) => {
    console.log('sendMessage()');

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

// Handle status checks at the message level, so that the flow can be
// cancelled right in the middle of the sequence.
const messagePipeline = raceWithStatus(
    pipeline<string, void>(
        // todo: Spintax support
        sendMessage,
        sleep('messageTimeoutSecs', 1_000)
    ),
    // Throw StatusError if the chat disconnects at any time.
    (status) => status !== Status.Connected
);

const sendMessages = async () => {
    console.log('sendMessages()');

    for (const message of messages.data!) {
        await messagePipeline(message.content);
    }
};

/**
 * Runs the message sequence once. Throws {@link StatusError} if the
 * sequence must be restarted due to a status change (disconnected on).
 */
export const sequence = pipeline(
    // Click "Start" (if necessary). Spam it until "Searching".
    startSearch,
    // Wait for "Searching" to end.
    waitForStatus((status) => status !== Status.Searching),
    // Ensure connected to stranger.
    assertConnected,
    // Wait pre-sequence timeout.
    sleep('startSequenceTimeoutSecs', 1_000),
    // Ensure still connected.
    assertConnected,
    // Send all messages.
    sendMessages,
    // todo: Send a message back to the popup
    // todo: Completed sequences # count
    // Click "Next" (AKA "Start").
    clickStart
);
