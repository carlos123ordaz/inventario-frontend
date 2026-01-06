import { createTheme } from '@mui/material/styles';

const baseTheme = {
    typography: {
        fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
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
        },
    },
    shape: {
        borderRadius: 4,
    },
};

export const createAppTheme = (darkMode) => {
    if (darkMode) {
        return createTheme({
            ...baseTheme,
            palette: {
                mode: 'dark',
                primary: {
                    main: '#5B7EFF',
                    light: '#7B9EFF',
                    dark: '#3B5EDD',
                },
                secondary: {
                    main: '#10B981',
                    light: '#34D399',
                    dark: '#059669',
                },
                background: {
                    default: '#0F1419',      // ← Dark background
                    paper: '#1a1f2e',        // ← Dark paper
                },
                surface: {
                    main: '#252d3d',
                    light: '#2f3849',
                },
                text: {
                    primary: '#FFFFFF',       // ← White text in dark mode
                    secondary: '#9CA3AF',     // ← Light gray for secondary
                },
                divider: 'rgba(255, 255, 255, 0.1)',
                success: {
                    main: '#10B981',
                    light: '#34D399',
                    dark: '#059669',
                },
                warning: {
                    main: '#F59E0B',
                    light: '#FBBF24',
                    dark: '#D97706',
                },
                error: {
                    main: '#EF4444',
                    light: '#F87171',
                    dark: '#DC2626',
                },
                info: {
                    main: '#3B82F6',
                    light: '#60A5FA',
                    dark: '#1D4ED8',
                },
            },
            components: {
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#1a1f2e',
                            color: '#FFFFFF',
                            boxShadow: 'none',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        },
                    },
                },
                MuiDrawer: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: '#2D3748',
                            color: '#FFFFFF',
                            borderRight: 'none',
                        },
                    },
                },
                MuiListItemButton: {
                    styleOverrides: {
                        root: {
                            color: '#CBD5E0',
                            borderRadius: 4,
                            margin: '0 8px',
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(91, 126, 255, 0.12)',
                                color: '#5B7EFF',
                                '& .MuiListItemIcon-root': {
                                    color: '#5B7EFF',
                                },
                            },
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            },
                        },
                    },
                },
                MuiListItemIcon: {
                    styleOverrides: {
                        root: {
                            color: '#A0AEC0',
                            minWidth: 40,
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#1a1f2e',
                            backgroundImage: 'none',
                        },
                    },
                },
                MuiTableHead: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#252d3d',
                        },
                    },
                },
                MuiTableCell: {
                    styleOverrides: {
                        head: {
                            backgroundColor: '#252d3d',
                            color: '#9CA3AF',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '12px 16px',
                            letterSpacing: '0.02em',
                        },
                        body: {
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '12px 16px',
                            color: '#FFFFFF',
                            fontSize: '0.875rem',
                        },
                    },
                },
                MuiTableRow: {
                    styleOverrides: {
                        root: {
                            '&:hover': {
                                backgroundColor: 'rgba(91, 126, 255, 0.08)',
                            },
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 22,
                            borderRadius: 4,
                        },
                        colorSuccess: {
                            backgroundColor: 'transparent',
                            color: '#10B981',
                            border: 'none',
                            fontWeight: 500,
                        },
                        colorWarning: {
                            backgroundColor: 'transparent',
                            color: '#F59E0B',
                            border: 'none',
                            fontWeight: 500,
                        },
                        colorError: {
                            backgroundColor: 'transparent',
                            color: '#EF4444',
                            border: 'none',
                            fontWeight: 500,
                        },
                        colorDefault: {
                            backgroundColor: 'transparent',
                            color: '#9CA3AF',
                            border: 'none',
                            fontWeight: 500,
                        },
                        colorInfo: {
                            backgroundColor: 'transparent',
                            color: '#3B82F6',
                            border: 'none',
                            fontWeight: 500,
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            borderRadius: 4,
                        },
                        containedPrimary: {
                            backgroundColor: '#5B7EFF',
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: '#4B68EE',
                            },
                        },
                        contained: {
                            boxShadow: 'none',
                        },
                    },
                },
                MuiIconButton: {
                    styleOverrides: {
                        root: {
                            color: '#9CA3AF',
                            '&:hover': {
                                backgroundColor: 'rgba(91, 126, 255, 0.1)',
                            },
                        },
                    },
                },
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#252d3d',
                                color: '#FFFFFF',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#5B7EFF',
                                },
                            },
                            '& .MuiOutlinedInput-input::placeholder': {
                                color: '#9CA3AF',
                                opacity: 1,
                            },
                        },
                    },
                },
                MuiMenu: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: '#1a1f2e',
                            backgroundImage: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: 'rgba(91, 126, 255, 0.1)',
                            },
                        },
                    },
                },
                MuiTypography: {
                    styleOverrides: {
                        root: {
                            color: '#FFFFFF',
                        },
                    },
                },
            },
        });
    } else {
        // LIGHT MODE
        return createTheme({
            ...baseTheme,
            palette: {
                mode: 'light',
                primary: {
                    main: '#5B7EFF',
                    light: '#7B9EFF',
                    dark: '#3B5EDD',
                },
                secondary: {
                    main: '#10B981',
                    light: '#34D399',
                    dark: '#059669',
                },
                background: {
                    default: '#F5F6FA',
                    paper: '#FFFFFF',
                },
                surface: {
                    main: '#F7FAFC',
                    light: '#F9FAFB',
                },
                text: {
                    primary: '#1A202C',
                    secondary: '#718096',
                },
                divider: '#E2E8F0',
                success: {
                    main: '#10B981',
                    light: '#34D399',
                    dark: '#059669',
                },
                warning: {
                    main: '#F59E0B',
                    light: '#FBBF24',
                    dark: '#D97706',
                },
                error: {
                    main: '#EF4444',
                    light: '#F87171',
                    dark: '#DC2626',
                },
                info: {
                    main: '#3B82F6',
                    light: '#60A5FA',
                    dark: '#1D4ED8',
                },
            },
            components: {
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#FFFFFF',
                            color: '#1A202C',
                            boxShadow: 'none',
                            borderBottom: '1px solid #E2E8F0',
                        },
                    },
                },
                MuiDrawer: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: '#2D3748',
                            color: '#FFFFFF',
                            borderRight: 'none',
                        },
                    },
                },
                MuiListItemButton: {
                    styleOverrides: {
                        root: {
                            color: '#CBD5E0',
                            borderRadius: 4,
                            margin: '0 8px',
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(91, 126, 255, 0.12)',
                                color: '#5B7EFF',
                                '& .MuiListItemIcon-root': {
                                    color: '#5B7EFF',
                                },
                            },
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            },
                        },
                    },
                },
                MuiListItemIcon: {
                    styleOverrides: {
                        root: {
                            color: '#A0AEC0',
                            minWidth: 40,
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#FFFFFF',
                            backgroundImage: 'none',
                        },
                    },
                },
                MuiTableHead: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#F7FAFC',
                        },
                    },
                },
                MuiTableCell: {
                    styleOverrides: {
                        head: {
                            backgroundColor: '#F7FAFC',
                            color: '#4A5568',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            borderBottom: '1px solid #E2E8F0',
                            padding: '12px 16px',
                            letterSpacing: '0.02em',
                        },
                        body: {
                            borderBottom: '1px solid #E2E8F0',
                            padding: '12px 16px',
                            color: '#1A202C',
                            fontSize: '0.875rem',
                        },
                    },
                },
                MuiTableRow: {
                    styleOverrides: {
                        root: {
                            '&:hover': {
                                backgroundColor: '#F9FAFB',
                            },
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 22,
                            borderRadius: 4,
                        },
                        colorSuccess: {
                            backgroundColor: 'transparent',
                            color: '#10B981',
                            border: 'none',
                            fontWeight: 500,
                        },
                        colorWarning: {
                            backgroundColor: 'transparent',
                            color: '#F59E0B',
                            border: 'none',
                            fontWeight: 500,
                        },
                        colorError: {
                            backgroundColor: 'transparent',
                            color: '#EF4444',
                            border: 'none',
                            fontWeight: 500,
                        },
                        colorDefault: {
                            backgroundColor: 'transparent',
                            color: '#718096',
                            border: 'none',
                            fontWeight: 500,
                        },
                        colorInfo: {
                            backgroundColor: 'transparent',
                            color: '#3B82F6',
                            border: 'none',
                            fontWeight: 500,
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            borderRadius: 4,
                        },
                        containedPrimary: {
                            backgroundColor: '#5B7EFF',
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: '#4B68EE',
                            },
                        },
                        contained: {
                            boxShadow: 'none',
                        },
                    },
                },
                MuiIconButton: {
                    styleOverrides: {
                        root: {
                            color: '#718096',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        },
                    },
                },
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FFFFFF',
                                color: '#1A202C',
                                '& fieldset': {
                                    borderColor: '#E2E8F0',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#CBD5E0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#5B7EFF',
                                },
                            },
                            '& .MuiOutlinedInput-input::placeholder': {
                                color: '#718096',
                                opacity: 1,
                            },
                        },
                    },
                },
                MuiMenu: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: '#FFFFFF',
                            backgroundImage: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        },
                    },
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            color: '#1A202C',
                            '&:hover': {
                                backgroundColor: '#F7FAFC',
                            },
                        },
                    },
                },
            },
        });
    }
};