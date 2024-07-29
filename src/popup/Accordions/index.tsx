import { MessageSequencer } from './MessageSequencer';
import { Settings } from './Settings';
import { ConfigProvider } from '../context/ConfigProvider';
import { useContext } from 'react';
import { MessageSequenceContext } from '../context/MessageSequenceProvider';

import { AccordionItem } from './AccordionItem';
import { Divider } from '@mui/material';
import { Help } from './Help';
import { EXTENSION_MANIFEST } from '../../consts';
import { AddOnsProvider } from '../context/AddOnsProvider';
import { AddOns } from './AddOns';

export const Accordions = () => {
    const messages = useContext(MessageSequenceContext);

    return (
        <>
            <AccordionItem
                dataKey='messageSequenceOpen'
                title='Message Sequence'
                chip={messages.length.toString()}
                chipColor={messages.length > 0 ? 'primary' : 'default'}
                maxHeight='375px'>
                <MessageSequencer />
            </AccordionItem>

            <Divider />

            <AccordionItem dataKey='settingsOpen' title='Settings' maxHeight='375px'>
                <ConfigProvider>
                    <Settings />
                </ConfigProvider>
            </AccordionItem>

            <Divider />

            <AccordionItem dataKey='addOnsOpen' title='Add-Ons' chip={'New!'} chipColor='primary' maxHeight='375px'>
                <AddOnsProvider>
                    <AddOns />
                </AddOnsProvider>
            </AccordionItem>

            <Divider />

            <AccordionItem dataKey='helpOpen' title='Help, Info & Terms' chip={`v${EXTENSION_MANIFEST.version}`} maxHeight='375px'>
                <Help />
            </AccordionItem>
        </>
    );
};
