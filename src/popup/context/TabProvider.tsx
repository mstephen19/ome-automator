import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { tabDataStore } from '../../storage';
import { TabData } from '../../types';
import { storeProvider } from './StoreProvider';

const defaultTabData: TabData = {
    runningTab: null,
    startedUnixMs: null,
};

export const TabDataContext = createContext(defaultTabData);

/**
 * Handles the storage of tab-related data.
 */
const TabDataProvider = storeProvider({
    store: tabDataStore,
    context: TabDataContext,
    defaultValue: defaultTabData,
    merge: (fromStore, defaultValue) => ({ ...defaultValue, ...fromStore }),
});

const TargetTabContext = createContext<chrome.tabs.Tab | null>(null);

/**
 * Handles updates to tabs, and initializes with the `runningTab`
 * when applicable.
 */
const TargetTabProvider = ({ children }: { children?: ReactNode }) => {
    const tabData = useContext(TabDataContext);

    const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);

    useEffect(() => {
        // todo: cleanup
        const init = async () => {
            console.log(tabData);

            // If there is a tab marked as running already, check it.
            if (tabData.runningTab !== null) {
                const tab = await chrome.tabs.get(tabData.runningTab);

                // Still exists and is on Ome.tv, it's still valid - pick up.
                if (tab && tab.url?.startsWith('https://ome.tv')) {
                    console.log('Found previous tab');
                    setTab(tab);
                    return;
                }

                // If the runningTab is no longer on Ome.tv, reset state.
                await tabDataStore.write(defaultTabData);
            }

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

    return <TargetTabContext.Provider value={tab}>{children}</TargetTabContext.Provider>;
};

export const TabContext = TargetTabContext;

export const TabProvider = ({ children }: { children?: ReactNode }) => (
    <TabDataProvider>
        <TargetTabProvider>{children}</TargetTabProvider>
    </TabDataProvider>
);
