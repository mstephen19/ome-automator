import { Box, TextField } from '@mui/material';
import { useState, useContext } from 'react';
import { messageStore } from '../../../storage';
import { sanitize } from '../../../utils';

import { MessageSequenceContext } from '../../context/MessageSequenceProvider';
import { stringHasTag, transforms, Token } from '../../../transforms';

export const AddMessageButton = () => {
    const messages = useContext(MessageSequenceContext);

    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const [validationError, setValidationError] = useState('');
    const showError = Boolean(validationError);

    const handleAddMessage = async (unsanitized: string) => {
        setLoading(true);

        const id = crypto.randomUUID();
        const content = sanitize(unsanitized);

        // If tags are detected in the string (e.g. {spin}{/spin}), runs validation.
        const { ok, byToken } = transforms.validateAllBlocks(content);
        if (!ok) {
            const tokensWithErrors = Object.entries(byToken).reduce<string[]>((acc, [token, tokenOk]) => {
                if (!tokenOk) acc.push(token);
                return acc;
            }, []);

            setValidationError(`Syntax error with the following token(s): ${tokensWithErrors.join(', ')}`);
            setLoading(false);

            return;
        }

        // Add the message to the end
        await messageStore.write([...messages, { id, content }]);

        setValidationError('');
        setInputText('');
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
                }
            }}
            value={inputText}
            // Sanitize as the user types
            onChange={(e) => setInputText(e.target.value)}
            helperText={showError ? validationError : 'Press "Enter" to add your message to the sequence.'}
            error={showError}
            // sx={{ position: 'sticky', top: 0 }}
        />
    );
};
