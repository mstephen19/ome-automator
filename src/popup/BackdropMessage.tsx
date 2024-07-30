import {
    Backdrop,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Link,
    List,
    ListItem,
    ListItemText,
    Rating,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AppDataContext } from './context/AppDataProvider';
import { appDataStore } from '../storage';
import { CHROME_WEBSTORE_LINK } from '../consts';

const openTab = (url: string) => () => window.open(url, '_blank');

const openWebStoreLink = openTab(CHROME_WEBSTORE_LINK);

// todo: genericize with JSON template
export const BackdropMessage = ({
    displayAfter,
    confirmationId,
}: {
    /**
     * Number of milliseconds to display the message again after dismissal.
     */
    displayAfter: number;
    /**
     * Specific ID for the current backdrop message
     */
    confirmationId: string;
}) => {
    const appData = useContext(AppDataContext);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const confirmed = appData.backdropConfirmation === confirmationId;
        if (confirmed) return;

        // Time since message was last displayed
        const delta = Date.now() - appData.backdropMessageDismissedUnixMs;

        // Display the message now if it's been displayAfter ms since last dismissal
        if (delta >= displayAfter) {
            setOpen(true);
            return;
        }

        // Otherwise, open once the rest of the time passes
        const remainingTime = displayAfter - delta;
        const timeout = setTimeout(() => setOpen(true), remainingTime);

        return () => clearTimeout(timeout);

        // Re-run any time any change
    }, [appData.backdropConfirmation, confirmationId, appData.backdropMessageDismissedUnixMs, displayAfter]);

    const handleDismiss = async () => {
        setOpen(false);
        await appDataStore.write({ ...appData, backdropMessageDismissedUnixMs: Date.now() });
    };

    const handleConfirm = async () => {
        setOpen(false);
        openWebStoreLink();
        await appDataStore.write({ ...appData, backdropConfirmation: confirmationId });
    };

    return (
        <Backdrop sx={{ zIndex: 999999, padding: '10px' }} open={open}>
            <Card>
                <CardHeader
                    title='Rate Ome.tv Automator?'
                    subheader='Your feedback is important.'
                    titleTypographyProps={{ fontSize: '20px' }}
                />

                <CardContent>
                    <Rating size='large' name='no-value' value={null} onClick={handleConfirm} />

                    <Typography>When you rate this extension on the Chrome Web Store, you:</Typography>

                    <List sx={{ listStyle: 'decimal', pl: 4 }}>
                        <ListItem sx={{ display: 'list-item' }}>
                            <ListItemText primary='Help improve your overall experience by providing the developer with direct feedback.' />
                        </ListItem>

                        <ListItem sx={{ display: 'list-item' }}>
                            <ListItemText primary='Share your experience with others, helping them discover Ome.tv Automator.' />
                        </ListItem>
                    </List>
                </CardContent>

                <CardActions sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button variant='contained' onClick={handleConfirm}>
                        Yes
                    </Button>

                    <Button variant='outlined' onClick={handleDismiss}>
                        Not now
                    </Button>
                </CardActions>
            </Card>
        </Backdrop>
    );
};
