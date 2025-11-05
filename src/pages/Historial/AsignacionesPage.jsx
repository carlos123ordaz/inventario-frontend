import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Avatar,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import {
    Add as AddIcon,
    SwapHoriz as SwapHorizIcon,
    Assignment as AssignmentIcon,
    MoreVert as MoreVertIcon,
    Computer as ComputerIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    AssignmentReturn as AssignmentReturnIcon,
} from '@mui/icons-material';
import { historialService } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ROUTES } from '../../routes/routes.constants';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const AsignacionesPage = () => {
    const navigate = useNavigate();

    // Estados
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAsignacion, setSelectedAsignacion] = useState(null);
    const [devolverDialogOpen, setDevolverDialogOpen] = useState(false);
    const [observaciones, setObservaciones] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // Cargar asignaciones activas
    useEffect(() => {
        loadAsignaciones();
    }, []);

    const loadAsignaciones = async () => {
        try {
            setLoading(true);
            const response = await historialService.getActivos();
            setAsignaciones(response.data);
        } catch (error) {
            showNotification('Error al cargar asignaciones', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Abrir menú de opciones
    const handleMenuOpen = (event, asignacion) => {
        setAnchorEl(event.currentTarget);
        setSelectedAsignacion(asignacion);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Transferir equipo
    const handleTransferir = () => {
        navigate(ROUTES.ASIGNACIONES.TRANSFER(selectedAsignacion.equipo._id));
        handleMenuClose();
    };

    // Devolver equipo
    const handleDevolverClick = () => {
        setDevolverDialogOpen(true);
        handleMenuClose();
    };

    const handleDevolverConfirm = async () => {
        try {
            await historialService.devolver(selectedAsignacion._id, observaciones);
            showNotification('Equipo devuelto exitosamente', 'success');
            loadAsignaciones();
        } catch (error) {
            const message = error.response?.data?.message || 'Error al devolver equipo';
            showNotification(message, 'error');
        } finally {
            setDevolverDialogOpen(false);
            setObservaciones('');
            setSelectedAsignacion(null);
        }
    };

    // Mostrar notificación
    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const getTipoUsoColor = (tipoUso) => {
        switch (tipoUso) {
            case 'Asignación Permanente':
                return 'primary';
            case 'Préstamo Temporal':
                return 'warning';
            case 'Mantenimiento':
                return 'info';
            case 'Prueba':
                return 'secondary';
            default:
                return 'default';
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#354a5f' }}>
                        Asignaciones Activas
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(ROUTES.HISTORIAL.LIST)}
                            sx={{ textTransform: 'none' }}
                        >
                            Ver Historial Completo
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate(ROUTES.ASIGNACIONES.NEW)}
                            sx={{
                                backgroundColor: '#0070f3',
                                '&:hover': { backgroundColor: '#0051cc' },
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Nueva Asignación
                        </Button>
                    </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Equipos actualmente asignados a usuarios
                </Typography>
            </Box>

            {/* Estadísticas rápidas */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12 }} md={3}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            backgroundColor: '#f0f7ff',
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 600, color: '#0070f3', mb: 0.5 }}>
                            {asignaciones.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Asignaciones Activas
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Lista de Asignaciones */}
            {asignaciones.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                    }}
                >
                    <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No hay asignaciones activas
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Todos los equipos están disponibles
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(ROUTES.ASIGNACIONES.NEW)}
                        sx={{
                            backgroundColor: '#0070f3',
                            '&:hover': { backgroundColor: '#0051cc' },
                            textTransform: 'none',
                        }}
                    >
                        Crear Primera Asignación
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {asignaciones.map((asignacion) => (
                        <Grid size={{ xs: 12 }} sm={6} md={4} key={asignacion._id}>
                            <Card
                                elevation={0}
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                    {/* Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip
                                            label={asignacion.tipoUso}
                                            color={getTipoUsoColor(asignacion.tipoUso)}
                                            size="small"
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, asignacion)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Box>

                                    {/* Usuario */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                backgroundColor: '#0070f3',
                                                mr: 1.5,
                                            }}
                                        >
                                            {asignacion.usuario?.iniciales || 'U'}
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {asignacion.usuario?.nombreCompleto ||
                                                    `${asignacion.usuario?.nombre} ${asignacion.usuario?.apellido}`}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {asignacion.usuario?.cargo} - {asignacion.usuario?.area}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Equipo */}
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 1,
                                            mb: 2,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <ComputerIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {asignacion.equipo?.marca} {asignacion.equipo?.modelo}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            S/N: {asignacion.equipo?.serie}
                                        </Typography>
                                    </Box>

                                    {/* Fechas */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Asignado el {moment(asignacion.fechaAsignacion).format('DD/MM/YYYY')}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        Hace {moment(asignacion.fechaAsignacion).fromNow(true)} ({asignacion.tiempoUso} días)
                                    </Typography>

                                    {/* Observaciones */}
                                    {asignacion.observaciones && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                display: 'block',
                                                mt: 1,
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            "{asignacion.observaciones}"
                                        </Typography>
                                    )}
                                </CardContent>

                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        size="small"
                                        startIcon={<AssignmentReturnIcon />}
                                        onClick={() => {
                                            setSelectedAsignacion(asignacion);
                                            handleDevolverClick();
                                        }}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Devolver
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Menú de Opciones */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleTransferir}>
                    <SwapHorizIcon sx={{ mr: 1, fontSize: 20 }} />
                    Transferir a otro usuario
                </MenuItem>
                <MenuItem onClick={handleDevolverClick} sx={{ color: 'error.main' }}>
                    <AssignmentReturnIcon sx={{ mr: 1, fontSize: 20 }} />
                    Devolver Equipo
                </MenuItem>
            </Menu>

            {/* Diálogo de Devolución */}
            <Dialog
                open={devolverDialogOpen}
                onClose={() => setDevolverDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Devolver Equipo</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        ¿Estás seguro de devolver este equipo? Se finalizará la asignación actual.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Observaciones"
                        multiline
                        rows={3}
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Notas sobre la devolución (opcional)..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setDevolverDialogOpen(false);
                            setObservaciones('');
                        }}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDevolverConfirm}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: 'none' }}
                    >
                        Devolver
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notificaciones */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AsignacionesPage;