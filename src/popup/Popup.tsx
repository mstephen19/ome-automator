import { Accordion, AccordionDetails, AccordionSummary, Box, Container, styled, Typography } from '@mui/material';
import { MessageSequencer } from './MessageSequencer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    gap: '10px',
});

const App = () => {
    return (
        <AppWrapper>
            <AppContainer>
                {/* Message Sequence */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Message Sequence</Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ maxHeight: '300px', overflowY: 'scroll' }}>
                        <MessageSequencer />
                    </AccordionDetails>
                </Accordion>
            </AppContainer>
        </AppWrapper>
    );
};

export default App;
