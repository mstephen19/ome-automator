import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { tabDataStore } from '../../storage';
import { storeProvider } from './StoreProvider';
import { defaultTabData } from '../../consts';
import { TabData } from '../../types';
import { findRelevantTab, urlIsRelevant } from '../../tabs';

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
        const initializeTab = async () => {
            const relevantTab = await findRelevantTab(tabData);

            setTab((prev) => {
                // If the relevant tab is already set, don't change
                // the state value.
                if (prev?.id === relevantTab?.id) return prev;
                return relevantTab;
            });
        };

        initializeTab();
    }, [tabData]);

    // Each time "tab"'s object reference changes, add listeners:
    // Found a tab:
    //  Listen for the tab closing/exiting Ome.tv. React by reflecting the tab's change with setTab().
    // No tab:
    //  Listen for new Ome.tv tabs.
    useEffect(() => {
        const tabFound = tab !== null;

        if (tabFound) {
            // Listen for URL changes in the tab
            const tabUpdatedListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
                if (tabId === tab.id && changeInfo.url !== undefined && !urlIsRelevant(changeInfo.url)) {
                    setTab(null);
                }
            };
            chrome.tabs.onUpdated.addListener(tabUpdatedListener);

            // Listen for tab closing
            const tabRemovedListener = (tabId: number) => {
                if (tabId === tab.id) setTab(null);
            };
            chrome.tabs.onRemoved.addListener(tabRemovedListener);

            return () => {
                chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
                chrome.tabs.onRemoved.removeListener(tabRemovedListener);
            };
        }

        // Listen for url changes on other tabs that may be relevant ("https://ome.tv")
        const tabUpdatedListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
            if (tabId === tab.id && changeInfo.url && urlIsRelevant(changeInfo.url)) {
                setTab(tab);
            }
        };
        chrome.tabs.onUpdated.addListener(tabUpdatedListener);

        // Listen for new tabs created with the URL already set (e.g. external link with target="_blank")
        const tabCreatedListener = (tab: chrome.tabs.Tab) => {
            if (urlIsRelevant(tab.url)) setTab(tab);
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

/**
 * Provides the currently running tab, or an available Ome.tv tab to run in.
 */
export const TabProvider = ({ children }: { children?: ReactNode }) => (
    <TabDataProvider>
        <TargetTabProvider>{children}</TargetTabProvider>
    </TabDataProvider>
);
