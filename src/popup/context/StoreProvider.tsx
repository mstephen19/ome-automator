import { type ReactNode, useEffect, useState, type Context } from 'react';
import type { chromeStorage } from '../../storage';

/**
 * Creates a generic provider for use with a {@link chromeStorage} adapter.
 */
export function storeProvider<Data>({
    context,
    defaultValue,
    store,
}: {
    context: Context<Data>;
    defaultValue: Data;
    store: ReturnType<typeof chromeStorage<Data>>;
}) {
    return ({ children }: { children?: ReactNode }) => {
        const [data, setData] = useState<Data>(defaultValue);

        useEffect(() => {
            // On initial render, populate messages
            const hydrateConfig = async () => {
                const pulledData = await store.read();

                if (pulledData) setData(pulledData);
                else await store.write(defaultValue);
            };

            hydrateConfig();

            // Detect storage-level changes and update component state
            const removeListener = store.onChange((latestData) => {
                setData(latestData);
            });

            return removeListener;
        }, []);

        return <context.Provider value={data}>{children}</context.Provider>;
    };
}
