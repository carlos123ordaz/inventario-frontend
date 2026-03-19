import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
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
    NoteAltSharp,
    ExpandLess,
    ExpandMore,
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
        { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { title: 'Usuarios', icon: <PeopleIcon />, path: '/usuarios' },
        { title: 'Equipos', icon: <ComputerIcon />, path: '/equipos' },
        { title: 'Historial', icon: <HistoryIcon />, path: '/historial' },
        { title: 'Actas', icon: <NoteAltSharp />, path: '/actas' },
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
                        ? 'rgba(108, 92, 231, 0.15)'
                        : 'transparent',
                    borderLeft: isItemActive
                        ? '3px solid #6c5ce7'
                        : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    color: isItemActive ? '#a29bfe' : '#7c7c8a',
                    mb: 0.5,
                    borderRadius: 0,
                    margin: 0,
                    '&:hover': {
                        backgroundColor: 'rgba(108, 92, 231, 0.08)',
                        color: '#e2e2e8',
                    },
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: collapsed ? 0 : 40,
                        mr: collapsed ? 0 : 2,
                        justifyContent: 'center',
                        color: isItemActive ? '#a29bfe' : '#7c7c8a',
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
                            color: isItemActive ? '#a29bfe' : 'inherit',
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

                <Box sx={{ px: 2, pt: 2, borderTop: '1px solid rgba(108, 92, 231, 0.1)' }}>
                    {!collapsed ? (
                        <>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#7c7c8a',
                                    display: 'block',
                                    mb: 0.5,
                                    fontFamily: '"JetBrains Mono", monospace',
                                }}
                            >
                                v2.0.0
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#7c7c8a', display: 'block' }}>
                                © 2025 Inventario
                            </Typography>
                        </>
                    ) : (
                        <Tooltip title="v2.0.0" placement="right">
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#7c7c8a',
                                    fontFamily: '"JetBrains Mono", monospace',
                                }}
                            >
                                v2
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
                    backgroundColor: '#0f0f17',
                    color: '#e2e2e8',
                    borderRight: '1px solid rgba(108, 92, 231, 0.08)',
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