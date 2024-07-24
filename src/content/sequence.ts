import { tabData, messages, config } from './cache';
import { commands } from './commands';
import { Command, Config } from '../types';
import { pipeline, pollPredicate, raceWithEvent, wait } from '../utils';
import { elements } from './elements';
import { status, Status, raceWithStatus, waitForStatus } from './status';
import { tabDataStore } from '../storage';
import { StatusError, TimeoutError, StoppedError } from './errors';

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
    // Only click start if not already Searching/Connected
    // If Searching -> Will be connected
    // If Connected -> Begin sequence in existing chat
    if (status.latest !== Status.Idle) return;

    // Wait for the status to be "Searching".
    // Using !== Status.Idle in the possible case of Idle -> Connected (which is OK)
    const statusWaiter = waitForStatus((status) => status !== Status.Idle);
    const waitForNotIdle = statusWaiter();

    // Ome.tv doesn't disable the "Start" button, even if it's not ready to use.
    // Rapidly click the "Start" button until no longer "idle".
    const interval = setInterval(() => {
        clickStart();
        // Every 250ms for a snappy response
    }, 250);
    await waitForNotIdle;

    clearInterval(interval);
};

const sleep = (key: keyof Config, multiplier: number) => async () => {
    await wait(config.data![key] * multiplier);
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

const messagePipeline = raceWithStatus(
    pipeline<string, void>(
        // todo: Spintax support
        sendMessage,
        sleep('messageTimeoutSecs', 1_000)
    ),
    ({ detail: status }) => status !== Status.Connected
);

const sendMessages = async () => {
    for (const message of messages.data!) {
        await messagePipeline(message.content);
    }
};

/**
 * Click stop & mark the tab as no longer running.
 */
export const resetToIdle = async () => {
    clickStop();

    await tabDataStore.write({ runningTab: null, startedUnixMs: null });
};

const raceWithStopped = raceWithEvent(StoppedError)(commands.events, Command.Stop);

/**
 * Check if stopAfterDurationMs has been crossed.
 */
const checkStopTime = async () => {
    const durationSinceStartedMs = tabData.data?.startedUnixMs ? Date.now() - tabData.data!.startedUnixMs : 0;
    const stopAfterDurationMs = config.data!.stopAfterTimeoutMins * 60_000;

    const stopAfterEnabled = stopAfterDurationMs !== 0;
    const mustStop = durationSinceStartedMs >= stopAfterDurationMs;

    if (stopAfterEnabled && mustStop) {
        await resetToIdle();
        throw new StoppedError();
    }
};

const bypassShowFaceMessage = async () => {
    const button = elements.showFaceButton();
    if (!button) return;

    const waitForButtonToDisappear = pollPredicate(250, () => !elements.showFaceButton());

    const interval = setInterval(() => {
        button?.click();
    }, 250);
    await waitForButtonToDisappear;
    clearInterval(interval);
};

/**
 * Runs the message sequence once. Throws {@link StatusError} if the
 * sequence must be restarted due to a status change (disconnected).
 */
const sequence = raceWithStopped(
    pipeline(
        bypassShowFaceMessage,
        // Click "Start" (if necessary). Spam it until "Searching".
        startSearch,
        // Wait for "Searching" to end.
        waitForStatus((status) => status !== Status.Searching),
        // Ensure connected to one stranger the whole time.
        // Wait pre-sequence timeout.
        raceWithStatus(sleep('startSequenceTimeoutSecs', 1_000), ({ detail: status }) => status !== Status.Connected),
        // Ensure connected to one stranger the whole time.
        // Send all messages.
        sendMessages,
        checkStopTime,
        // todo: Send a message back to the popup
        // todo: Completed sequences # count
        // Click "Next" (AKA "Start").
        clickStart
    )
);

export const sequenceLoop = async (): Promise<void> => {
    try {
        await sequence();
    } catch (err) {
        // Shutdown if stopped.
        if (err instanceof StoppedError) {
            console.log('Stopping.');
            return resetToIdle();
        }

        if (err instanceof TimeoutError) {
            console.log('Sequence timeout. Restarting.');
            return sequenceLoop();
        }

        if (err instanceof StatusError) {
            console.log('Disconnected detected. Restarting.');
            return sequenceLoop();
        }

        throw err;
    }

    return sequenceLoop();
};
