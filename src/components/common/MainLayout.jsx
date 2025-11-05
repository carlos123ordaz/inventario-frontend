import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, Container } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const NAVBAR_HEIGHT = 64;

const MainLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        setSidebarOpen(!isMobile);
    }, [isMobile]);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarClose = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const handleToggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Sidebar
                open={sidebarOpen}
                onClose={handleSidebarClose}
                variant={isMobile ? 'temporary' : 'permanent'}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    width: '100%',
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Navbar
                    onMenuClick={handleSidebarToggle}
                    darkMode={darkMode}
                    onToggleDarkMode={handleToggleDarkMode}
                />
                <Box
                    sx={{
                        flexGrow: 1,
                        mt: `${NAVBAR_HEIGHT}px`,
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    <Container
                        maxWidth={false}
                        sx={{
                            py: 3,
                            px: { xs: 2, sm: 3, md: 4 },
                            maxWidth: '1600px',
                        }}
                    >
                        <Outlet />
                    </Container>
                </Box>
            </Box>
            {isMobile && sidebarOpen && (
                <Box
                    onClick={handleSidebarClose}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: theme.zIndex.drawer - 1,
                    }}
                />
            )}
        </Box>
    );
};

export default MainLayout;