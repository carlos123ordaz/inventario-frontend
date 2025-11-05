import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    IconButton,
    Breadcrumbs,
    Link,
    Alert,
    Snackbar,
    TextField,
    MenuItem,
    Autocomplete,
    Card,
    CardContent,
    Avatar,
    Chip,
    Divider,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Computer as ComputerIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { historialService, equiposService, usuariosService } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROUTES } from '../../routes/routes.constants';

const AsignarPage = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Listas
    const [equiposDisponibles, setEquiposDisponibles] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    // Selecciones
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            equipoId: '',
            usuarioId: '',
            tipoUso: 'Asignación Permanente',
            observaciones: '',
            registradoPor: 'Sistema',
        },
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoadingData(true);
            const [equiposRes, usuariosRes] = await Promise.all([
                equiposService.getDisponibles(),
                usuariosService.filter({ estado: 'Activo' }),
            ]);
            setEquiposDisponibles(equiposRes.data);
            setUsuarios(usuariosRes.data);
        } catch (error) {
            showNotification('Error al cargar datos', 'error');
        } finally {
            setLoadingData(false);
        }
    };

    const onSubmit = async (data) => {
        if (!selectedEquipo || !selectedUsuario) {
            showNotification('Debe seleccionar un equipo y un usuario', 'error');
            return;
        }

        try {
            setLoading(true);
            await historialService.asignar({
                ...data,
                equipoId: selectedEquipo._id,
                usuarioId: selectedUsuario._id,
            });
            showNotification('Equipo asignado exitosamente', 'success');
            setTimeout(() => {
                navigate(ROUTES.ASIGNACIONES.LIST);
            }, 1500);
        } catch (error) {
            const message = error.response?.data?.message || 'Error al asignar equipo';
            showNotification(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    if (loadingData) {
        return <LoadingSpinner />;
    }

    return (
        <Box>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                    Dashboard
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(ROUTES.ASIGNACIONES.LIST)}
                >
                    Asignaciones
                </Link>
                <Typography color="text.primary">Nueva Asignación</Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <IconButton onClick={() => navigate(ROUTES.ASIGNACIONES.LIST)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#354a5f' }}>
                    Nueva Asignación
                </Typography>
            </Box>

            {/* Alertas */}
            {equiposDisponibles.length === 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    No hay equipos disponibles para asignar. Todos los equipos están en uso o en mantenimiento.
                </Alert>
            )}

            {usuarios.length === 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    No hay usuarios activos disponibles.
                </Alert>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    {/* Selección de Equipo */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ComputerIcon sx={{ mr: 1, color: '#0070f3' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Seleccionar Equipo
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Autocomplete
                                options={equiposDisponibles}
                                getOptionLabel={(option) =>
                                    `${option.marca} ${option.modelo} (${option.serie})`
                                }
                                value={selectedEquipo}
                                onChange={(event, newValue) => {
                                    setSelectedEquipo(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Buscar equipo"
                                        placeholder="Escribe marca, modelo o serie..."
                                        required
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <Box sx={{ width: '100%' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {option.marca} {option.modelo}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                S/N: {option.serie} | {option.equipo}
                                            </Typography>
                                        </Box>
                                    </li>
                                )}
                            />

                            {/* Vista previa del equipo seleccionado */}
                            {selectedEquipo && (
                                <Card
                                    elevation={0}
                                    sx={{ mt: 2, backgroundColor: '#f0f7ff', border: '1px solid #0070f3' }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Equipo Seleccionado:
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>{selectedEquipo.marca}</strong> {selectedEquipo.modelo}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Serie: {selectedEquipo.serie}
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedEquipo.procesador} | {selectedEquipo.memoria} | {selectedEquipo.almacenamiento}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                        </Paper>
                    </Grid>

                    {/* Selección de Usuario */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonIcon sx={{ mr: 1, color: '#0070f3' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Seleccionar Usuario
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Autocomplete
                                options={usuarios}
                                getOptionLabel={(option) =>
                                    `${option.nombre} ${option.apellido} (${option.area})`
                                }
                                value={selectedUsuario}
                                onChange={(event, newValue) => {
                                    setSelectedUsuario(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Buscar usuario"
                                        placeholder="Escribe nombre o área..."
                                        required
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    backgroundColor: '#0070f3',
                                                    mr: 1,
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                {option.iniciales}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {option.nombre} {option.apellido}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {option.cargo} - {option.area}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </li>
                                )}
                            />

                            {/* Vista previa del usuario seleccionado */}
                            {selectedUsuario && (
                                <Card
                                    elevation={0}
                                    sx={{ mt: 2, backgroundColor: '#f0f7ff', border: '1px solid #0070f3' }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    backgroundColor: '#0070f3',
                                                    mr: 2,
                                                }}
                                            >
                                                {selectedUsuario.iniciales}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {selectedUsuario.nombre} {selectedUsuario.apellido}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {selectedUsuario.cargo}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Área: {selectedUsuario.area} | DNI: {selectedUsuario.dni}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Paper>
                    </Grid>

                    {/* Detalles de la Asignación */}
                    <Grid size={{ xs: 12 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Detalles de la Asignación
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Controller
                                        name="tipoUso"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Tipo de Uso"
                                                fullWidth
                                                required
                                            >
                                                <MenuItem value="Asignación Permanente">Asignación Permanente</MenuItem>
                                                <MenuItem value="Préstamo Temporal">Préstamo Temporal</MenuItem>
                                                <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                                                <MenuItem value="Prueba">Prueba</MenuItem>
                                            </TextField>
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Controller
                                        name="registradoPor"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Registrado Por"
                                                fullWidth
                                                placeholder="Nombre del responsable"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="observaciones"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Observaciones"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                placeholder="Notas adicionales sobre la asignación..."
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Botones de Acción */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={() => navigate(ROUTES.ASIGNACIONES.LIST)}
                                sx={{ textTransform: 'none' }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={loading || !selectedEquipo || !selectedUsuario}
                                sx={{
                                    backgroundColor: '#0070f3',
                                    '&:hover': { backgroundColor: '#0051cc' },
                                    textTransform: 'none',
                                }}
                            >
                                {loading ? 'Asignando...' : 'Asignar Equipo'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
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

export default AsignarPage;