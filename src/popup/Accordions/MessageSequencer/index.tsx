import { AddMessageBox } from './AddMessageBox';
import { MessageList } from './MessageList';
import { memo } from 'react';

export const MessageSequencer = memo(() => (
    <>
        <AddMessageBox />

        <MessageList />
    </>
));
