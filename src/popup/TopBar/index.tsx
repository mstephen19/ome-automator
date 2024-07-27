import { AppBar, Box, Link, Toolbar, Tooltip, Typography } from '@mui/material';
import { AppDataContext } from '../context/AppDataProvider';
import { useContext } from 'react';
import { appDataStore } from '../../storage';
import { ThemeSwitch } from './ThemeSwitch';

import logoGrey from '../../assets/logo-grey.png';
import logoWhite from '../../assets/logo-white.png';
import { EXTENSION_MANIFEST } from '../../consts';

const Logo = ({ theme }: { theme: 'dark' | 'light' }) => (
    <Link href='https://ome.tv/' target='_blank' rel='nofollower'>
        <img src={theme === 'dark' ? logoWhite : logoGrey} alt='Ome.tv Automator logo' style={{ width: '40px' }} />
    </Link>
);

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
                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Logo theme={appData.theme} />

                    <Tooltip arrow title={EXTENSION_MANIFEST.description}>
                        <Typography fontSize='1rem' sx={{ cursor: 'pointer' }}>
                            Ome.tv Automator
                        </Typography>
                    </Tooltip>
                </Box>

                <ThemeSwitch onChange={handleThemeSwitch} checked={appData.theme === 'dark'} />
            </Toolbar>
        </AppBar>
    );
};
