import { AppData, Config, Message, TabData } from './types';

export const defaultAppData: AppData = {
    messageSequenceOpen: false,
    settingsOpen: false,
    theme: 'light',
};

export const defaultConfig: Config = {
    messageTimeoutSecs: 1,
    startSequenceTimeoutSecs: 0,
    stopAfterTimeoutMins: 0,
    endSequenceTimeoutSecs: 0,
};

export const defaultMessageSequence: Message[] = [];

export const defaultTabData: TabData = {
    runningTab: null,
    startedUnixMs: null,
};
