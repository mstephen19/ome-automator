import { MessageSequencer } from './MessageSequencer';
import { Settings } from './Settings';
import { ConfigProvider } from '../context/ConfigProvider';
import { useContext } from 'react';
import { MessageSequenceContext } from '../context/MessageSequenceProvider';

import { AccordionItem } from './AccordionItem';
import { Divider } from '@mui/material';
import { Help } from './Help';

export const Accordions = () => {
    const messages = useContext(MessageSequenceContext);

    return (
        <>
            <AccordionItem dataKey='messageSequenceOpen' title='Message Sequence' avatar={messages.length.toString()} maxHeight='375px'>
                <MessageSequencer />
            </AccordionItem>

            <Divider />

            <AccordionItem dataKey='settingsOpen' title='Settings' maxHeight='375px'>
                <ConfigProvider>
                    <Settings />
                </ConfigProvider>
            </AccordionItem>

            <Divider />

            <AccordionItem dataKey='helpOpen' title='Help, Info & Terms' maxHeight='375px'>
                <Help />
            </AccordionItem>
        </>
    );
};
