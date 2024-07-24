import { Box } from '@mui/material';
import { ConfigNumberInput } from './ConfigNumberInput';

export const Settings = () => {
    return (
        <Box component='form' name='settings'>
            <ConfigNumberInput
                unit='sec(s)'
                variant='slider'
                configKey='messageTimeoutSecs'
                name='Time between messages'
                tip='Number of seconds to wait between each message sent.'
                min={1}
                max={30}
            />

            <ConfigNumberInput
                unit='sec(s)'
                variant='slider'
                configKey='startSequenceTimeoutSecs'
                name='Pre-sequence wait time'
                tip='Number of seconds to wait BEFORE the FIRST message is sent (per sequence).'
                min={0}
                max={30}
            />

            <ConfigNumberInput
                unit='sec(s)'
                variant='slider'
                configKey='endSequenceTimeoutSecs'
                name='Post-sequence wait time'
                tip='Number of seconds to wait AFTER the LAST message is sent (per sequence).'
                min={0}
                max={30}
            />

            <ConfigNumberInput
                unit='min(s)'
                variant='number'
                configKey='stopAfterTimeoutMins'
                name='Minutes to run for'
                tip={`Number of minutes to run for before auto-stopping. "0" means no limit. Max is 4 hours.`}
                min={0}
                max={240}
            />
        </Box>
    );
};
