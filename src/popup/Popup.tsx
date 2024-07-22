import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Container, styled, Toolbar, Typography } from '@mui/material';
import { MessageSequencer } from './MessageSequencer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Controls } from './Controls';
import { MessageSequenceProvider } from './context/MessageSequenceProvider';
import { Accordions } from './Accordions';
import { AppDataProvider } from './context/AppDataProvider';
import { TabProvider } from './context/TabProvider';

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

const App = () => {
    return (
        <AppWrapper>
            {/* todo: Theme switching */}
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography fontSize='1rem'>Ome.tv Automator</Typography>
                </Toolbar>
            </AppBar>

            <AppContainer>
                {/* List of messages */}
                <MessageSequenceProvider>
                    <AppDataProvider>
                        <TabProvider>
                            <Controls />

                            <Accordions />
                        </TabProvider>
                    </AppDataProvider>
                </MessageSequenceProvider>
            </AppContainer>
        </AppWrapper>
    );
};

export default App;
