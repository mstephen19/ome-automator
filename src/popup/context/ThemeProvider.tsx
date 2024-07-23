import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode, useContext } from 'react';
import { AppDataContext } from './AppDataProvider';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const theme = useContext(AppDataContext).theme;

    return (
        <MUIThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
            <CssBaseline />
            {children}
        </MUIThemeProvider>
    );
};
