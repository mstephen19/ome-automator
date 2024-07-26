import { Box, TextField } from '@mui/material';
import { useState, useContext, useCallback } from 'react';
import { appDataStore, messageStore } from '../../../storage';
import { sanitize } from '../../../utils';

import { MessageSequenceContext } from '../../context/MessageSequenceProvider';
import { transforms } from '../../../transforms';
import { AppDataContext } from '../../context/AppDataProvider';

export const AddMessageBox = () => {
    const messages = useContext(MessageSequenceContext);
    const appData = useContext(AppDataContext);

    // const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const [validationError, setValidationError] = useState('');
    const showError = Boolean(validationError);

    const handleAddMessage = useCallback(async (unsanitized: string) => {
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

        // Add the message to the end of the list
        // Clear out the addMessageText
        await Promise.all([messageStore.write([...messages, { id, content }]), appDataStore.write({ ...appData, addMessageText: '' })]);

        setValidationError('');
        setLoading(false);
    }, []);

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
                if (!loading && e.key === 'Enter' && !e.shiftKey && appData.addMessageText.trim()) {
                    e.preventDefault();

                    handleAddMessage(appData.addMessageText);
                }
            }}
            value={appData.addMessageText}
            // ? Store the latest text value in the data store - seamless through popup reloads
            onChange={(e) => appDataStore.write({ ...appData, addMessageText: e.target.value })}
            helperText={showError ? validationError : 'Press "Enter" to add your message to the sequence.'}
            error={showError}
            // sx={{ position: 'sticky', top: 0 }}
        />
    );
};
