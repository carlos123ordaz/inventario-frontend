import React, { useContext, useState } from 'react';
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
    Divider,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Brightness4,
    Brightness7,
    Logout,
} from '@mui/icons-material';
import { MainContext } from '../../context/MainContextProvider';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick, showMenuIcon = true }) => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { user, setUser, darkMode, toggleDarkMode } = useContext(MainContext);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
        handleCloseUserMenu();
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {showMenuIcon && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{
                            mr: 2,
                            '&:hover': {
                                backgroundColor: darkMode
                                    ? 'rgba(255,255,255,0.1)'
                                    : 'rgba(0,0,0,0.04)',
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 600,
                            letterSpacing: 0.5,
                        }}
                    >
                        Sistema de Inventario
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {/* Botón de modo oscuro/claro */}
                    <Tooltip title={darkMode ? "Modo claro" : "Modo oscuro"}>
                        <IconButton
                            onClick={toggleDarkMode}
                            color="inherit"
                            sx={{
                                '&:hover': {
                                    backgroundColor: darkMode
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'rgba(0,0,0,0.04)',
                                }
                            }}
                        >
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Tooltip>

                    {/* Avatar y menú de usuario */}
                    <Tooltip title="Mi cuenta">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    background: theme.palette.primary.main,
                                    fontWeight: 600,
                                }}
                            >
                                {user?.correo ? user.correo[0].toUpperCase() : <AccountCircle />}
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
                    PaperProps={{
                        sx: {
                            minWidth: 200,
                            mt: 1,
                            boxShadow: theme.shadows[8],
                        }
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {user?.correo || 'Usuario'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Administrador
                        </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <Logout sx={{ mr: 2, fontSize: 20 }} />
                        Cerrar Sesión
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;