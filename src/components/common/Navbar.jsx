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
    Badge,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Brightness4,
    Brightness7,
    Settings,
    Logout,
    Person,
} from '@mui/icons-material';
import { MainContext } from '../../context/MainContextProvider';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick, darkMode, onToggleDarkMode, showMenuIcon = true }) => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNotif, setAnchorElNotif] = useState(null);
    const { user, setUser } = useContext(MainContext);
    const navigate = useNavigate();

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

    const handleProfile = () => {
        navigate('/perfil');
        handleCloseUserMenu();
    };

    const handleSettings = () => {
        navigate('/configuracion');
        handleCloseUserMenu();
    };


    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                color: darkMode ? '#fff' : 'text.primary',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                backdropFilter: 'blur(10px)',
                background: darkMode
                    ? 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%)'
                    : 'linear-gradient(90deg, #ffffff 0%, #f5f5f5 100%)',
            }}
        >
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
                                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
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
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Sistema de Inventario
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {/* Botón de modo oscuro/claro */}
                    <Tooltip title={darkMode ? "Modo claro" : "Modo oscuro"}>
                        <IconButton
                            onClick={onToggleDarkMode}
                            sx={{
                                color: darkMode ? '#fff' : 'text.primary',
                                '&:hover': {
                                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                                }
                            }}
                        >
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Tooltip>


                    {/* Avatar del usuario */}
                    <Tooltip title="Mi cuenta">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
                                }}
                            >
                                {user?.correo ? user.correo[0].toUpperCase() : <AccountCircle />}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Menú del usuario */}
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
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
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
                    {/* <MenuItem onClick={handleProfile}>
                        <Person sx={{ mr: 2, fontSize: 20 }} />
                        Mi Perfil
                    </MenuItem>
                    <MenuItem onClick={handleSettings}>
                        <Settings sx={{ mr: 2, fontSize: 20 }} />
                        Configuración
                    </MenuItem> */}
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