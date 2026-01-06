import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Toolbar,
    Typography,
    Tooltip,
    useTheme,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Computer as ComputerIcon,
    History as HistoryIcon,
    Assignment as AssignmentIcon,
    ExpandLess,
    ExpandMore,
    NoteAltSharp,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ open, onClose, variant = 'permanent', collapsed = false, drawerWidth = 280 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const [openSubmenu, setOpenSubmenu] = useState({});

    const handleSubmenuClick = (item) => {
        if (!collapsed) {
            setOpenSubmenu(prev => ({
                ...prev,
                [item]: !prev[item]
            }));
        }
    };

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/dashboard',
        },
        {
            title: 'Usuarios',
            icon: <PeopleIcon />,
            path: '/usuarios'
        },
        {
            title: 'Equipos',
            icon: <ComputerIcon />,
            path: '/equipos'
        },
        {
            title: 'Historial',
            icon: <HistoryIcon />,
            path: '/historial',
        },
        {
            title: 'Actas',
            icon: <NoteAltSharp />,
            path: '/actas',
        },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (variant === 'temporary') {
            onClose();
        }
    };

    const renderMenuItem = (item) => {
        const isItemActive = isActive(item.path);

        const button = (
            <ListItemButton
                onClick={() => item.submenu ? handleSubmenuClick(item.title) : handleNavigation(item.path)}
                sx={{
                    minHeight: 40,
                    px: 2,
                    justifyContent: collapsed ? 'center' : 'initial',
                    backgroundColor: isItemActive
                        ? 'rgba(91, 126, 255, 0.15)'
                        : 'transparent',
                    borderLeft: isItemActive
                        ? `3px solid ${theme.palette.primary.main}`
                        : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    color: isItemActive ? theme.palette.primary.main : '#A0AEC0',
                    mb: 0.5,
                    '&:hover': {
                        backgroundColor: 'rgba(91, 126, 255, 0.08)',
                        color: '#CBD5E0',
                    },
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: collapsed ? 0 : 40,
                        mr: collapsed ? 0 : 2,
                        justifyContent: 'center',
                        color: isItemActive ? theme.palette.primary.main : '#A0AEC0',
                        transition: 'color 0.2s ease',
                    }}
                >
                    {item.icon}
                </ListItemIcon>
                {!collapsed && (
                    <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: isItemActive ? 600 : 500,
                            color: isItemActive ? theme.palette.primary.main : 'inherit',
                        }}
                    />
                )}
                {!collapsed && item.submenu && (
                    openSubmenu[item.title] ? <ExpandLess /> : <ExpandMore />
                )}
            </ListItemButton>
        );

        if (collapsed) {
            return (
                <Tooltip title={item.title} placement="right" arrow>
                    {button}
                </Tooltip>
            );
        }

        return button;
    };

    const drawer = (
        <>
            <Toolbar />
            <Box
                sx={{
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    py: 2,
                }}
            >
                <List sx={{ flex: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.title} disablePadding>
                            {renderMenuItem(item)}
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ px: 2, pt: 2, borderTop: `1px solid rgba(255,255,255,0.1)` }}>
                    {!collapsed ? (
                        <>
                            <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 1 }}>
                                Versión 2.0.0
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#718096', display: 'block' }}>
                                © 2025 Inventario
                            </Typography>
                        </>
                    ) : (
                        <Tooltip title="Versión 2.0.0" placement="right">
                            <Typography variant="caption" sx={{ color: '#718096' }}>
                                v2.0
                            </Typography>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </>
    );

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={onClose}
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#2D3748',
                    color: '#FFFFFF',
                    borderRight: 'none',
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.standard,
                    }),
                    overflowX: 'hidden',
                },
            }}
        >
            {drawer}
        </Drawer>
    );
};

export default Sidebar;