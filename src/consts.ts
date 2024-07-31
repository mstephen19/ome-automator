import { AddOns, AppData, Config, Message, TabData } from './types';

export const EXTENSION_MANIFEST = chrome.runtime.getManifest();

export const CHROME_WEBSTORE_LINK = 'https://chromewebstore.google.com/detail/kdakicmdgfidhnnfjgomlkoikigebpdf';

export const defaultAppData: AppData = {
    addMessageText: '',
    messageSequenceOpen: false,
    settingsOpen: false,
    addOnsOpen: false,
    helpOpen: false,
    theme: 'light',
    backdropMessageDismissedUnixMs: Date.now(),
    backdropConfirmation: null,
};

export const defaultConfig: Config = {
    messageTimeoutSecs: 1,
    startSequenceTimeoutSecs: 0,
    stopAfterTimeoutMins: 0,
    endSequenceTimeoutSecs: 0,
    autoSkipEnabled: true,
};

export const defaultMessageSequence: Message[] = [];

export const defaultTabData: TabData = {
    runningTab: null,
    startedUnixMs: null,
};

export const defaultAddOns: AddOns = {
    showLocationInfo: false,
    hideCamera: false,
    muteAudio: false,
    darkMode: false,
};

export const MAX_MESSAGE_SEQUENCE_LENGTH = 75;

export const enum CSSOverrideClass {
    DarkTheme = 'dark-theme',
}
