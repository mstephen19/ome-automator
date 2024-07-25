import { AddMessageButton } from './AddMessageButton';
import { MessageList } from './MessageList';
import { memo } from 'react';

export const MessageSequencer = memo(() => (
    <>
        <AddMessageButton />

        <MessageList />
    </>
));
