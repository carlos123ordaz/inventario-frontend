import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Alert,
    Container,
    CircularProgress,
    Divider,
    Link,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Computer,
} from '@mui/icons-material';
import { MainContext } from '../../context/MainContextProvider';
import { authService } from '../../api';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(MainContext);

    const [formData, setFormData] = useState({
        correo: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.correo || !formData.password) {
            setError('Por favor completa todos los campos');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData.correo, formData.password);
            const userData = {
                correo: formData.correo,
                isAuthenticated: true,
                ...response.user
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/dashboard');
        } catch (err) {
            console.error('Error de login:', err);
            setError(err.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated background shapes */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    top: '-50px',
                    right: '-50px',
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                        '0%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' },
                        '100%': { transform: 'translateY(0px)' },
                    }
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    bottom: '-100px',
                    left: '-50px',
                    animation: 'float 8s ease-in-out infinite',
                }}
            />

            <Container maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255, 255, 255, 0.98)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                            }}
                        >
                            <Computer sx={{ fontSize: 40, color: 'white' }} />
                        </Box>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 1,
                            }}
                        >
                            Inventario de Equipos
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Ingresa tus credenciales para continuar
                        </Typography>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3, borderRadius: 2 }}
                            onClose={() => setError('')}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="correo"
                            type="email"
                            label="Correo electrónico"
                            value={formData.correo}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoComplete="email"
                            autoFocus
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: 'action.active' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                    },
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoComplete="current-password"
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'action.active' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            disabled={loading}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                    },
                                },
                            }}
                        />

                        <Box sx={{ mt: 1, mb: 2, textAlign: 'right' }}>
                            <Link
                                href="#"
                                variant="body2"
                                sx={{
                                    color: '#667eea',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 2,
                                mb: 2,
                                py: 1.5,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b4199 100%)',
                                    boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
                                },
                                '&:disabled': {
                                    background: 'rgba(0, 0, 0, 0.12)',
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={26} color="inherit" />
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </Button>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                O
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                ¿No tienes una cuenta?{' '}
                                <Link
                                    href="#"
                                    sx={{
                                        color: '#667eea',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    Contacta al administrador
                                </Link>
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary" align="center" display="block">
                            © 2025 Inventario de Equipos - v2.0.0
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;