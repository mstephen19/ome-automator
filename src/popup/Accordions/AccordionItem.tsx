import { Accordion, AccordionDetails, AccordionSummary, Avatar, styled, Typography } from '@mui/material';
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
    avatar,
    maxHeight,
    children,
}: {
    dataKey: keyof AppData;
    title: string;
    avatar?: string;
    maxHeight?: string;
    children: ReactNode;
}) => {
    const appData = useContext(AppDataContext);

    const handleExpand = (value: boolean) => {
        appDataStore.write({ ...appData, [dataKey]: value });
    };

    return (
        <Accordion
            disableGutters
            defaultExpanded={appData[dataKey]}
            expanded={appData[dataKey]}
            onChange={(_, expanded) => handleExpand(expanded)}>
            <AccordionTitle expandIcon={<ExpandMoreIcon />}>
                <Typography>{title}</Typography>

                {avatar && <AccordionTitleAvatar>{avatar}</AccordionTitleAvatar>}
            </AccordionTitle>

            <AccordionDetails sx={{ maxHeight, overflowY: 'scroll' }}>{children}</AccordionDetails>
        </Accordion>
    );
};
