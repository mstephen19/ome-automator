import { Box, Container, styled } from '@mui/material';
import { Controls } from './Controls';
import { MessageSequenceProvider } from './context/MessageSequenceProvider';
import { Accordions } from './Accordions';
import { AppDataProvider } from './context/AppDataProvider';
import { TabProvider } from './context/TabProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { TopBar } from './TopBar';

const AppWrapper = styled(Box)({
    height: '500px',
    width: '400px',
    overflowY: 'scroll',
    overflowX: 'hidden',
});

const AppContainer = styled(Container)({
    width: '100%',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    // gap: '10px',
});

const Popup = () => {
    return (
        <AppDataProvider>
            <ThemeProvider>
                <AppWrapper>
                    <TopBar />

                    <AppContainer>
                        <MessageSequenceProvider>
                            <TabProvider>
                                <Controls />

                                <Accordions />
                            </TabProvider>
                        </MessageSequenceProvider>
                    </AppContainer>
                </AppWrapper>
            </ThemeProvider>
        </AppDataProvider>
    );
};

export default Popup;
