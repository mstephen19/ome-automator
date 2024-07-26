import { Accordion, AccordionDetails, AccordionSummary, Avatar, Chip, Divider, styled, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { type ReactNode, useContext } from 'react';
import { AppDataContext } from '../context/AppDataProvider';
import { appDataStore } from '../../storage';

import type { AppData } from '../../types';

const AccordionTitle = styled(AccordionSummary)({
    '& .MuiAccordionSummary-content': {
        gap: '10px',
        alignItems: 'center',
    },
});

const AccordionTitleAvatar = styled(Avatar)({
    width: 20,
    height: 20,
    fontSize: '1rem',
});

export const AccordionItem = ({
    dataKey,
    title,
    chip,
    maxHeight,
    children,
}: {
    dataKey: Exclude<keyof AppData, 'theme' | 'addMessageText'>;
    title: string;
    chip?: string;
    maxHeight?: string;
    children: ReactNode;
}) => {
    const appData = useContext(AppDataContext);

    const handleExpand = (value: boolean) => {
        appDataStore.write({ ...appData, [dataKey]: value });
    };

    return (
        <Accordion disableGutters expanded={appData[dataKey]} onChange={(_, expanded) => handleExpand(expanded)}>
            <AccordionTitle expandIcon={<ExpandMoreIcon />}>
                <Typography>{title}</Typography>

                {chip && <Chip size='small' label={chip} />}
            </AccordionTitle>

            <AccordionDetails sx={{ maxHeight, overflowY: 'scroll' }}>{children}</AccordionDetails>
        </Accordion>
    );
};
