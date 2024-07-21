import { AddMessageButton } from './AddMessageButton';
import { MessageList } from './MessageList';
import { MessageSequenceProvider } from './MessageSequenceProvider';

export const MessageSequencer = () => {
    return (
        <MessageSequenceProvider>
            <AddMessageButton />

            <MessageList />
        </MessageSequenceProvider>
    );
};
