import { addOnsStore, tabDataStore } from '../storage';
import { messages, tabData, config, addOns } from './cache';
import { commands } from './commands';
import { resetToIdle, sequenceLoop } from './sequence';
import { Command } from '../types';
import { status } from './status';
import { defaultAddOns, defaultConfig, defaultMessageSequence, defaultTabData } from '../consts';
import { elements, Tip } from './elements';
import { injectScripts } from './injected';
import { page } from './page';
import { PageCommand, PageEvent } from './injected/types';
import { getIPDetails, sanitizeIp } from '../utils';

async function main() {
    page.events.addEventListener(PageEvent.PeerChange, async (e) => {
        if (!addOns.latest?.showLocationInfo) return;
        const sanitizedAddress = sanitizeIp(e.detail.address);

        Tip.setIpAddress(sanitizedAddress);

        const details = await getIPDetails(sanitizedAddress);

        Tip.setUsingVpn(details.isProxy ? 'Yes' : 'No');
        Tip.setCity(details.cityName);
        Tip.setZipCode(details.zipCode);
        Tip.setRegion(details.regionName);
        Tip.setCountryCode(details.countryCode);
        Tip.setCountryName(details.countryName);
        Tip.setNativeLanguage(details.language);
        Tip.setContinent(details.continent);
    });

    await injectScripts();

    // Initialize data
    // After this call, these caches are never null - they are populated with default data.
    await messages.init(defaultMessageSequence);
    await config.init(defaultConfig);
    await tabData.init(defaultTabData);
    await addOns.init(defaultAddOns);

    page.command(PageCommand.SetAddOnConfig, addOns.latest!);
    addOnsStore.onChange((latest) => {
        console.log('Change');
        page.command(PageCommand.SetAddOnConfig, latest);
    });

    const startListener = async ({ detail: tabId }: CustomEvent<number>) => {
        // If the login popup is open or there's an error, do nothing, but still listen for "Start" button clicks.
        if (elements.loginPopup() || elements.errorPopup()) {
            commands.events.addEventListener(Command.Start, startListener, { once: true });
            return;
        }

        // Status is now needed, initialize it if not already.
        await status.init();

        // Updates the store to let the popup know the script is no longer running (unloading).
        window.addEventListener('beforeunload', resetToIdle);

        // Sets the running tab - Propagates to the UI
        await tabDataStore.write({
            runningTab: tabId,
            startedUnixMs: Date.now(),
        });

        try {
            await sequenceLoop();
        } catch (err) {
            // ! Handling errors fairly silently here.
            resetToIdle();

            return;
        } finally {
            // No longer needed until "start" is called again.
            window.removeEventListener('beforeunload', resetToIdle);
        }

        commands.events.addEventListener(Command.Start, startListener, { once: true });
    };

    // Wait for "Start" button to be clicked.
    commands.events.addEventListener(Command.Start, startListener, { once: true });
}

main();
