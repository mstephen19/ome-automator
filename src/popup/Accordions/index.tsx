import { MessageSequencer } from '../MessageSequencer';
import { Settings } from '../Settings';
import { ConfigProvider } from '../context/ConfigProvider';
import { useContext } from 'react';
import { MessageSequenceContext } from '../context/MessageSequenceProvider';

import { AccordionItem } from './AccordionItem';
import { Divider } from '@mui/material';

export const Accordions = () => {
    const messages = useContext(MessageSequenceContext);

    return (
        <>
            {/* Message Sequence */}
            <AccordionItem dataKey='messageSequenceOpen' title='Message Sequence' avatar={messages.length.toString()} maxHeight='300px'>
                <MessageSequencer />
            </AccordionItem>

            <Divider />

            {/* Configuration */}
            <AccordionItem dataKey='settingsOpen' title='Settings'>
                <ConfigProvider>
                    <Settings />
                </ConfigProvider>
            </AccordionItem>
        </>
    );
};
