import { Box, Slider, TextField, Tooltip, Typography } from '@mui/material';
import { ComponentProps, useContext } from 'react';
import { ConfigContext } from '../context/ConfigProvider';
import InfoIcon from '@mui/icons-material/Info';

import { Config } from '../../types';
import { configStore } from '../../storage';

const ConfigName = ({ name, tip, value }: { name: string; tip: string; value?: number }) => (
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Tooltip title={tip} arrow placement='top'>
            <InfoIcon sx={{ fontSize: '1rem', cursor: 'pointer' }} />
        </Tooltip>

        <Typography>
            {name}: {value}
        </Typography>
    </Box>
);

export const ConfigInput = ({
    variant,
    configKey,
    min,
    max,
    ...props
}: ComponentProps<typeof ConfigName> & { configKey: keyof Config; min: number; max: number; variant: 'slider' | 'manual' }) => {
    const config = useContext(ConfigContext);

    const handleChange = (value: number) => {
        configStore.write({ ...config, [configKey]: value });
    };

    return (
        <>
            <ConfigName {...props} value={config[configKey]} />

            {variant === 'slider' ? (
                <Slider
                    onChange={(_, value) => handleChange(value as number)}
                    aria-label={configKey.toLowerCase().replace(/\s/g, '-')}
                    valueLabelDisplay='auto'
                    marks
                    min={min}
                    max={max}
                    step={1}
                    defaultValue={config[configKey]}
                    value={config[configKey]}
                />
            ) : (
                <TextField
                    onChange={(e) => {
                        const value = +e.target.value;
                        handleChange(value < min ? min : value > max ? max : value);
                    }}
                    defaultValue={config[configKey]}
                    value={config[configKey]}
                    type='number'
                    variant='standard'
                    helperText={`Max: ${max}`}
                />
            )}
        </>
    );
};
