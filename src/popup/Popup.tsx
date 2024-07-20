import { Box, Container, styled } from '@mui/material';
import { MessageSequencer } from './MessageSequencer';

const AppWrapper = styled(Box)({
    height: '400px',
    width: '400px',
    overflowY: 'scroll',
});

const AppContainer = styled(Container)({
    width: '100%',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
});

const App = () => {
    return (
        <AppWrapper>
            <AppContainer>
                <MessageSequencer />
            </AppContainer>
        </AppWrapper>
    );
};

export default App;
