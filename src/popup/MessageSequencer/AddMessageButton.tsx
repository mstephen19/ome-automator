import { TextField } from '@mui/material';
import { useState, useContext } from 'react';
import { messageStore } from '../../storage';
import { sanitize } from '../../utils';

import { MessageSequenceContext } from './MessageSequenceProvider';

export const AddMessageButton = () => {
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
