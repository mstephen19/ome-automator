import { elements } from './elements';

export class StatusError extends Error {}

export const enum Status {
    Idle = 'idle',
    Searching = 'searching',
    Connected = 'connected',
}

const tipStatusMap: Record<string, Status> = {
    rules: Status.Idle,
    searching: Status.Searching,
    connection: Status.Connected,
};

const getStatus = (): Status => {
    const tip = elements.tip()?.dataset.tr;

    return tip ? tipStatusMap[tip] : Status.Idle;
};

/**
 * Observes changes on the {@link elements.tip} element for real-time {@link Status} changes.
 *
 * Statuses are derived from the **data-tr** property, which changes on the {@link elements.tip}
 * element depending on the current state of the app:
 *
 * - **rules** => {@link Status.Idle}
 * - **searching** => {@link Status.Searching}
 * - **connection** => {@link Status.Connected}
 */
const statusListener = () => {
    // Keep in-memory cache of latest status
    let latest = getStatus();
    const events = new EventTarget();

    const observer = new MutationObserver(([mutation]) => {
        if (mutation.type !== 'attributes') return;

        const attr = (mutation.target as HTMLSpanElement).dataset.tr!;

        latest = tipStatusMap[attr] || Status.Idle;
        events.dispatchEvent(new CustomEvent('change', { detail: latest }));
    });

    // todo: What if the element isn't found?
    observer.observe(elements.tip()!, {
        attributes: true,
        attributeFilter: ['data-tr'],
    });

    const onChange = (handler: (status: Status) => void) => {
        const listener = (e: any) => {
            const { detail } = e as CustomEvent<Status>;
            handler(detail);
        };

        events.addEventListener('change', listener);

        return () => {
            events.removeEventListener('change', listener);
        };
    };

    return {
        get latest() {
            return latest;
        },
        onChange,
    };
};

export const status = statusListener();

/**
 * Ensure that `predicate` is never true on the status during the time
 * `operation()` takes to complete.
 *
 * E.g. Immediately stop sending messages if the stranger has disconnected,
 * causing the status to change to {@link Status.Searching}.
 */
export const raceWithStatus =
    <Func extends (...args: any[]) => any>(operation: Func, predicate: (status: Status) => boolean) =>
    (...args: Parameters<Func>) =>
        // ? async await inside a Promise constructor? Why?
        // Must have a real-time view of whether or not the user has been disconnected on
        // while sending a message & waiting the messageTimeoutSecs. Any time during that process,
        // if there has been a status change, the promise will reject with StatusError.
        // ? Reason for this tight of control
        // Previously, was checking the status after sending each message. However, there were
        // cases where 2 strangers would skip the bot within the span of 1 second, and it would
        // miss these status changes, only seeing "connected" and not the in-between switches
        // to "searching".
        new Promise(async (resolve, reject) => {
            if (predicate(status.latest)) return reject(new StatusError());

            // Register the listener on the status
            const cleanup = status.onChange((latest) => {
                if (predicate(latest)) {
                    reject(new StatusError());
                    cleanup();
                }
            });

            try {
                const result = await operation(...args);
                resolve(result);
            } catch (err) {
                reject(err);
            } finally {
                cleanup();
            }
        }) as Promise<Awaited<ReturnType<Func>>>;
