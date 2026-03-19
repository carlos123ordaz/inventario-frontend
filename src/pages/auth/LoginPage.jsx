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
                background: '#0a0a0f',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Glow orbs */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(108, 92, 231, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    top: '-100px',
                    right: '-100px',
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
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(0, 206, 201, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    bottom: '-80px',
                    left: '-80px',
                    animation: 'float 8s ease-in-out infinite',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(108, 92, 231, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    top: '50%',
                    left: '60%',
                    animation: 'float 10s ease-in-out infinite',
                }}
            />

            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        background: '#13131a',
                        border: '1px solid rgba(108, 92, 231, 0.12)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(108, 92, 231, 0.05)',
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
                                background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                boxShadow: '0 8px 32px rgba(108, 92, 231, 0.3)',
                            }}
                        >
                            <Computer sx={{ fontSize: 40, color: 'white' }} />
                        </Box>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 1,
                            }}
                        >
                            Inventario de Equipos
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#7c7c8a' }}>
                            Ingresa tus credenciales para continuar
                        </Typography>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 118, 117, 0.1)',
                                color: '#ff7675',
                                border: '1px solid rgba(255, 118, 117, 0.2)',
                                '& .MuiAlert-icon': { color: '#ff7675' },
                            }}
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
                                        <Email sx={{ color: '#7c7c8a' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#1a1a24',
                                    color: '#e2e2e8',
                                    '& fieldset': {
                                        borderColor: 'rgba(108, 92, 231, 0.15)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(108, 92, 231, 0.3)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#6c5ce7',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#7c7c8a',
                                    '&.Mui-focused': {
                                        color: '#a29bfe',
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
                                        <Lock sx={{ color: '#7c7c8a' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            disabled={loading}
                                            sx={{ color: '#7c7c8a' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#1a1a24',
                                    color: '#e2e2e8',
                                    '& fieldset': {
                                        borderColor: 'rgba(108, 92, 231, 0.15)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(108, 92, 231, 0.3)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#6c5ce7',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#7c7c8a',
                                    '&.Mui-focused': {
                                        color: '#a29bfe',
                                    },
                                },
                            }}
                        />

                        <Box sx={{ mt: 1, mb: 2, textAlign: 'right' }}>
                            <Link
                                href="#"
                                variant="body2"
                                sx={{
                                    color: '#a29bfe',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: '#6c5ce7',
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
                                background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                                boxShadow: '0 4px 20px rgba(108, 92, 231, 0.35)',
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: '#FFFFFF',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a4bd1 0%, #8b80f0 100%)',
                                    boxShadow: '0 6px 25px rgba(108, 92, 231, 0.5)',
                                },
                                '&:disabled': {
                                    background: 'rgba(108, 92, 231, 0.2)',
                                    color: '#7c7c8a',
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={26} color="inherit" />
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </Button>

                        <Divider sx={{ my: 3, borderColor: 'rgba(108, 92, 231, 0.1)' }}>
                            <Typography variant="body2" sx={{ color: '#7c7c8a' }}>
                                O
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#7c7c8a' }}>
                                ¿No tienes una cuenta?{' '}
                                <Link
                                    href="#"
                                    sx={{
                                        color: '#a29bfe',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline',
                                            color: '#6c5ce7',
                                        },
                                    }}
                                >
                                    Contacta al administrador
                                </Link>
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(108, 92, 231, 0.1)' }}>
                        <Typography
                            variant="caption"
                            align="center"
                            display="block"
                            sx={{
                                color: '#7c7c8a',
                                fontFamily: '"JetBrains Mono", monospace',
                            }}
                        >
                            © 2025 Inventario de Equipos — v2.0.0
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;