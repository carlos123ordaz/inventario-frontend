import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControlLabel,
    Switch,
    Typography,
    Box,
    Divider,
    IconButton,
    Alert,
    Collapse,
    Paper,
    InputAdornment,
    Tooltip,
    useTheme,
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Warning as WarningIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
    ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { equiposService } from '../../api';
import moment from 'moment';
import { TIPOS_EQUIPOS } from '../../constants';
import { MainContext } from '../../context/MainContextProvider';

const EquipoFormDialog = ({ open, onClose, onSuccess, editMode = false, equipoData = null }) => {
    const theme = useTheme();
    const { darkMode } = useContext(MainContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState('LAPTOP');
    const [showPasswords, setShowPasswords] = useState({
        biosPass: false,
        adminPass: false,
        equipoPass: false,
        pin: false,
    });

    const esAccesorio = ['MOUSE', 'MONITOR', 'TECLADO', 'COOLER', 'CELULAR'].includes(tipoSeleccionado);
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setError: setFieldError,
        watch,
    } = useForm({
        defaultValues: {
            tipo: 'LAPTOP',
            marca: '',
            modelo: '',
            serie: '',
            host: '',
            estado: 'Disponible',
            fechaCompra: moment().format('YYYY-MM-DD'),
            primerUso: moment().format('YYYY-MM-DD'),
            procesador: '',
            almacenamiento: '',
            memoria: '',
            pantalla: '',
            tarjetaGrafica: '',
            puertoRed: false,
            puertosUSB: true,
            puertoSerial: false,
            puertoHDMI: false,
            puertoC: false,
            // CLAVES DE SEGURIDAD
            clavesBIOS: {
                contrasena: '',
                notas: '',
            },
            clavesAdministrador: {
                usuario: '',
                contrasena: '',
                notas: '',
            },
            clavesEquipo: {
                usuario: '',
                contrasena: '',
                notas: '',
            },
            // NUEVA SECCIÓN: PROVEEDOR
            proveedor: {
                razonSocial: '',
                ruc: '',
                nroFactura: '',
                precioUnitario: 0,
                moneda: 'PEN',
            },
            observaciones: '',
        },
    });

    // Observar cambios en el tipo de equipo
    const tipoWatched = watch('tipo');

    useEffect(() => {
        setTipoSeleccionado(tipoWatched);
    }, [tipoWatched]);

    useEffect(() => {
        if (editMode && equipoData) {
            reset({
                tipo: equipoData.tipo,
                marca: equipoData.marca,
                modelo: equipoData.modelo,
                serie: equipoData.serie,
                host: equipoData.host || '',
                estado: equipoData.estado,
                fechaCompra: moment(equipoData.fechaCompra).format('YYYY-MM-DD'),
                primerUso: moment(equipoData.primerUso).format('YYYY-MM-DD'),
                procesador: equipoData.procesador || '',
                almacenamiento: equipoData.almacenamiento || '',
                memoria: equipoData.memoria || '',
                pantalla: equipoData.pantalla || '',
                tarjetaGrafica: equipoData.tarjetaGrafica || '',
                puertoRed: equipoData.puertoRed || false,
                puertosUSB: equipoData.puertosUSB || false,
                puertoSerial: equipoData.puertoSerial || false,
                puertoHDMI: equipoData.puertoHDMI || false,
                puertoC: equipoData.puertoC || false,
                // Claves de seguridad
                clavesBIOS: {
                    contrasena: equipoData.clavesBIOS?.contrasena || '',
                    notas: equipoData.clavesBIOS?.notas || '',
                },
                clavesAdministrador: {
                    usuario: equipoData.clavesAdministrador?.usuario || '',
                    contrasena: equipoData.clavesAdministrador?.contrasena || '',
                    notas: equipoData.clavesAdministrador?.notas || '',
                },
                clavesEquipo: {
                    usuario: equipoData.clavesEquipo?.usuario || '',
                    contrasena: equipoData.clavesEquipo?.contrasena || '',
                    notas: equipoData.clavesEquipo?.notas || '',
                },
                // Proveedor
                proveedor: {
                    razonSocial: equipoData.proveedor?.razonSocial || '',
                    ruc: equipoData.proveedor?.ruc || '',
                    nroFactura: equipoData.proveedor?.nroFactura || '',
                    precioUnitario: equipoData.proveedor?.precioUnitario || 0,
                    moneda: equipoData.proveedor?.moneda || 'PEN',
                },
                observaciones: equipoData.observaciones || '',
            });
            setTipoSeleccionado(equipoData.tipo);
        } else {
            reset({
                tipo: 'LAPTOP',
                marca: '',
                modelo: '',
                serie: '',
                host: '',
                estado: 'Disponible',
                fechaCompra: moment().format('YYYY-MM-DD'),
                primerUso: moment().format('YYYY-MM-DD'),
                procesador: '',
                almacenamiento: '',
                memoria: '',
                pantalla: '',
                tarjetaGrafica: '',
                puertoRed: false,
                puertosUSB: true,
                puertoSerial: false,
                puertoHDMI: false,
                puertoC: false,
                clavesBIOS: {
                    contrasena: '',
                    notas: '',
                },
                clavesAdministrador: {
                    usuario: '',
                    contrasena: '',
                    notas: '',
                },
                clavesEquipo: {
                    usuario: '',
                    contrasena: '',
                    notas: '',
                },
                proveedor: {
                    razonSocial: '',
                    ruc: '',
                    nroFactura: '',
                    precioUnitario: 0,
                    moneda: 'PEN',
                },
                observaciones: '',
            });
            setTipoSeleccionado('LAPTOP');
        }
        // Limpiar errores al abrir/cerrar
        setError(null);
        setValidationErrors([]);
    }, [editMode, equipoData, reset, open]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError(null);
            setValidationErrors([]);
            if (editMode) {
                await equiposService.update(equipoData._id, data);
            } else {
                await equiposService.create(data);
            }
            onSuccess();
        } catch (error) {
            console.error('Error al guardar equipo:', error);

            // Manejar diferentes tipos de errores
            if (error.response) {
                const { status, data } = error.response;

                // Error 400 - Validación o datos duplicados
                if (status === 400) {
                    if (data.message) {
                        // Error específico (ej: serie duplicada)
                        if (data.message.includes('serie')) {
                            setFieldError('serie', {
                                type: 'manual',
                                message: data.message,
                            });
                            setError(data.message);
                        } else if (data.message.includes('asignación activa')) {
                            // Error de cambio de estado con asignación activa
                            setFieldError('estado', {
                                type: 'manual',
                                message: data.message,
                            });
                            setError(data.message);
                        } else {
                            setError(data.message);
                        }
                    }

                    // Errores de validación múltiples
                    if (data.errors && Array.isArray(data.errors)) {
                        setValidationErrors(data.errors);
                        // Marcar campos con errores
                        data.errors.forEach((err) => {
                            if (err.param) {
                                setFieldError(err.param, {
                                    type: 'manual',
                                    message: err.msg,
                                });
                            }
                        });
                    }
                }
                // Error 404 - No encontrado (solo en edición)
                else if (status === 404) {
                    setError('El equipo no fue encontrado. Es posible que haya sido eliminado.');
                }
                // Error 500 - Error del servidor
                else if (status === 500) {
                    setError('Error en el servidor. Por favor, intenta nuevamente más tarde.');
                }
                // Otros errores
                else {
                    setError(data.message || 'Ocurrió un error al guardar el equipo.');
                }
            }
            // Error de red
            else if (error.request) {
                setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            }
            // Otros errores
            else {
                setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError(null);
            setValidationErrors([]);
            onClose();
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '0.5rem',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 2,
                    backgroundColor: darkMode ? theme.palette.background.default : '#fafafa',
                    borderBottom: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                    color: theme.palette.text.primary,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 400, color: theme.palette.text.primary }}>
                    {editMode ? 'Editar Equipo' : 'Nuevo Equipo'}
                </Typography>
                <IconButton onClick={handleClose} disabled={loading} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 3, maxHeight: '70vh', overflow: 'auto' }}>
                    {/* Alerta de Error General */}
                    <Collapse in={!!error}>
                        <Alert
                            severity="error"
                            icon={<WarningIcon />}
                            onClose={() => setError(null)}
                            sx={{ mb: 2 }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {error}
                            </Typography>
                        </Alert>
                    </Collapse>

                    {/* Alertas de Errores de Validación Múltiples */}
                    <Collapse in={validationErrors.length > 0}>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                Por favor corrige los siguientes errores:
                            </Typography>
                            <Box component="ul" sx={{ m: 0, pl: 2 }}>
                                {validationErrors.map((err, index) => (
                                    <li key={index}>
                                        <Typography variant="caption">
                                            {err.msg || err.message}
                                        </Typography>
                                    </li>
                                ))}
                            </Box>
                        </Alert>
                    </Collapse>

                    <Grid container spacing={2.5}>
                        {/* Información Básica */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1.5 }}>
                                Información Básica
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={esAccesorio ? 6 : 4}>
                            <Controller
                                name="tipo"
                                control={control}
                                rules={{ required: 'El tipo de equipo es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Tipo de Equipo"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.tipo}
                                        helperText={errors.tipo?.message}
                                    >
                                        {
                                            TIPOS_EQUIPOS.map((tipo) => (
                                                <MenuItem key={tipo} value={tipo}>
                                                    {tipo}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={esAccesorio ? 6 : 4}>
                            <Controller
                                name="marca"
                                control={control}
                                rules={{ required: 'La marca es requerida' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Marca"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.marca}
                                        helperText={errors.marca?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {!esAccesorio && (
                            <Grid size={{ xs: 12 }} sm={4}>
                                <Controller
                                    name="modelo"
                                    control={control}
                                    rules={{ required: 'El modelo es requerido' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Modelo"
                                            fullWidth
                                            size="small"
                                            required
                                            error={!!errors.modelo}
                                            helperText={errors.modelo?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        {esAccesorio && (
                            <Grid size={{ xs: 12 }} sm={6}>
                                <Controller
                                    name="modelo"
                                    control={control}
                                    rules={{ required: 'El modelo es requerido' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Modelo"
                                            fullWidth
                                            size="small"
                                            required
                                            error={!!errors.modelo}
                                            helperText={errors.modelo?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Controller
                                name="serie"
                                control={control}
                                rules={{
                                    required: 'El número de serie es requerido',
                                    minLength: {
                                        value: 3,
                                        message: 'Debe tener al menos 3 caracteres',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Número de Serie"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.serie}
                                        helperText={errors.serie?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {!esAccesorio && (
                            <Grid size={{ xs: 12 }} sm={6}>
                                <Controller
                                    name="host"
                                    control={control}
                                    rules={{ required: 'El nombre del host es requerido' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nombre del Host"
                                            fullWidth
                                            size="small"
                                            required
                                            error={!!errors.host}
                                            helperText={errors.host?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Controller
                                name="estado"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Estado"
                                        fullWidth
                                        size="small"
                                        error={!!errors.estado}
                                        helperText={errors.estado?.message}
                                    >
                                        <MenuItem value="Disponible">Disponible</MenuItem>
                                        <MenuItem value="En Uso">En Uso</MenuItem>
                                        <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                                        <MenuItem value="Dado de Baja">Dado de Baja</MenuItem>
                                        <MenuItem value="Extraviado">Extraviado</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Controller
                                name="fechaCompra"
                                control={control}
                                rules={{
                                    required: 'La fecha de compra es requerida',
                                    validate: (value) => {
                                        const fecha = new Date(value);
                                        const hoy = new Date();
                                        if (fecha > hoy) {
                                            return 'La fecha no puede ser futura';
                                        }
                                        return true;
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Fecha de Compra"
                                        type="date"
                                        fullWidth
                                        size="small"
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.fechaCompra}
                                        helperText={errors.fechaCompra?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Controller
                                name="primerUso"
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (!value) return true;
                                        const fecha = new Date(value);
                                        const hoy = new Date();
                                        if (fecha > hoy) {
                                            return 'La fecha no puede ser futura';
                                        }
                                        return true;
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Primer Uso"
                                        type="date"
                                        fullWidth
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.primerUso}
                                        helperText={errors.primerUso?.message}
                                    />
                                )}
                            />
                        </Grid>


                        {!esAccesorio && (
                            <>
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mt: 2, mb: 1.5 }}>
                                        Especificaciones Técnicas
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="procesador"
                                        control={control}
                                        rules={{ required: 'El procesador es requerido' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Procesador"
                                                fullWidth
                                                size="small"
                                                required
                                                placeholder="Ej: Intel Core i7-1165G7"
                                                error={!!errors.procesador}
                                                helperText={errors.procesador?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }} sm={6}>
                                    <Controller
                                        name="memoria"
                                        control={control}
                                        rules={{ required: 'La memoria RAM es requerida' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Memoria RAM"
                                                fullWidth
                                                size="small"
                                                required
                                                placeholder="Ej: 16GB DDR4"
                                                error={!!errors.memoria}
                                                helperText={errors.memoria?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }} sm={6}>
                                    <Controller
                                        name="almacenamiento"
                                        control={control}
                                        rules={{ required: 'El almacenamiento es requerido' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Almacenamiento"
                                                fullWidth
                                                size="small"
                                                required
                                                placeholder="Ej: 512GB SSD NVMe"
                                                error={!!errors.almacenamiento}
                                                helperText={errors.almacenamiento?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }} sm={6}>
                                    <Controller
                                        name="pantalla"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Pantalla"
                                                fullWidth
                                                size="small"
                                                placeholder="Ej: 14 pulgadas FHD"
                                                error={!!errors.pantalla}
                                                helperText={errors.pantalla?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }} sm={6}>
                                    <Controller
                                        name="tarjetaGrafica"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Tarjeta Gráfica"
                                                fullWidth
                                                size="small"
                                                placeholder="Ej: Intel Iris Xe"
                                                error={!!errors.tarjetaGrafica}
                                                helperText={errors.tarjetaGrafica?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Puertos - Solo para LAPTOP y DESKTOP */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mt: 2, mb: 1.5 }}>
                                        Conectividad
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }} sm={6} md={4}>
                                    <Controller
                                        name="puertoRed"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" />}
                                                label="Puerto Red"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }} sm={6} md={4}>
                                    <Controller
                                        name="puertosUSB"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" />}
                                                label="Puerto USB"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }} sm={6} md={4}>
                                    <Controller
                                        name="puertoSerial"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" />}
                                                label="Puerto Serial"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }} sm={6} md={4}>
                                    <Controller
                                        name="puertoHDMI"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" />}
                                                label="Puerto HDMI"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }} sm={6} md={4}>
                                    <Controller
                                        name="puertoC"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" />}
                                                label="Puerto C"
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* ========== NUEVA SECCIÓN: PROVEEDOR ========== */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1.5 }}>
                                        <ShoppingCartIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                            Información del Proveedor
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                        Datos de la compra y el proveedor
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{
                                        p: 2,
                                        backgroundColor: darkMode ? theme.palette.background.default : '#f9fafb',
                                        border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`
                                    }}>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name="proveedor.razonSocial"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Razón Social del Proveedor"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: Empresa XYZ S.A."
                                                            error={!!errors.proveedor?.razonSocial}
                                                            helperText={errors.proveedor?.razonSocial?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12 }} sm={6}>
                                                <Controller
                                                    name="proveedor.ruc"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="RUC"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: 20123456789"
                                                            error={!!errors.proveedor?.ruc}
                                                            helperText={errors.proveedor?.ruc?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12 }} sm={6}>
                                                <Controller
                                                    name="proveedor.nroFactura"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Número de Factura"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: 001-0001234"
                                                            error={!!errors.proveedor?.nroFactura}
                                                            helperText={errors.proveedor?.nroFactura?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12 }} sm={6}>
                                                <Controller
                                                    name="proveedor.precioUnitario"
                                                    control={control}
                                                    rules={{
                                                        min: {
                                                            value: 0,
                                                            message: 'El precio debe ser mayor o igual a 0'
                                                        }
                                                    }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Precio Unitario"
                                                            fullWidth
                                                            size="small"
                                                            type="number"
                                                            placeholder="0.00"
                                                            inputProps={{ step: "0.01", min: "0" }}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Controller
                                                                            name="proveedor.moneda"
                                                                            control={control}
                                                                            render={({ field: monedaField }) => (
                                                                                <TextField
                                                                                    {...monedaField}
                                                                                    select
                                                                                    size="small"
                                                                                    variant="standard"
                                                                                    sx={{
                                                                                        width: 70,
                                                                                        '& .MuiInput-underline:before': {
                                                                                            borderBottom: 'none'
                                                                                        },
                                                                                        '& .MuiInput-underline:hover:before': {
                                                                                            borderBottom: 'none'
                                                                                        },
                                                                                        '& .MuiInput-underline:after': {
                                                                                            borderBottom: 'none'
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value="PEN">PEN (S/.)</MenuItem>
                                                                                    <MenuItem value="USD">USD ($)</MenuItem>
                                                                                    <MenuItem value="EUR">EUR (€)</MenuItem>
                                                                                    <MenuItem value="GBP">GBP (£)</MenuItem>
                                                                                    <MenuItem value="JPY">JPY (¥)</MenuItem>
                                                                                    <MenuItem value="AUD">AUD (A$)</MenuItem>
                                                                                    <MenuItem value="CAD">CAD (C$)</MenuItem>
                                                                                    <MenuItem value="CHF">CHF (Fr)</MenuItem>
                                                                                </TextField>
                                                                            )}
                                                                        />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            error={!!errors.proveedor?.precioUnitario}
                                                            helperText={errors.proveedor?.precioUnitario?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* ========== SECCIÓN DE CLAVES DE SEGURIDAD ========== */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1.5 }}>
                                        <LockIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                            Claves de Seguridad
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                        Almacena las credenciales de acceso de este equipo de forma segura
                                    </Typography>
                                </Grid>

                                {/* BIOS */}
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{
                                        p: 2,
                                        backgroundColor: darkMode ? theme.palette.background.default : '#f9fafb',
                                        border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`
                                    }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.text.primary }}>
                                            🔐 Contraseña BIOS
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12 }} sm={6}>
                                                <Controller
                                                    name="clavesBIOS.contrasena"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Contraseña BIOS"
                                                            fullWidth
                                                            size="small"
                                                            type={showPasswords.biosPass ? 'text' : 'password'}
                                                            placeholder="••••••••"
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <Tooltip title={showPasswords.biosPass ? 'Ocultar' : 'Mostrar'}>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => togglePasswordVisibility('biosPass')}
                                                                            >
                                                                                {showPasswords.biosPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name="clavesBIOS.notas"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Notas"
                                                            fullWidth
                                                            size="small"
                                                            multiline
                                                            rows={2}
                                                            placeholder="Información adicional..."
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* ADMINISTRADOR */}
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{
                                        p: 2,
                                        backgroundColor: darkMode ? theme.palette.background.default : '#f9fafb',
                                        border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`
                                    }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.text.primary }}>
                                            👤 Contraseña Administrador
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12 }} sm={6}>
                                                <Controller
                                                    name="clavesAdministrador.usuario"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Usuario Administrador"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: Administrator"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }} sm={6}>
                                                <Controller
                                                    name="clavesAdministrador.contrasena"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Contraseña Admin"
                                                            fullWidth
                                                            size="small"
                                                            type={showPasswords.adminPass ? 'text' : 'password'}
                                                            placeholder="••••••••"
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <Tooltip title={showPasswords.adminPass ? 'Ocultar' : 'Mostrar'}>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => togglePasswordVisibility('adminPass')}
                                                                            >
                                                                                {showPasswords.adminPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name="clavesAdministrador.notas"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Notas"
                                                            fullWidth
                                                            size="small"
                                                            multiline
                                                            rows={2}
                                                            placeholder="Información adicional..."
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* EQUIPO / USUARIO */}
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{
                                        p: 2,
                                        backgroundColor: darkMode ? theme.palette.background.default : '#f9fafb',
                                        border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`
                                    }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.text.primary }}>
                                            🖥️ Contraseña Usuario Equipo
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12 }} sm={6}>
                                                <Controller
                                                    name="clavesEquipo.usuario"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Usuario Equipo"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: usuario"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }} sm={6}>
                                                <Controller
                                                    name="clavesEquipo.contrasena"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Contraseña Equipo"
                                                            fullWidth
                                                            size="small"
                                                            type={showPasswords.equipoPass ? 'text' : 'password'}
                                                            placeholder="••••••••"
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <Tooltip title={showPasswords.equipoPass ? 'Ocultar' : 'Mostrar'}>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => togglePasswordVisibility('equipoPass')}
                                                                            >
                                                                                {showPasswords.equipoPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name="clavesEquipo.notas"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Notas"
                                                            fullWidth
                                                            size="small"
                                                            multiline
                                                            rows={2}
                                                            placeholder="Información adicional..."
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </>
                        )}

                        {/* Observaciones */}
                        <Grid size={{ xs: 12 }}>
                            {esAccesorio && <Divider sx={{ my: 1 }} />}
                            <Controller
                                name="observaciones"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Observaciones"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        placeholder="Notas adicionales..."
                                        error={!!errors.observaciones}
                                        helperText={errors.observaciones?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        backgroundColor: darkMode ? theme.palette.background.default : '#fafafa',
                        borderTop: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                    }}
                >
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            color: theme.palette.text.primary,
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={<SaveIcon />}
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {loading ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EquipoFormDialog;