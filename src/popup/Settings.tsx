import { Box, Slider, Tooltip, Typography } from '@mui/material';
import { ComponentProps, useContext } from 'react';
import { ConfigContext } from './context/ConfigProvider';
import InfoIcon from '@mui/icons-material/Info';

import { Config } from '../types';

const ConfigName = ({ name, tip, value }: { name: string; tip: string; value?: number }) => (
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Typography>
            {name}: {value}
        </Typography>

        <Tooltip title={tip} arrow placement='top'>
            <InfoIcon sx={{ fontSize: '1rem', cursor: 'pointer' }} />
        </Tooltip>
    </Box>
);

const ConfigSlider = ({
    configKey,
    min,
    max,
    ...props
}: ComponentProps<typeof ConfigName> & { configKey: keyof Config; min: number; max: number }) => {
    const value = useContext(ConfigContext);

    console.log('slider', value, configKey);

    return (
        <>
            <ConfigName {...props} value={value[configKey]} />

            <Slider
                aria-label='message-timeout-seconds'
                valueLabelDisplay='auto'
                marks
                min={min}
                max={max}
                step={1}
                defaultValue={value[configKey]}
                value={value[configKey]}
            />
        </>
    );
};

export const Settings = () => {
    return (
        <Box component='form' name='settings'>
            <ConfigSlider
                configKey='messageTimeoutSecs'
                name='Message timeout seconds'
                tip='The time between each message sent.'
                min={1}
                max={15}
            />

            <ConfigSlider
                configKey='messageTimeoutSecs'
                name='Pre-sequence timeout seconds'
                tip='The time before the first message is sent (per sequence).'
                min={0}
                max={15}
            />

            {/* todo */}
            {/* <ConfigName
                name='Time to run'
                tip='The number of minutes to run before automatically stopping. Set to 0 to run (theoretically) forever.'
            /> */}
        </Box>
    );
};
