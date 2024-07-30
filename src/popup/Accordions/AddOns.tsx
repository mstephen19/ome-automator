import { Box, FormControlLabel } from '@mui/material';
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
                />

                <FormControlLabel
                    control={<ConfigSwitch onChange={changeHandler('showLocationInfo')} checked={addOns.showLocationInfo} />}
                    label={addOns.showLocationInfo ? 'On' : 'Off'}
                />
            </Box>

            <Box display='flex' gap='10px'>
                <ConfigName name='Hide camera' tip="Don't send your camera's video stream to connections." />

                <FormControlLabel
                    control={<ConfigSwitch onChange={changeHandler('hideCamera')} checked={addOns.hideCamera} />}
                    label={addOns.hideCamera ? 'Hidden' : 'Off'}
                />
            </Box>

            <Box display='flex' gap='10px'>
                <ConfigName name='Mute microphone' tip="Don't send your microphone's audio stream to connections." />

                <FormControlLabel
                    control={<ConfigSwitch onChange={changeHandler('muteAudio')} checked={addOns.muteAudio} />}
                    label={addOns.muteAudio ? 'Muted' : 'Off'}
                />
            </Box>
        </Box>
    );
};
