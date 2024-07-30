import { TypedEventTarget } from '../utils';
import { PageCommand, PageCommandDataMap, PageEvent, PageEventDataMap } from './injected/types';

const pageEventList = Object.values(PageEvent);

const pageEventRouter = () => {
    const events = new TypedEventTarget<{
        [K in PageEvent]: CustomEvent<PageEventDataMap[K]>;
    }>();

    window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        if (!event.data || !pageEventList.includes(event.data.type)) return;

        events.dispatchEvent(new CustomEvent(event.data.type as PageEvent, { detail: event.data.data }));
    });

    const command = <Command extends PageCommand>(command: Command, data: PageCommandDataMap[Command]) =>
        window.postMessage({ type: command, data });

    return {
        events,
        command,
    };
};

export const page = pageEventRouter();
