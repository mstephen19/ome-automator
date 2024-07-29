import { Box } from '@mui/material';
import { ConfigName } from './ConfigName';
import { useContext } from 'react';
import { AddOnsContext } from '../context/AddOnsProvider';
import { ConfigSwitch } from './ConfigSwitch';
import type { AddOns as AddOnsType } from '../../types';
import { addOnsStore } from '../../storage';

export const AddOns = () => {
    const addOns = useContext(AddOnsContext);

    const changeHandler = (key: keyof AddOnsType) => (_: any, checked: boolean) => addOnsStore.write({ ...addOns, [key]: checked });

    return (
        <Box component='form' name='settings'>
            <Box display='flex' gap='10px'>
                <ConfigName
                    name='Location Info'
                    tip='Display location info about connections. Uses extra bandwidth. May not display for all peers.'
                    value={addOns.showLocationInfo ? 'On' : 'Off'}
                />
                <ConfigSwitch onChange={changeHandler('showLocationInfo')} checked={addOns.showLocationInfo} />
            </Box>
        </Box>
    );
};
