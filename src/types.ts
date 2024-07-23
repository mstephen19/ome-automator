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
     * Number of minutes to run for before stopping.
     */
    stopAfterTimeoutMins: number;
};

export type AppData = {
    messageSequenceOpen: boolean;
    settingsOpen: boolean;
    theme: 'light' | 'dark';
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
};
