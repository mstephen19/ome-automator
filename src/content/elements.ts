import { elementRetriever } from '../utils';

enum Selector {
    StartButton = 'div.start-button',
    StopButton = 'div.stop-button',
    ChatInput = '#chat-text',
    // Used for "Status" (data-tr property)
    Tip = 'div.message-bubble > span',
    // Shows up when camera is covered
    ShowFaceButton = '#overlay.visible #ShowFacePopup div.btn-main',
    LoginPopup = '#LoginPopup.visible',
    ErrorPopup = '#ErrorPopup.visible',
}

export const elements = {
    startButton: elementRetriever<HTMLDivElement>(Selector.StartButton),
    stopButton: elementRetriever<HTMLDivElement>(Selector.StopButton),
    chatInput: elementRetriever<HTMLInputElement>(Selector.ChatInput),
    tip: elementRetriever<HTMLSpanElement>(Selector.Tip),
    showFaceButton: elementRetriever<HTMLDivElement>(Selector.ShowFaceButton),
    loginPopup: elementRetriever<HTMLDivElement>(Selector.LoginPopup),
    errorPopup: elementRetriever<HTMLDivElement>(Selector.ErrorPopup),
};

/**
 * Populate & update the "Tip" element with labeled data.
 *
 * **Note:** Data will no longer display if status changes.
 */
const customTip = (name: string) => {
    const customTipId = 'ome_automator' + name.toLowerCase().replace(/\s/g, '_');

    return (value?: string) => {
        if (!value) return;

        const tip = elements.tip()!;

        const customTip = Object.assign(document.createElement('span'), { id: customTipId });
        customTip.style.display = 'flex';
        customTip.style.gap = '10px';
        customTip.style.marginTop;
        customTip.appendChild(document.createElement('br'));

        const title = document.createElement('b');
        title.textContent = `${name}:`;
        customTip.appendChild(title);

        const content = document.createElement('p');
        content.textContent = value;
        customTip.appendChild(content);

        const previous = tip.querySelector(`#${customTipId}`);

        if (previous) previous.replaceWith(customTip);
        else tip.appendChild(customTip);
    };
};

export namespace Tip {
    export const setIpAddress = customTip('IP Address');
    export const setUsingVpn = customTip('Using VPN');
    export const setCity = customTip('City');
    export const setZipCode = customTip('Zip Code');
    export const setRegion = customTip('Region');
    export const setCountryCode = customTip('Country Code');
    export const setCountryName = customTip('Country Name');
    export const setContinent = customTip('Continent');
    export const setNativeLanguage = customTip('Native Language');
}
