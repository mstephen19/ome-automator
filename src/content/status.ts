import { pollPredicate, raceWithEvent, TypedEventTarget } from '../utils';
import { elements } from './elements';
import { StatusError, TimeoutError } from './errors';

export const enum Status {
    Idle = 'idle',
    Searching = 'searching',
    Connected = 'connected',
}

export const tipStatusMap: Record<string, Status> = {
    rules_agreement_default: Status.Idle,
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
    let initialized = false;
    let latest = getStatus();
    // Keep in-memory cache of latest status
    const events = new TypedEventTarget<{ change: CustomEvent<Status> }>();

    // Constantly listen on the element
    const observer = new MutationObserver(([mutation]) => {
        if (mutation.type !== 'attributes') return;

        const attr = (mutation.target as HTMLSpanElement).dataset.tr!;

        latest = tipStatusMap[attr] || Status.Idle;
        // Dispatch events on own event source
        // ? If the MutationObserver implementation is replaced, don't need to touch other parts of
        // ? the codebase
        events.dispatchEvent(new CustomEvent('change', { detail: latest }));
    });

    const init = async () => {
        if (initialized) return;
        initialized = true;

        // Wait for the "tip" element to be present
        await pollPredicate(500, () => Boolean(elements.tip()));

        // Start listening on the tip element
        observer.observe(elements.tip()!, {
            attributes: true,
            attributeFilter: ['data-tr'],
        });
    };

    return {
        init,
        get latest() {
            return latest;
        },
        events,
    };
};

export const status = statusListener();

/**
 * Run an operation & "cancel" it if the status changes.
 */
export const raceWithStatus = raceWithEvent(StatusError)(
    status.events,
    'change',
    () => new CustomEvent('change', { detail: status.latest })
);

export const waitForStatus =
    (predicate: (status: Status) => boolean, timeoutMs = 0) =>
    () => {
        const controller = new AbortController();

        if (predicate(status.latest)) return;

        let timeout: ReturnType<typeof setTimeout>;
        if (timeoutMs > 0) setTimeout(() => controller.abort(), timeoutMs);

        return new Promise((resolve, reject) => {
            // Once timeout is reached
            function abortListener() {
                reject(new TimeoutError());

                status.events.removeEventListener('change', changeListener);
                controller.signal.removeEventListener('abort', abortListener);
            }

            controller.signal.addEventListener('abort', abortListener);

            function changeListener({ detail: latest }: CustomEvent<Status>) {
                if (!predicate(latest)) return;

                clearTimeout(timeout);
                status.events.removeEventListener('change', changeListener);
                controller.signal.removeEventListener('abort', abortListener);
                resolve(undefined);
            }

            status.events.addEventListener('change', changeListener);
        });
    };
