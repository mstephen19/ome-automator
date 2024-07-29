import { ComponentProps, useContext } from 'react';
import { ConfigContext } from '../../context/ConfigProvider';

import { configStore } from '../../../storage';
import { ConfigName } from '../ConfigName';
import { ConfigSwitch } from '../ConfigSwitch';
import { Box, FormControlLabel } from '@mui/material';

export const ConfigSwitchInput = ({
    configKey,
    ...props
}: ComponentProps<typeof ConfigName> & {
    configKey: 'autoSkipEnabled';
}) => {
    const config = useContext(ConfigContext);

    const handleChange = (_: any, value: boolean) => {
        configStore.write({ ...config, [configKey]: value });
    };

    return (
        <Box display='flex' gap='10px'>
            <ConfigName {...props} />

            <FormControlLabel
                control={<ConfigSwitch onChange={handleChange} checked={config[configKey]} />}
                label={config[configKey] ? 'On' : 'Off'}
            />
        </Box>
    );
};
