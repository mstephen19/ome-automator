import { TextField } from '@mui/material';
import { useState, useContext, ChangeEventHandler } from 'react';
import { appDataStore, messageStore } from '../../../storage';
import { sanitize } from '../../../utils';

import { MessageSequenceContext } from '../../context/MessageSequenceProvider';
import { transforms } from '../../../transforms';
import { AppDataContext } from '../../context/AppDataProvider';
import { MAX_MESSAGE_SEQUENCE_LENGTH } from '../../../consts';

export const AddMessageBox = () => {
    const messages = useContext(MessageSequenceContext);
    const appData = useContext(AppDataContext);

    // Safe to initialize with async retrieved store value because the provider
    // doesn't render children until data is initialized.
    const [inputText, setInputText] = useState(appData.addMessageText);
    const [loading, setLoading] = useState(false);

    const [validationError, setValidationError] = useState('');
    const showError = Boolean(validationError);

    const handleMessageChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        setInputText(e.target.value);
        await appDataStore.write({ ...appData, addMessageText: e.target.value });
    };

    const handleAddMessage = async (unsanitized: string) => {
        setLoading(true);

        const id = crypto.randomUUID();
        const content = sanitize(unsanitized);

        // If tags are detected in the string (e.g. {spin}{/spin}), runs validation.
        if (!transforms.run(content).ok) {
            setValidationError(`Syntax error!`);
            setLoading(false);
            return;
        }

        // Add the message to the end of the list
        // Clear out the addMessageText
        await Promise.all([messageStore.write([...messages, { id, content }]), appDataStore.write({ ...appData, addMessageText: '' })]);
        setInputText('');

        setValidationError('');
        setLoading(false);
    };

    const reachedMax = messages.length >= MAX_MESSAGE_SEQUENCE_LENGTH;

    return (
        <TextField
            // ! This causes the text field to lose focus
            disabled={reachedMax}
            fullWidth
            multiline
            label='Message Content'
            placeholder='Hello, how are you?'
            onKeyDown={(e) => {
                if (!appData.addMessageText.trim()) return;

                // Allow pressing Enter + Shift to create new lines.
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();

                    if (!loading) handleAddMessage(appData.addMessageText);
                }
            }}
            value={inputText}
            // ? Store the latest text value in the data store - seamless through popup reloads
            onChange={handleMessageChange}
            helperText={
                showError
                    ? validationError
                    : reachedMax
                    ? 'Max number of messages added!'
                    : 'Press "Enter" to add your message to the sequence.'
            }
            error={showError}
        />
    );
};
