import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Box, IconButton, Paper, styled, Tooltip, Typography } from '@mui/material';
import { MessageSequenceContext } from '../context/MessageSequenceProvider';
import { useContext } from 'react';
import { TabContext, TabDataContext } from '../context/TabProvider';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Command } from '../../types';
import { activateTab, sendTabCommand } from '../../tabs';
import { StopWatch } from './StopWatch';

const FlexContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const InfoContainer = styled(Paper)({ padding: '5px', borderWidth: '2px', display: 'flex', gap: '10px', alignItems: 'center' });

/**
 * Uses {@link MessageSequenceContext}
 */
export const Controls = () => {
    const { runningTab, startedUnixMs } = useContext(TabDataContext);

    const tab = useContext(TabContext);
    const messageCount = useContext(MessageSequenceContext).length;

    const tabFound = tab !== null;
    const messagesFound = messageCount > 0;
    const canStart = tabFound && messagesFound;

    const running = tabFound && runningTab !== null && startedUnixMs !== null;

    const Icon = running ? StopCircleIcon : PlayCircleFilledWhiteIcon;

    const info = !messagesFound
        ? 'Sequence must not be empty!'
        : !tabFound
        ? 'No Ome.tv tabs found in this window!'
        : running
        ? 'Running...'
        : 'Ready to go.';

    const handleStart = async () => {
        await sendTabCommand(tab!, Command.Start);
        await activateTab(tab!);
    };

    const handleStop = async () => {
        await sendTabCommand(tab!, Command.Stop);
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <InfoContainer variant='outlined'>
                <LightbulbIcon color='primary' sx={{ fontSize: '20px' }} />

                <Typography>{info}</Typography>
            </InfoContainer>

            <Box sx={{ width: '100%', display: 'flex' }}>
                <FlexContainer sx={{ flex: 1 }}>
                    <Tooltip title={running ? 'Stop' : 'Start'} arrow placement='right'>
                        <span>
                            <IconButton disabled={!canStart} onClick={running ? handleStop : handleStart}>
                                {<Icon sx={{ fontSize: '5rem' }} />}
                            </IconButton>
                        </span>
                    </Tooltip>
                </FlexContainer>

                <FlexContainer sx={{ width: '50%', gap: '10px', flexDirection: 'column' }}>
                    <StopWatch started={startedUnixMs} />
                </FlexContainer>
            </Box>
        </Box>
    );
};
