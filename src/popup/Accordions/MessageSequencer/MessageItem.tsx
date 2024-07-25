import { IconButton, List, ListItem, ListItemProps, ListItemText, TextField, Tooltip, styled } from '@mui/material';
import React, { useEffect, useState, useContext, createContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { messageStore } from '../../../storage';
import { sanitize } from '../../../utils';
import { MessageSequenceContext } from '../../context/MessageSequenceProvider';

import type { Message } from '../../../types';
import { TabDataContext } from '../../context/TabProvider';

const MessageListItem = styled(ListItem)({
    display: 'flex',
    gap: '10px',
});

// todo: transform syntax validation
export const MessageItem = ({ message, ...props }: { message: Message } & ListItemProps) => {
    const { runningTab, startedUnixMs } = useContext(TabDataContext);
    const running = runningTab !== null && startedUnixMs !== null;

    const messages = useContext(MessageSequenceContext);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

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

        await messageStore.write(clone);

        setLoading(false);
    };

    return (
        <MessageListItem {...props}>
            <ListItemText
                primary={message.content}
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
                }}
            />

            <Tooltip title='Remove' arrow>
                <span>
                    <IconButton
                        // ? Disallow deleting the last message in the sequence realtime if
                        // ? it's the last one.
                        disabled={loading || (running && messages.length === 1)}
                        sx={{ alignSelf: 'start' }}
                        onClick={() => handleDelete()}>
                        <DeleteIcon />
                    </IconButton>
                </span>
            </Tooltip>
        </MessageListItem>
    );
};
