import { IconButton, ListItem, ListItemProps, ListItemText, Tooltip, styled } from '@mui/material';
import { useState, useContext, useRef, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOffIcon from '@mui/icons-material/EditOff';
import { messageStore } from '../../../storage';
import { moveCursorToEnd, sanitize } from '../../../utils';
import { MessageSequenceContext } from '../../context/MessageSequenceProvider';

import type { Message } from '../../../types';
import { TabDataContext } from '../../context/TabProvider';
import { transforms } from '../../../transforms';

const MessageListItem = styled(ListItem)({
    display: 'flex',
    gap: '10px',
});

export const MessageItem = ({ message, ...props }: { message: Message } & ListItemProps) => {
    const { runningTab, startedUnixMs } = useContext(TabDataContext);
    const running = runningTab !== null && startedUnixMs !== null;

    const messages = useContext(MessageSequenceContext);
    const [editing, setEditing] = useState(false);
    const [validationError, setValidationError] = useState('');

    const [loading, setLoading] = useState(false);

    /**
     * Optionally pass a replacement {@link Message} to delete & replace.
     */
    const handleUpdate = async (updated?: string) => {
        if (updated && !transforms.run(updated).ok) {
            setValidationError('Syntax error!');
            return;
        }

        setValidationError('');
        setEditing(false);

        const index = messages.findIndex(({ id }) => id === message.id);
        if (index === -1) return;

        setLoading(true);

        const clone = [...messages];

        // Replace the current message item with the updated one
        if (updated) clone.splice(index, 1, { ...clone[index], content: sanitize(updated) });
        // Or remove the item entirely
        else clone.splice(index, 1);

        // Rewrite the entire message list
        await messageStore.write(clone);

        setLoading(false);
    };

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = contentRef.current?.querySelector('.MuiListItemText-primary');

        if (editing && target && document.activeElement !== target) {
            (target as HTMLParagraphElement).focus();
            moveCursorToEnd(target);
        }
    }, [editing]);

    return (
        <MessageListItem {...props} selected={editing}>
            <ListItemText
                primary={message.content}
                secondary={validationError}
                onKeyDown={(e) => {
                    const editedText = (e.target as HTMLParagraphElement).textContent || '';
                    if (!editing || !editedText.trim()) return;

                    // Enter + Shift for new lines
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();

                        handleUpdate(editedText);
                    }
                }}
                primaryTypographyProps={{
                    contentEditable: editing,
                }}
                secondaryTypographyProps={{
                    color: 'error',
                }}
                // Unable to double-click to edit during loading
                onDoubleClick={() => {
                    if (!loading) {
                        setEditing(true);
                    }
                }}
                ref={contentRef}
                sx={{
                    flex: 1,
                    wordWrap: 'break-word',
                    userSelect: 'none',
                    whiteSpace: 'pre-wrap',
                }}
            />

            <Tooltip title={editing ? 'Cancel' : 'Delete'} arrow>
                <span style={{ alignSelf: 'start' }}>
                    {editing ? (
                        <IconButton
                            onClick={() => {
                                setEditing(false);
                                setValidationError('');

                                const target = contentRef.current?.querySelector('.MuiListItemText-primary');
                                if (target) target.textContent = message.content;
                            }}>
                            <EditOffIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            // ? Disallow deleting the last message in the sequence realtime if
                            // ? it's the last one.
                            disabled={loading || (running && messages.length === 1)}
                            onClick={() => handleUpdate()}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </span>
            </Tooltip>
        </MessageListItem>
    );
};
