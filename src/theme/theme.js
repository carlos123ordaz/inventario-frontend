import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    typography: {
        fontFamily: '"DM Sans", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 500,
            letterSpacing: '-0.02em',
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 500,
        },
        body2: {
            fontSize: '0.875rem',
        },
        caption: {
            fontSize: '0.75rem',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        },
    },
    shape: {
        borderRadius: 6,
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#6c5ce7',
            light: '#a29bfe',
            dark: '#5a4bd1',
        },
        secondary: {
            main: '#00cec9',
            light: '#55efc4',
            dark: '#00b894',
        },
        background: {
            default: '#0a0a0f',
            paper: '#13131a',
        },
        surface: {
            main: '#1a1a24',
            light: '#22222e',
        },
        text: {
            primary: '#e2e2e8',
            secondary: '#7c7c8a',
        },
        divider: 'rgba(108, 92, 231, 0.12)',
        success: {
            main: '#00cec9',
            light: '#55efc4',
            dark: '#00b894',
        },
        warning: {
            main: '#fdcb6e',
            light: '#ffeaa7',
            dark: '#e5b85c',
        },
        error: {
            main: '#ff7675',
            light: '#fab1a0',
            dark: '#d63031',
        },
        info: {
            main: '#74b9ff',
            light: '#a9d4ff',
            dark: '#0984e3',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#0a0a0f',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#13131a',
                    color: '#e2e2e8',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(108, 92, 231, 0.12)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#0f0f17',
                    color: '#e2e2e8',
                    borderRight: '1px solid rgba(108, 92, 231, 0.08)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    color: '#7c7c8a',
                    borderRadius: 6,
                    margin: '0 8px',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(108, 92, 231, 0.15)',
                        color: '#a29bfe',
                        '& .MuiListItemIcon-root': {
                            color: '#a29bfe',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(108, 92, 231, 0.08)',
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: '#7c7c8a',
                    minWidth: 40,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#13131a',
                    backgroundImage: 'none',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1a1a24',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#1a1a24',
                    color: '#7c7c8a',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid rgba(108, 92, 231, 0.12)',
                    padding: '12px 16px',
                },
                body: {
                    borderBottom: '1px solid rgba(108, 92, 231, 0.08)',
                    padding: '12px 16px',
                    color: '#e2e2e8',
                    fontSize: '0.875rem',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(108, 92, 231, 0.06)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    height: 22,
                    borderRadius: 4,
                },
                colorSuccess: {
                    backgroundColor: 'rgba(0, 206, 201, 0.1)',
                    color: '#00cec9',
                    border: '1px solid rgba(0, 206, 201, 0.2)',
                },
                colorWarning: {
                    backgroundColor: 'rgba(253, 203, 110, 0.1)',
                    color: '#fdcb6e',
                    border: '1px solid rgba(253, 203, 110, 0.2)',
                },
                colorError: {
                    backgroundColor: 'rgba(255, 118, 117, 0.1)',
                    color: '#ff7675',
                    border: '1px solid rgba(255, 118, 117, 0.2)',
                },
                colorDefault: {
                    backgroundColor: 'rgba(124, 124, 138, 0.1)',
                    color: '#7c7c8a',
                    border: '1px solid rgba(124, 124, 138, 0.2)',
                },
                colorInfo: {
                    backgroundColor: 'rgba(116, 185, 255, 0.1)',
                    color: '#74b9ff',
                    border: '1px solid rgba(116, 185, 255, 0.2)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    borderRadius: 6,
                },
                containedPrimary: {
                    backgroundColor: '#6c5ce7',
                    color: '#FFFFFF',
                    '&:hover': {
                        backgroundColor: '#5a4bd1',
                    },
                },
                contained: {
                    boxShadow: '0 2px 8px rgba(108, 92, 231, 0.25)',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(108, 92, 231, 0.35)',
                    },
                },
                outlinedPrimary: {
                    borderColor: 'rgba(108, 92, 231, 0.4)',
                    color: '#a29bfe',
                    '&:hover': {
                        borderColor: '#6c5ce7',
                        backgroundColor: 'rgba(108, 92, 231, 0.08)',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#7c7c8a',
                    '&:hover': {
                        backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#1a1a24',
                        color: '#e2e2e8',
                        '& fieldset': {
                            borderColor: 'rgba(108, 92, 231, 0.15)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(108, 92, 231, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6c5ce7',
                        },
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                        color: '#7c7c8a',
                        opacity: 1,
                    },
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#13131a',
                    backgroundImage: 'none',
                    border: '1px solid rgba(108, 92, 231, 0.12)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: '#e2e2e8',
                    '&:hover': {
                        backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#1a1a24',
                    color: '#e2e2e8',
                    border: '1px solid rgba(108, 92, 231, 0.15)',
                    fontSize: '0.75rem',
                },
                arrow: {
                    color: '#1a1a24',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(108, 92, 231, 0.1)',
                },
            },
        },
    },
});