import { elementRetriever } from '../utils';

enum Selector {
    StartButton = 'div.start-button',
    StopButton = 'div.stop-button',
    ChatInput = '#chat-text',
    // Used for "Status" (data-tr property)
    Tip = 'div.message-bubble > span',
}

// todo: Necessary to retrieve every time?
// todo: Are there any cases where the element cannot be found?
export const elements = {
    startButton: elementRetriever<HTMLDivElement>(Selector.StartButton),
    stopButton: elementRetriever<HTMLDivElement>(Selector.StopButton),
    chatInput: elementRetriever<HTMLInputElement>(Selector.ChatInput),
    tip: elementRetriever<HTMLSpanElement>(Selector.Tip),
};
