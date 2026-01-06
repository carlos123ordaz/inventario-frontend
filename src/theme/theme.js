import { createTheme } from '@mui/material/styles';

const baseTheme = {
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 500,
            letterSpacing: '-0.02em',
        },
        h6: {
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                },
            },
        },
    },
};

export const createAppTheme = (darkMode) => {
    if (darkMode) {
        return createTheme({
            ...baseTheme,
            palette: {
                mode: 'dark',
                primary: {
                    main: '#64B5F6', // Azul claro para modo oscuro
                    light: '#90CAF9',
                    dark: '#1976D2',
                },
                secondary: {
                    main: '#BA68C8',
                    light: '#CE93D8',
                    dark: '#8E24AA',
                },
                background: {
                    default: '#121212',
                    paper: '#1E1E1E',
                },
                surface: {
                    main: '#2A2A2A',
                    light: '#3A3A3A',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#B0B0B0',
                },
                divider: 'rgba(255, 255, 255, 0.12)',
                success: {
                    main: '#66BB6A',
                    light: '#81C784',
                    dark: '#388E3C',
                },
                warning: {
                    main: '#FFA726',
                    light: '#FFB74D',
                    dark: '#F57C00',
                },
                error: {
                    main: '#EF5350',
                    light: '#E57373',
                    dark: '#D32F2F',
                },
                info: {
                    main: '#29B6F6',
                    light: '#4FC3F7',
                    dark: '#0288D1',
                },
            },
            components: {
                ...baseTheme.components,
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#1E1E1E',
                            backgroundImage: 'linear-gradient(90deg, #1E1E1E 0%, #2A2A2A 100%)',
                            color: '#FFFFFF',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(10px)',
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#1E1E1E',
                            backgroundImage: 'none',
                        },
                    },
                },
                MuiTableHead: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#2A2A2A',
                        },
                    },
                },
                MuiTableRow: {
                    styleOverrides: {
                        root: {
                            '&:hover': {
                                backgroundColor: 'rgba(100, 181, 246, 0.08)',
                            },
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            fontWeight: 500,
                        },
                    },
                },
                MuiMenu: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: '#2A2A2A',
                            backgroundImage: 'none',
                        },
                    },
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            '&:hover': {
                                backgroundColor: 'rgba(100, 181, 246, 0.08)',
                            },
                        },
                    },
                },
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#2A2A2A',
                                '&:hover': {
                                    backgroundColor: '#313131',
                                },
                            },
                        },
                    },
                },
            },
        });
    } else {
        return createTheme({
            ...baseTheme,
            palette: {
                mode: 'light',
                primary: {
                    main: '#1976D2',
                    light: '#42A5F5',
                    dark: '#1565C0',
                },
                secondary: {
                    main: '#9C27B0',
                    light: '#BA68C8',
                    dark: '#7B1FA2',
                },
                background: {
                    default: '#FAFAFA',
                    paper: '#FFFFFF',
                },
                surface: {
                    main: '#F5F5F5',
                    light: '#FAFAFA',
                },
                text: {
                    primary: '#32363A',
                    secondary: '#6A6D70',
                },
                divider: '#E5E5E5',
                success: {
                    main: '#4CAF50',
                    light: '#66BB6A',
                    dark: '#388E3C',
                },
                warning: {
                    main: '#FF9800',
                    light: '#FFA726',
                    dark: '#F57C00',
                },
                error: {
                    main: '#F44336',
                    light: '#EF5350',
                    dark: '#D32F2F',
                },
                info: {
                    main: '#2196F3',
                    light: '#64B5F6',
                    dark: '#1976D2',
                },
            },
            components: {
                ...baseTheme.components,
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundColor: '#FFFFFF',
                            backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #F5F5F5 100%)',
                            color: '#32363A',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                            backdropFilter: 'blur(10px)',
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
                            backgroundColor: '#FAFAFA',
                        },
                    },
                },
                MuiTableRow: {
                    styleOverrides: {
                        root: {
                            '&:hover': {
                                backgroundColor: '#F5F9FC',
                            },
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            fontWeight: 500,
                        },
                    },
                },
                MuiMenu: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: '#FFFFFF',
                            backgroundImage: 'none',
                        },
                    },
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            '&:hover': {
                                backgroundColor: '#F5F5F5',
                            },
                        },
                    },
                },
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#FFFFFF',
                                },
                            },
                        },
                    },
                },
            },
        });
    }
};