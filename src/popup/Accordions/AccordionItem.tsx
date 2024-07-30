import { Accordion, AccordionDetails, AccordionSummary, Chip, ChipProps, styled, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ComponentProps, type ReactNode, useContext } from 'react';
import { AppDataContext } from '../context/AppDataProvider';
import { appDataStore } from '../../storage';

import type { AppData } from '../../types';

const AccordionTitle = styled(AccordionSummary)({
    '& .MuiAccordionSummary-content': {
        gap: '10px',
        alignItems: 'center',
    },
});

export const AccordionItem = ({
    dataKey,
    title,
    chip,
    chipColor,
    maxHeight,
    children,
}: {
    dataKey: Exclude<keyof AppData, 'theme' | 'addMessageText' | 'backdropMessageDismissedUnixMs' | 'backdropConfirmation'>;
    title: string;
    chip?: string;
    chipColor?: ChipProps['color'];
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

                {chip && <Chip color={chipColor} size='small' label={chip} />}
            </AccordionTitle>

            <AccordionDetails sx={{ maxHeight, overflowY: 'scroll' }}>{children}</AccordionDetails>
        </Accordion>
    );
};
