import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Brightness4,
    Brightness7,
} from '@mui/icons-material';

const Navbar = ({ onMenuClick, darkMode, onToggleDarkMode }) => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNotif, setAnchorElNotif] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseNotifications = () => {
        setAnchorElNotif(null);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: '#354A5F',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
                    <Box
                        component="img"
                        src="/logo.svg"
                        alt="Logo"
                        sx={{
                            height: 32,
                            mr: 2,
                            display: { xs: 'none', sm: 'block' }
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 600,
                            letterSpacing: 0.5,
                        }}
                    >
                        Inventario de Equipos
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={darkMode ? "Modo claro" : "Modo oscuro"}>
                        <IconButton color="inherit" onClick={onToggleDarkMode}>
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Mi cuenta">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: '#0070F2',
                                    width: 36,
                                    height: 36,
                                }}
                            >
                                <AccountCircle />
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Cerrar Sesión</Typography>
                    </MenuItem>
                </Menu>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-notifications"
                    anchorEl={anchorElNotif}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElNotif)}
                    onClose={handleCloseNotifications}
                >
                    <MenuItem onClick={handleCloseNotifications}>
                        <Typography variant="body2">
                            Nuevo equipo asignado a Juan Pérez
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNotifications}>
                        <Typography variant="body2">
                            Equipo Dell Latitude devuelto
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNotifications}>
                        <Typography variant="body2">
                            3 equipos próximos a mantenimiento
                        </Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};
export default Navbar;