import { IconButton, ListItem, ListItemProps, ListItemText, Tooltip, styled } from '@mui/material';
import { useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOffIcon from '@mui/icons-material/EditOff';
import { messageStore } from '../../../storage';
import { moveCursorToEnd, sanitize } from '../../../utils';
import { MessageSequenceContext } from '../../context/MessageSequenceProvider';

import type { Message } from '../../../types';
import { TabDataContext } from '../../context/TabProvider';

const MessageListItem = styled(ListItem)({
    display: 'flex',
    gap: '10px',
});

export const MessageItem = ({ message, ...props }: { message: Message } & ListItemProps) => {
    const { runningTab, startedUnixMs } = useContext(TabDataContext);
    const running = runningTab !== null && startedUnixMs !== null;

    const messages = useContext(MessageSequenceContext);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    /**
     * Optionally pass a replacement {@link Message} to delete & replace.
     */
    const handleUpdate = async (updated?: Partial<Message>) => {
        const index = messages.findIndex(({ id }) => id === message.id);
        if (index === -1) return;

        setLoading(true);

        const clone = [...messages];

        // Replace the current message item with the updated one
        if (updated) clone.splice(index, 1, { ...clone[index], ...updated });
        // Or remove the item entirely
        else clone.splice(index, 1);

        // Rewrite the entire message list
        await messageStore.write(clone);

        setLoading(false);
    };

    return (
        <MessageListItem {...props} selected={editing}>
            <ListItemText
                primary={message.content}
                onKeyDown={(e) => {
                    const editedText = (e.target as HTMLSpanElement).textContent || '';
                    if (!editing || !editedText.trim()) return;

                    // Enter + Shift for new lines
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        setEditing(false);

                        handleUpdate({ content: sanitize(editedText) });
                    }
                }}
                contentEditable={editing}
                // Unable to double-click to edit during loading
                onDoubleClick={() => {
                    if (!loading) {
                        setEditing(true);
                    }
                }}
                ref={(elem: HTMLDivElement) => {
                    if (editing && elem && document.activeElement !== elem) {
                        elem.focus();
                        moveCursorToEnd(elem);
                    }
                }}
                sx={{
                    flex: 1,
                    wordWrap: 'break-word',
                    userSelect: 'none',
                    whiteSpace: 'pre-wrap',
                }}
            />

            <Tooltip title={editing ? 'Cancel' : 'Delete'} arrow>
                <span>
                    {editing ? (
                        <IconButton sx={{ alignSelf: 'start' }} onClick={() => setEditing(false)}>
                            <EditOffIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            // ? Disallow deleting the last message in the sequence realtime if
                            // ? it's the last one.
                            disabled={loading || (running && messages.length === 1)}
                            sx={{ alignSelf: 'start' }}
                            onClick={() => handleUpdate()}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </span>
            </Tooltip>
        </MessageListItem>
    );
};
