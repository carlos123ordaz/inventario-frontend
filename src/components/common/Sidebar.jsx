import React from 'react';
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
import { useState } from 'react';

const drawerWidth = 280;

const Sidebar = ({ open, onClose, variant = 'permanent' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = useState({});

    const handleSubmenuClick = (item) => {
        setOpenSubmenu(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
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

    const drawer = (
        <>
            <Toolbar />
            <Box sx={{ overflow: 'auto', mt: 1 }}>
                <List>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={item.title}>
                            {item.submenu ? (
                                <>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => handleSubmenuClick(item.title)}
                                            sx={{
                                                minHeight: 48,
                                                px: 2.5,
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
                                                    color: 'primary.main',
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.title}
                                                primaryTypographyProps={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: 500,
                                                }}
                                            />
                                            {openSubmenu[item.title] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                    </ListItem>
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
                                </>
                            ) : (
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleNavigation(item.path)}
                                        sx={{
                                            minHeight: 48,
                                            px: 2.5,
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
                                                minWidth: 0,
                                                mr: 2,
                                                justifyContent: 'center',
                                                color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.title}
                                            primaryTypographyProps={{
                                                fontSize: '0.95rem',
                                                fontWeight: isActive(item.path) ? 600 : 500,
                                                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </React.Fragment>
                    ))}
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Footer del sidebar */}
                <Box sx={{ p: 2, mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                        Versión 2.0.0
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                        © 2025 Inventario
                    </Typography>
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
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: 'background.paper',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                },
            }}
        >
            {drawer}
        </Drawer>
    );
};

export default Sidebar;