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
