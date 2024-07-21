import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Container, styled, Toolbar, Typography } from '@mui/material';
import { MessageSequencer } from './MessageSequencer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Controls } from './Controls';
import { MessageSequenceProvider } from './context/MessageSequenceProvider';
import { Settings } from './Settings';
import { ConfigProvider } from './context/ConfigProvider';

const AppWrapper = styled(Box)({
    height: '450px',
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
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography fontSize='1rem'>Ome Automator</Typography>
                </Toolbar>
            </AppBar>

            <AppContainer>
                <MessageSequenceProvider>
                    <Controls />

                    {/* Message Sequence */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Message Sequence</Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ maxHeight: '300px', overflowY: 'scroll' }}>
                            <MessageSequencer />
                        </AccordionDetails>
                    </Accordion>

                    {/* Configuration */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Settings</Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ overflowY: 'scroll' }}>
                            <ConfigProvider>
                                <Settings />
                            </ConfigProvider>
                        </AccordionDetails>
                    </Accordion>
                </MessageSequenceProvider>
            </AppContainer>
        </AppWrapper>
    );
};

export default App;
