import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Box, CircularProgress, IconButton, Paper, styled, Tooltip, Typography } from '@mui/material';
import { MessageSequenceContext } from './context/MessageSequenceProvider';
import { useContext, useEffect, memo, useState } from 'react';
import { TabContext, TabDataContext } from './context/TabProvider';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Command } from '../types';
import { activateTab, sendTabCommand } from '../tabs';

const FlexContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const InfoContainer = styled(Paper)({ padding: '5px', borderWidth: '2px', display: 'flex', gap: '10px', alignItems: 'center' });

const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1_000);
    const hours = Math.floor(totalSeconds / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const Stopwatch = memo(({ started }: { started: number | null }) => {
    const [diff, setDiff] = useState<number>(started === null ? 0 : Date.now() - started);

    useEffect(() => {
        const interval = setInterval(() => setDiff(started === null ? 0 : Date.now() - started), 1_000);

        return () => clearInterval(interval);
    }, [started]);

    return (
        <>
            <Typography fontSize='1rem' fontStyle='italic'>
                Elapsed Time:
            </Typography>

            <Typography fontSize='1.75rem'>{formatDuration(diff)}</Typography>
        </>
    );
});

/**
 * Uses {@link MessageSequenceContext}
 */
export const Controls = () => {
    const { startedUnixMs } = useContext(TabDataContext);

    const { tab, markRunning } = useContext(TabContext);
    const messageCount = useContext(MessageSequenceContext).length;

    const tabFound = tab !== null;
    const messagesFound = messageCount > 0;
    const canStart = tabFound && messagesFound;

    const running = tabFound && startedUnixMs !== null;

    const Icon = running ? StopCircleIcon : PlayCircleFilledWhiteIcon;

    const info = !messagesFound
        ? 'Sequence must not be empty!'
        : !tabFound
        ? 'No Ome.tv tabs found in this window!'
        : running
        ? 'Running...'
        : 'Ready to go.';

    const handleStart = async () => {
        // Set "runningTab" in tabStore
        // todo: Send tabId from popup and mark running in content script?
        await markRunning();

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
                    <Tooltip title={running ? 'Stop' : 'Start'} arrow>
                        <span>
                            <IconButton disabled={!canStart} onClick={running ? handleStop : handleStart}>
                                {<Icon sx={{ fontSize: '5rem' }} />}
                            </IconButton>
                        </span>
                    </Tooltip>
                </FlexContainer>

                <FlexContainer sx={{ width: '50%', gap: '10px', flexDirection: 'column' }}>
                    <Stopwatch started={startedUnixMs} />
                </FlexContainer>
            </Box>
        </Box>
    );
};
