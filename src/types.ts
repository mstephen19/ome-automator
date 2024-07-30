export type Message = {
    id: string;
    content: string;
};

export type Config = {
    /**
     * Number of seconds to wait between messages.
     */
    messageTimeoutSecs: number;
    /**
     * Number of seconds to wait before starting a message sequence.
     */
    startSequenceTimeoutSecs: number;
    /**
     * Number of seconds to wait after sending the last message.
     */
    endSequenceTimeoutSecs: number;
    /**
     * Number of minutes to run for before stopping.
     */
    stopAfterTimeoutMins: number;
    /**
     * Whether or not to auto-skip connections, or wait for the status.
     */
    autoSkipEnabled: boolean;
};

export type AppData = {
    addMessageText: string;
    messageSequenceOpen: boolean;
    settingsOpen: boolean;
    addOnsOpen: boolean;
    helpOpen: boolean;
    theme: 'light' | 'dark';
    /**
     * The last time at which the alert popup was dismissed (e.g. "Rate Ome.tv Automator?").
     */
    backdropMessageDismissedUnixMs: number;
    /**
     * To be se with a string value relating to the current backdrop messages.
     *
     * Once confirmed, the backdrop message will not be displayed again.
     * If the backdrop message changes, the confirmation ID set here should change.
     */
    backdropConfirmation: string | null;
};

export type AddOns = {
    showLocationInfo: boolean;
    hideCamera: boolean;
    muteAudio: boolean;
};

export type TabData = {
    /**
     * Allows keeping track of in which tab the automator is currently running.
     *
     * If the popup is closed, then reopened, it should find the tab currently
     * using the extension.
     */
    runningTab: number | null;
    /**
     * If there is a running tab, this is the time the flow started.
     */
    startedUnixMs: number | null;
};

export const enum Command {
    Start = 'start',
    Stop = 'stop',
}

export type CommandMessage = {
    extensionId: string;
    command: Command;
    tabId: number;
};

export type IPDetails = {
    isProxy: boolean;
    ipVersion: number;
    cityName: string;
    zipCode: string;
    regionName: string;
    countryCode: string;
    countryName: string;
    language: string;
    continent: string;
};
