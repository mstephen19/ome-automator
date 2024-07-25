export const sanitize = (str: string) => str.trim();

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)) as Promise<void>;

export function pipeline(...funcs: ((...args: any[]) => any | Promise<any>)[]): () => Promise<unknown>;
export function pipeline<Input>(...funcs: ((...args: any[]) => any | Promise<any>)[]): (input: Input) => Promise<unknown>;
export function pipeline<Input, Result>(...funcs: ((...args: any[]) => any | Promise<any>)[]): (input: Input) => Promise<Result>;
export function pipeline<Input = undefined, Result = unknown>(...funcs: ((...args: any[]) => any | Promise<any>)[]) {
    return (input?: Input) =>
        funcs.reduce(async (acc, curr) => {
            const prev = await acc;

            return curr(prev);
        }, Promise.resolve(input) as Promise<Result>) as Promise<Result>;
}

export const elementRetriever =
    <T extends Element>(selector: string) =>
    () =>
        document.querySelector(selector) as T | undefined;

export class TypedEventTarget<EventMap = Record<string, Event>> extends EventTarget {
    addEventListener<K extends keyof EventMap>(
        type: K,
        listener: (event: EventMap[K]) => void | Promise<void>,
        options?: AddEventListenerOptions | boolean
    ): void;
    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
    addEventListener(type: any, listener: any, options?: any): void {
        super.addEventListener(type, listener, options);
    }

    removeEventListener<K extends keyof EventMap>(
        type: K,
        callback: (event: EventMap[K]) => void | Promise<void>,
        options?: EventListenerOptions | boolean
    ): void;
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
    removeEventListener(type: any, callback: any, options?: any): void {
        super.removeEventListener(type, callback, options);
    }

    dispatchEvent(event: Event): boolean {
        return super.dispatchEvent(event);
    }
}

type LooseConstructor<T = Error> = new (...args: any[]) => T;

/**
 * Run an async operation wrapped in a Promise that rejects with `new Err()` if `predicate()` returns `true`
 * on any event data received on `target.addEventListener(eventName)` for the operation's duration.
 *
 * With no provided predicate, the default will always return true.
 *
 * The error will propagate naturally, as if it came from directly calling `operation()`.
 *
 * Optionally pass an `init()` function to check the `predicate()` before registering a listener.
 *
 * Note: Will not abort the async operation, will only reject its wrapper with an error.
 *
 * Use cases:
 * 1. Must listen for "Stop" button click events from the popup while running the sequence, and cancel the sequence
 * right when the stop button is clicked (with StoppedError).
 *
 * 2. Must immediately exit the message sequence if the status changes away from "connected", as to not continue sending
 * messages - status is probably "searching".
 */
export const raceWithEvent =
    /**
     * The type of error to throw if the predicate returns true on an event
     */


        <ErrType extends Error>(Err: LooseConstructor<ErrType>) =>
        /**
         * The event target, which event to listen to, and (optionally) how to initialize it.
         */
        <EventMap extends Record<string, Event>, EventName extends keyof EventMap>(
            target: TypedEventTarget<EventMap>,
            eventName: EventName,
            init?: () => EventMap[EventName] | null
        ) =>
        <Operation extends (...args: any[]) => any | Promise<any>>(
            operation: Operation,
            predicate: (event: EventMap[EventName]) => boolean | Promise<boolean> = () => true
        ) =>
        (...args: Parameters<Operation>) =>
            new Promise(async (resolve, reject) => {
                if (typeof init === 'function') {
                    const initEvent = init();

                    // If the predicate fails on the init event, immediately reject
                    // Don't call anything else
                    if (initEvent !== null && (await predicate(initEvent))) {
                        reject(new Err());
                        return;
                    }
                }

                // If the predicate fails (false) during the operation at all, reject.
                const listener = async (event: EventMap[EventName]) => {
                    if (await predicate(event)) {
                        // Cleanup
                        target.removeEventListener(eventName, listener);
                        reject(new Err());
                    }
                };

                target.addEventListener(eventName, listener);

                try {
                    // Not aborting, just rejecting the wrapper.
                    const result = await operation(...args);
                    // If already rejected, this will do nothing.
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    // Cleanup
                    target.removeEventListener(eventName, listener);
                }
            }) as Promise<Awaited<ReturnType<Operation>>>;

export const pollPredicate = async (ms: number, predicate: () => boolean): Promise<void> => {
    if (predicate()) return;
    await wait(ms);
    return pollPredicate(ms, predicate);
};
