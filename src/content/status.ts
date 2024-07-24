import { raceWithEvent, TypedEventTarget } from '../utils';
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

    // todo: What if the element isn't found?
    observer.observe(elements.tip()!, {
        attributes: true,
        attributeFilter: ['data-tr'],
    });

    return {
        get latest() {
            return latest;
        },
        events,
    };
};

export const status = statusListener();

export const raceWithStatus = raceWithEvent(StatusError)(
    status.events,
    'change',
    () => new CustomEvent('change', { detail: status.latest })
);

// todo: Timeout?
export const waitForStatus = (predicate: (status: Status) => boolean) => () => {
    if (predicate(status.latest)) return;

    return new Promise((resolve) => {
        const changeListener = ({ detail: latest }: CustomEvent<Status>) => {
            if (!predicate(latest)) return;

            status.events.removeEventListener('change', changeListener);
            resolve(undefined);
        };

        status.events.addEventListener('change', changeListener);
    });
};
