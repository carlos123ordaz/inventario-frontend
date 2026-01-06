import { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, Container, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { MainContext } from '../../context/MainContextProvider';

const NAVBAR_HEIGHT = 64;
const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 70;

const MainLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { setUser } = useContext(MainContext);
    const navigate = useNavigate();

    useEffect(() => {
        setSidebarOpen(!isMobile);
        if (isMobile) {
            setSidebarCollapsed(false);
        }
    }, [isMobile]);

    useEffect(() => {
        const data = localStorage.getItem('user');
        if (data) {
            setUser(JSON.parse(data));
        } else {
            navigate('/login');
        }
    }, [navigate, setUser]);

    const handleSidebarToggle = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    const handleSidebarClose = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const handleCollapseToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const drawerWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Sidebar
                open={sidebarOpen}
                onClose={handleSidebarClose}
                variant={isMobile ? 'temporary' : 'permanent'}
                collapsed={!isMobile && sidebarCollapsed}
                drawerWidth={drawerWidth}
            />

            {/* Botón flotante para expandir/colapsar sidebar en desktop */}
            {!isMobile && (
                <IconButton
                    onClick={handleCollapseToggle}
                    sx={{
                        position: 'fixed',
                        left: drawerWidth - 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: theme.zIndex.drawer + 1,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[2],
                        width: 36,
                        height: 36,
                        transition: theme.transitions.create(['left'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                            boxShadow: theme.shadows[4],
                        },
                    }}
                >
                    {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            )}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    width: '100%',
                    marginLeft: isMobile ? 0 : `${drawerWidth}px`,
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Navbar
                    onMenuClick={handleSidebarToggle}
                    showMenuIcon={isMobile}
                />

                <Box
                    sx={{
                        flexGrow: 1,
                        mt: `${NAVBAR_HEIGHT}px`,
                        backgroundColor: theme.palette.background.default,
                        minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
                    }}
                >
                    <Container
                        maxWidth={false}
                        sx={{
                            py: 3,
                            px: { xs: 2, sm: 3, md: 4 },
                            maxWidth: '1600px',
                            margin: '0 auto',
                        }}
                    >
                        <Outlet />
                    </Container>
                </Box>
            </Box>

            {/* Overlay para móvil cuando el sidebar está abierto */}
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