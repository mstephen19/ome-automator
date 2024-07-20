import { Box, Button, List, ListItem, ListItemText, TextField, styled } from '@mui/material';
import { useEffect, useState } from 'react';

const InputContainer = styled(Box)({
    width: '100%',
    display: 'flex',
    gap: '10px',
});

const enum StorageKey {
    MessageSequence = 'message_sequence',
}

// ? Is the escaping necessary?
const sanitize = (str: string) => escape(str.trim());

const Message = () => {};

const Messages = () => {
    const [messages, setMessages] = useState<string[]>([]);

    return (
        <List>
            {messages.map((message) => (
                <ListItem>
                    <ListItemText>{message}</ListItemText>
                </ListItem>
            ))}
        </List>
    );
};

export const MessageSequencer = () => {
    const [inputText, setInputText] = useState('');

    const [loading, setLoading] = useState(false);

    const handleAddMessage = async (content: string) => {
        const sanitized = sanitize(content);

        await chrome.storage.local.set({ [StorageKey.MessageSequence]: [...messages, sanitized] });
    };

    useEffect(() => {
        (async () => {
            const data = await chrome.storage.local.get(StorageKey.MessageSequence);
            setMessages(data[StorageKey.MessageSequence] || []);
        })();
    }, []);

    return (
        <>
            <TextField
                fullWidth
                multiline
                label='Message Content'
                placeholder='Hello, how are you?'
                onKeyDown={(e) => {
                    // Allow pressing Enter + Shift to create new lines.
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();

                        handleAddMessage(inputText);
                        setInputText('');

                        return;
                    }
                }}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                helperText='Press "Enter" to add your message to the sequence.'
            />

            <List>
                {messages.map((message) => (
                    <ListItem>
                        <ListItemText>{message}</ListItemText>
                    </ListItem>
                ))}
            </List>
        </>
    );
};
