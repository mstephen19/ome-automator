import { List, ListItem, ListItemText } from '@mui/material';
import React, { useState, useContext } from 'react';
import { messageStore } from '../../../storage';
import { MessageItem } from './MessageItem';
import { MessageSequenceContext } from '../../context/MessageSequenceProvider';

/**
 * Shortcut for
 * @example
 * e.preventDefault();
 * e.stopPropagation();
 */
const preventEvent: React.EventHandler<any> = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

export const MessageList = () => {
    const messages = useContext(MessageSequenceContext);
    const [loading, setLoading] = useState(false);

    const handleRearrange = async (indexA: number, indexB: number) => {
        setLoading(true);

        const clone = [...messages];

        // Swap places
        [clone[indexA], clone[indexB]] = [clone[indexB], clone[indexA]];

        await messageStore.write(clone);

        setLoading(false);
    };

    return (
        <List sx={{ width: '100%' }}>
            {messages.map((message, index) => (
                <MessageItem
                    data-index={index}
                    onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', index.toString());
                    }}
                    onDragEnter={preventEvent}
                    onDragOver={preventEvent}
                    onDrop={(e) => {
                        preventEvent(e);

                        handleRearrange(+e.dataTransfer.getData('text/plain'), +e.currentTarget.dataset.index!);
                    }}
                    draggable={!loading && messages.length > 1}
                    key={`message-${message.id}`}
                    message={message}
                    // Display divider only for the final item
                    divider={index < messages.length - 1}
                />
            ))}

            {!messages.length && (
                <ListItem>
                    <ListItemText sx={{ textAlign: 'center' }} primary='Your message sequence is empty.' />
                </ListItem>
            )}
        </List>
    );
};
