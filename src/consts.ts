import { AddOns, AppData, Config, Message, TabData } from './types';

export const EXTENSION_MANIFEST = chrome.runtime.getManifest();

export const defaultAppData: AppData = {
    addMessageText: '',
    messageSequenceOpen: false,
    settingsOpen: false,
    addOnsOpen: false,
    helpOpen: false,
    theme: 'light',
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
};
