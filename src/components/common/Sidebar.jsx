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
    Collapse,
    Typography,
    Tooltip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Computer as ComputerIcon,
    History as HistoryIcon,
    Assignment as AssignmentIcon,
    BarChart as BarChartIcon,
    ExpandLess,
    ExpandMore,
    SwapHoriz,
    AssignmentReturn,
    NoteAltSharp,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ open, onClose, variant = 'permanent', collapsed = false, drawerWidth = 280 }) => {
    const navigate = useNavigate();
    const location = useLocation();
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
        const button = (
            <ListItemButton
                onClick={() => item.submenu ? handleSubmenuClick(item.title) : handleNavigation(item.path)}
                sx={{
                    minHeight: 48,
                    px: collapsed ? 1 : 2.5,
                    justifyContent: collapsed ? 'center' : 'initial',
                    backgroundColor: isActive(item.path)
                        ? 'rgba(0, 112, 242, 0.12)'
                        : 'transparent',
                    borderLeft: isActive(item.path)
                        ? '3px solid #0070F2'
                        : '3px solid transparent',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 112, 242, 0.08)',
                    },
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: collapsed ? 0 : 40,
                        mr: collapsed ? 0 : 2,
                        justifyContent: 'center',
                        color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                    }}
                >
                    {item.icon}
                </ListItemIcon>
                {!collapsed && (
                    <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                            fontSize: '0.95rem',
                            fontWeight: isActive(item.path) ? 600 : 500,
                            color: isActive(item.path) ? 'primary.main' : 'text.primary',
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
            <Box sx={{ overflow: 'auto', mt: 1 }}>
                {/* Logo y título */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        px: collapsed ? 1 : 2.5,
                        py: 2,
                        transition: 'all 0.3s',
                    }}
                >
                    <Box
                        component="img"
                        src="/logo.svg"
                        alt="Logo"
                        sx={{
                            height: collapsed ? 32 : 40,
                            width: collapsed ? 32 : 40,
                            mr: collapsed ? 0 : 2,
                            transition: 'all 0.3s',
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    {!collapsed && (
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                color: 'primary.main',
                            }}
                        >
                            Inventario
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ mb: 1 }} />

                <List>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={item.title}>
                            <ListItem disablePadding>
                                {renderMenuItem(item)}
                            </ListItem>
                            {item.submenu && !collapsed && (
                                <Collapse in={openSubmenu[item.title]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.submenu.map((subItem) => (
                                            <ListItem key={subItem.title} disablePadding>
                                                <ListItemButton
                                                    onClick={() => handleNavigation(subItem.path)}
                                                    sx={{
                                                        pl: 6,
                                                        minHeight: 40,
                                                        backgroundColor: isActive(subItem.path)
                                                            ? 'rgba(0, 112, 242, 0.12)'
                                                            : 'transparent',
                                                        borderLeft: isActive(subItem.path)
                                                            ? '3px solid #0070F2'
                                                            : '3px solid transparent',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 112, 242, 0.08)',
                                                        },
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            mr: 2,
                                                            justifyContent: 'center',
                                                            color: isActive(subItem.path) ? 'primary.main' : 'text.secondary',
                                                        }}
                                                    >
                                                        {subItem.icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={subItem.title}
                                                        primaryTypographyProps={{
                                                            fontSize: '0.875rem',
                                                            fontWeight: isActive(subItem.path) ? 600 : 400,
                                                            color: isActive(subItem.path) ? 'primary.main' : 'text.primary',
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Footer del sidebar */}
                <Box
                    sx={{
                        p: collapsed ? 1 : 2,
                        mt: 'auto',
                        textAlign: 'center',
                    }}
                >
                    {!collapsed ? (
                        <>
                            <Typography variant="caption" color="text.secondary" align="center" display="block">
                                Versión 2.0.0
                            </Typography>
                            <Typography variant="caption" color="text.secondary" align="center" display="block">
                                © 2025 Inventario
                            </Typography>
                        </>
                    ) : (
                        <Tooltip title="Versión 2.0.0" placement="right">
                            <Typography variant="caption" color="text.secondary">
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
                    backgroundColor: 'background.paper',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    transition: 'width 0.3s',
                    overflowX: 'hidden',
                },
            }}
        >
            {drawer}
        </Drawer>
    );
};

export default Sidebar;