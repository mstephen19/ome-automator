import { AppBar, Toolbar, Typography } from '@mui/material';
import { AppDataContext } from '../context/AppDataProvider';
import { useContext } from 'react';
import { appDataStore } from '../../storage';
import { ThemeSwitch } from './ThemeSwitch';

export const TopBar = () => {
    const appData = useContext(AppDataContext);

    const handleThemeSwitch = (_: any, checked: boolean) => {
        appDataStore.write({
            ...appData,
            theme: checked ? 'dark' : 'light',
        });
    };

    return (
        <AppBar position='sticky'>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography fontSize='1rem'>Ome.tv Automator</Typography>

                <ThemeSwitch onChange={handleThemeSwitch} checked={appData.theme === 'dark'} />
            </Toolbar>
        </AppBar>
    );
};
