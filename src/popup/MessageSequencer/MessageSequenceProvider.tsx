import { IconButton, List, ListItem, ListItemProps, ListItemText, TextField, Tooltip, styled } from '@mui/material';
import React, { useEffect, useState, useContext, createContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { messageStore } from '../../storage';
import { sanitize } from '../../utils';

import type { Message } from '../../types';
import { MessageItem } from './MessageItem';
import { MessageList } from './MessageList';

export const MessageSequenceContext = createContext<Message[]>([]);

/**
 * Retrieves messages from `chrome.storage.sync` on initial mount, and
 * updates state when changes are detected.
 */
export const MessageSequenceProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // On initial render, populate messages
        const hydrateMessages = async () => {
            const messageData = await messageStore.read();

            if (messageData) setMessages(messageData);
        };

        hydrateMessages();

        // Detect storage-level changes and update component state
        const removeListener = messageStore.onChange((latestMessageData) => {
            setMessages(latestMessageData);
        });

        return removeListener;
    }, []);

    return <MessageSequenceContext.Provider value={messages}>{children}</MessageSequenceContext.Provider>;
};

const AddMessage = () => {
    const messages = useContext(MessageSequenceContext);

    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddMessage = async (unsanitized: string) => {
        setLoading(true);

        const id = crypto.randomUUID();
        const content = sanitize(unsanitized);

        // Add the message to the end
        await messageStore.write([...messages, { id, content }]);

        setLoading(false);
    };

    return (
        <TextField
            // ! This causes the text field to lose focus
            // disabled={loading}
            fullWidth
            multiline
            label='Message Content'
            placeholder='Hello, how are you?'
            onKeyDown={(e) => {
                // Allow pressing Enter + Shift to create new lines.
                if (!loading && e.key === 'Enter' && !e.shiftKey && inputText.trim()) {
                    e.preventDefault();

                    handleAddMessage(inputText);
                    setInputText('');

                    return;
                }
            }}
            value={inputText}
            // Sanitize as the user types
            onChange={(e) => setInputText(e.target.value)}
            helperText={'Press "Enter" to add your message to the sequence.'}
        />
    );
};
