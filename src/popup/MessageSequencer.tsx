import { Box, Button, IconButton, List, ListItem, ListItemProps, ListItemText, TextField, Tooltip, styled } from '@mui/material';
import React, { useEffect, useState, useContext, createContext, useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

import { StorageKey } from '../storage';

type Message = {
    id: string;
    content: string;
};

const MessageSequenceContext = createContext<Message[]>([]);

/**
 * Retrieves messages from `chrome.storage.local` on initial mount, and
 * updates state when changes are detected.
 */
const MessageSequenceProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // On initial render, populate messages
        const hydrateMessages = async () => {
            const { [StorageKey.MessageSequence]: messageData } = await chrome.storage.local.get(StorageKey.MessageSequence);
            if (messageData) setMessages(messageData as Message[]);
        };

        hydrateMessages();

        // Detect storage-level changes and update component state
        const changeListener = ({ [StorageKey.MessageSequence]: latestMessageData }: { [key: string]: chrome.storage.StorageChange }) => {
            if (!latestMessageData) return;

            setMessages(latestMessageData.newValue);
        };

        chrome.storage.local.onChanged.addListener(changeListener);

        return () => {
            chrome.storage.local.onChanged.removeListener(changeListener);
        };
    }, []);

    return <MessageSequenceContext.Provider value={messages}>{children}</MessageSequenceContext.Provider>;
};

const sanitize = (str: string) => str.trim();

const MessageListItem = styled(ListItem)({
    display: 'flex',
    gap: '10px',
});

const MessageItem = ({ message, ...props }: { message: Message } & ListItemProps) => {
    const messages = useContext(MessageSequenceContext);
    const [loading, setLoading] = useState(false);

    const [editing, setEditing] = useState(false);

    /**
     * Optionally pass a replacement {@link Message} to delete & replace.
     */
    const handleDelete = async (updated?: Partial<Message>) => {
        const index = messages.findIndex(({ id }) => id === message.id);
        if (index === -1) return;

        setLoading(true);

        const clone = [...messages];

        if (updated) clone.splice(index, 1, { ...clone[index], ...updated });
        else clone.splice(index, 1);

        await chrome.storage.local.set({
            [StorageKey.MessageSequence]: clone,
        });

        setLoading(false);
    };

    return (
        <MessageListItem {...props}>
            <ListItemText
                onKeyDown={(e) => {
                    const editedText = (e.target as HTMLSpanElement).textContent || '';

                    if (editing && e.key === 'Enter' && !e.shiftKey && editedText.trim()) {
                        setEditing(false);

                        handleDelete({ content: sanitize(editedText) });
                    }
                }}
                contentEditable={editing}
                // Unable to double-click to edit during loading
                onDoubleClick={() => !loading && setEditing(true)}
                sx={{
                    flex: 1,
                    wordWrap: 'break-word',
                    userSelect: 'none',
                }}>
                {message.content}
            </ListItemText>

            <Tooltip title='Remove' arrow>
                <IconButton disabled={loading} sx={{ alignSelf: 'start' }} onClick={() => handleDelete()}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </MessageListItem>
    );
};

// Move message position
const Messages = () => {
    const messages = useContext(MessageSequenceContext);

    // todo: Drag-n-drop re-arrangement

    return (
        <List sx={{ width: '100%' }}>
            {messages.map((message, index) => (
                <MessageItem
                    key={`message-${message.id}`}
                    message={message}
                    // Display divider only for the final item
                    divider={index < messages.length - 1}
                />
            ))}

            {!messages.length && (
                <ListItem>
                    <ListItemText sx={{ textAlign: 'center' }}>Your message sequence is empty.</ListItemText>
                </ListItem>
            )}
        </List>
    );
};

const AddMessage = () => {
    const messages = useContext(MessageSequenceContext);

    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddMessage = async (unsanitized: string) => {
        setLoading(true);

        const id = crypto.randomUUID();
        const content = sanitize(unsanitized);

        await chrome.storage.local.set({
            [StorageKey.MessageSequence]: [...messages, { id, content }],
        });

        setLoading(false);
    };

    return (
        <TextField
            disabled={loading}
            fullWidth
            multiline
            label='Message Content'
            placeholder='Hello, how are you?'
            onKeyDown={(e) => {
                // Allow pressing Enter + Shift to create new lines.
                if (e.key === 'Enter' && !e.shiftKey && inputText.trim()) {
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

export const MessageSequencer = () => {
    return (
        <MessageSequenceProvider>
            <AddMessage />

            <Messages />
        </MessageSequenceProvider>
    );
};
