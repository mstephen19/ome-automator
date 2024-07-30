import { Box, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const ConfigName = ({ name, tip, value, unit }: { name: string; tip: string; value?: number | string; unit?: string }) => (
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Tooltip title={tip} arrow placement='top'>
            <InfoIcon sx={{ fontSize: '1rem', cursor: 'pointer' }} />
        </Tooltip>

        <Typography>{`${name}:${value !== undefined && value !== null ? ` ${value}` : ''}${
            unit !== undefined && unit !== null ? ` ${unit}` : ''
        }`}</Typography>
    </Box>
);
