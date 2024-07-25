import { Typography } from '@mui/material';
import { useEffect, memo, useState } from 'react';

const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1_000);
    const hours = Math.floor(totalSeconds / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const StopWatch = memo(({ started }: { started: number | null }) => {
    const [diff, setDiff] = useState<number>(started === null ? 0 : Date.now() - started);

    useEffect(() => {
        setDiff(started === null ? 0 : Date.now() - started), 1_000;

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
