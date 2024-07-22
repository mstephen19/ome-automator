import { createContext, useEffect, useState, type ReactNode } from 'react';

const TabContext = createContext<chrome.tabs.Tab | null>(null);

export const TabProvider = ({ children }: { children?: ReactNode }) => {
    const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);

    useEffect(() => {
        const init = async () => {
            const tabs = await chrome.tabs.query({ url: 'https://ome.tv/*', currentWindow: true });
            // If there are multiple matching tabs and one is active, use that one.
            // Otherwise, use the first one.
            const target = tabs.reduce((prev, curr) => (curr.active ? curr : prev), tabs[0]);

            setTab(target || null);
        };

        init();
    }, []);

    // todo: cleanup
    useEffect(() => {
        if (tab !== null) {
            const tabUpdatedListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
                if (tabId !== tab.id) return;

                if (changeInfo.url && !changeInfo.url.startsWith('https://ome.tv')) {
                    setTab(null);
                }
            };

            chrome.tabs.onUpdated.addListener(tabUpdatedListener);

            const tabRemovedListener = (tabId: number) => {
                if (tabId === tab.id) setTab(null);
            };

            chrome.tabs.onRemoved.addListener(tabRemovedListener);

            return () => {
                chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
                chrome.tabs.onRemoved.removeListener(tabRemovedListener);
            };
        }

        const tabUpdatedListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
            if (tabId !== tab.id) return;

            if (changeInfo.url && changeInfo.url.startsWith('https://ome.tv')) {
                setTab(tab);
            }
        };

        chrome.tabs.onUpdated.addListener(tabUpdatedListener);

        const tabCreatedListener = (tab: chrome.tabs.Tab) => {
            if (tab.url?.startsWith('https://ome.tv')) setTab(tab);
        };

        chrome.tabs.onCreated.addListener(tabCreatedListener);

        return () => {
            chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
            chrome.tabs.onCreated.removeListener(tabCreatedListener);
        };
    }, [tab]);

    return <TabContext.Provider value={tab}>{children}</TabContext.Provider>;
};
