import { Box } from '@mui/material';
import { ConfigInput } from './ConfigInput';

export const Settings = () => {
    return (
        <Box component='form' name='settings'>
            <ConfigInput
                variant='slider'
                configKey='messageTimeoutSecs'
                name='Message timeout seconds'
                tip='The time between each message sent.'
                min={1}
                max={15}
            />

            <ConfigInput
                variant='slider'
                configKey='startSequenceTimeoutSecs'
                name='Pre-sequence timeout seconds'
                tip='The time before the first message is sent (per sequence).'
                min={0}
                max={15}
            />

            <ConfigInput
                variant='manual'
                configKey='stopAfterTimeoutMins'
                name='Time to run'
                tip='The number of minutes to run before automatically stopping. Set to 0 to run (theoretically) forever.'
                min={0}
                max={120}
            />
        </Box>
    );
};
