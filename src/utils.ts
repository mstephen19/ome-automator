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
        }, Promise.resolve(input) as Promise<Input>) as Promise<Result>;
}

export const elementRetriever =
    <T extends Element>(selector: string) =>
    () =>
        document.querySelector(selector) as T | undefined;

const getTabs = async () => {
    const tabs = await chrome.tabs.query({ url: 'https://ome.tv/*' });
};
