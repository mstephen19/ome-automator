import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Box, IconButton, styled, Tooltip, Typography } from '@mui/material';
import { MessageSequenceContext } from './context/MessageSequenceProvider';
import { useContext } from 'react';

const FlexContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export const Controls = () => {
    const messageCount = useContext(MessageSequenceContext).length;

    const active = false;

    const Icon = active ? StopCircleIcon : PlayCircleFilledWhiteIcon;

    return (
        <Box sx={{ width: '100%', display: 'flex' }}>
            <FlexContainer sx={{ flex: 1 }}>
                <Tooltip title={active ? 'Stop' : 'Start'} arrow>
                    <IconButton disabled={!messageCount}>{<Icon sx={{ fontSize: '5rem' }} />}</IconButton>
                </Tooltip>
            </FlexContainer>

            <FlexContainer sx={{ width: '50%', gap: '10px', flexDirection: 'column' }}>
                <Typography fontSize='1rem' fontStyle='italic'>
                    Elapsed Time:
                </Typography>

                <Typography fontSize='1.75rem'>00:00:00</Typography>
            </FlexContainer>
        </Box>
    );
};
