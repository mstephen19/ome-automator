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
