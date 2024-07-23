import { tabData, messages, config } from './cache';
import { commandReceiver } from '../tabs';
import { Config } from '../types';
import { pipeline, wait } from '../utils';
import { elements } from './elements';
import { status, Status, raceWithStatus, StatusError } from './status';
import { tabDataStore } from '../storage';

const clickStart = () => {
    console.log('Click Start');
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
        throw new StatusError();
    }
};

const sleep = (key: keyof Config, multiplier: number) => async () => {
    console.log('sleep()', key, config.data![key] * multiplier);
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
    for (const message of messages.data!) {
        await messagePipeline(message.content);
    }
};

// todo: Handle this more elegantly - need finer grained control to stop mid-flow
let stopped = false;

commandReceiver.onStop(() => {
    console.log('TOLD TO STOP');
    stopped = true;
});

export class StoppedError extends Error {}

const stopIfRequired = async () => {
    const durationSinceStartedMs = tabData.data?.startedUnixMs ? Date.now() - tabData.data!.startedUnixMs : 0;
    const stopAfterDurationMs = config.data!.stopAfterTimeoutMins * 60_000;

    if (stopped || (stopAfterDurationMs !== 0 && durationSinceStartedMs >= stopAfterDurationMs)) {
        console.log('Stopping');
        clickStop();

        await tabDataStore.write({ ...tabData.data!, startedUnixMs: null });
        throw new StoppedError();
    }
};

/**
 * Runs the message sequence once. Throws {@link StatusError} if the
 * sequence must be restarted due to a status change (disconnected on).
 */
export const sequence = pipeline(
    stopIfRequired,
    // Click "Start" (if necessary). Spam it until "Searching".
    startSearch,
    // Wait for "Searching" to end.
    waitForStatus((status) => status !== Status.Searching),
    // Ensure connected to stranger.
    assertConnected,
    // Wait pre-sequence timeout.
    raceWithStatus(sleep('startSequenceTimeoutSecs', 1_000), (status) => status !== Status.Connected),
    // Ensure still connected.
    assertConnected,
    // Send all messages.
    sendMessages,
    // todo: Send a message back to the popup
    // todo: Completed sequences # count
    // Click "Next" (AKA "Start").
    clickStart
);
