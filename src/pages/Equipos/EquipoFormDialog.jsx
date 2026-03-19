import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Warning as WarningIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
    ShoppingCart as ShoppingCartIcon,
    PhoneAndroid as PhoneAndroidIcon,
} from '@mui/icons-material';
import { equiposService } from '../../api';
import moment from 'moment';
import { TIPOS_EQUIPOS } from '../../constants';

const EquipoFormDialog = ({ open, onClose, onSuccess, editMode = false, equipoData = null }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState('LAPTOP');
    const [showPasswords, setShowPasswords] = useState({
        biosPass: false,
        adminPass: false,
        equipoPass: false,
        celularPass: false,
    });

    const esAccesorio = ['MOUSE', 'MONITOR', 'TECLADO', 'COOLER', 'CELULAR'].includes(tipoSeleccionado);
    const esCelular = tipoSeleccionado === 'CELULAR';

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
            fechaCompra: moment.utc().format('YYYY-MM-DD'),
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
            clavesBIOS: { contrasena: '', notas: '' },
            clavesAdministrador: { usuario: '', contrasena: '', notas: '' },
            clavesEquipo: { usuario: '', contrasena: '', notas: '' },
            proveedor: { razonSocial: '', ruc: '', nroFactura: '', precioUnitario: 0, moneda: 'PEN' },
            observaciones: '',
            // Campos de celular
            puk: '',
            email: '',
            password: '',
            codeSIM: '',
            imei: '',
            phoneNumber: '',
        },
    });

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
                fechaCompra: moment.utc(equipoData.fechaCompra).format('YYYY-MM-DD'),
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
                proveedor: {
                    razonSocial: equipoData.proveedor?.razonSocial || '',
                    ruc: equipoData.proveedor?.ruc || '',
                    nroFactura: equipoData.proveedor?.nroFactura || '',
                    precioUnitario: equipoData.proveedor?.precioUnitario || 0,
                    moneda: equipoData.proveedor?.moneda || 'PEN',
                },
                observaciones: equipoData.observaciones || '',
                // Campos de celular
                puk: equipoData.puk || '',
                email: equipoData.email || '',
                password: equipoData.password || '',
                codeSIM: equipoData.codeSIM || '',
                imei: equipoData.imei || '',
                phoneNumber: equipoData.phoneNumber || '',
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
                fechaCompra: moment.utc().format('YYYY-MM-DD'),
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
                clavesBIOS: { contrasena: '', notas: '' },
                clavesAdministrador: { usuario: '', contrasena: '', notas: '' },
                clavesEquipo: { usuario: '', contrasena: '', notas: '' },
                proveedor: { razonSocial: '', ruc: '', nroFactura: '', precioUnitario: 0, moneda: 'PEN' },
                observaciones: '',
                puk: '',
                email: '',
                password: '',
                codeSIM: '',
                imei: '',
                phoneNumber: '',
            });
            setTipoSeleccionado('LAPTOP');
        }
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

            if (error.response) {
                const { status, data } = error.response;

                if (status === 400) {
                    if (data.message) {
                        if (data.message.includes('serie')) {
                            setFieldError('serie', { type: 'manual', message: data.message });
                            setError(data.message);
                        } else if (data.message.includes('asignación activa')) {
                            setFieldError('estado', { type: 'manual', message: data.message });
                            setError(data.message);
                        } else {
                            setError(data.message);
                        }
                    }
                    if (data.errors && Array.isArray(data.errors)) {
                        setValidationErrors(data.errors);
                        data.errors.forEach((err) => {
                            if (err.param) {
                                setFieldError(err.param, { type: 'manual', message: err.msg });
                            }
                        });
                    }
                } else if (status === 404) {
                    setError('El equipo no fue encontrado. Es posible que haya sido eliminado.');
                } else if (status === 500) {
                    setError('Error en el servidor. Por favor, intenta nuevamente más tarde.');
                } else {
                    setError(data.message || 'Ocurrió un error al guardar el equipo.');
                }
            } else if (error.request) {
                setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else {
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
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    // ========== ESTILOS REUTILIZABLES ==========
    const sectionPaperSx = {
        p: 2,
        backgroundColor: '#0a0a0f',
        border: '1px solid rgba(108, 92, 231, 0.12)',
        backgroundImage: 'none',
    };

    const dialogHeaderSx = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 2,
        backgroundColor: '#0a0a0f',
        borderBottom: '1px solid rgba(108, 92, 231, 0.12)',
    };

    const dialogFooterSx = {
        px: 3,
        py: 2,
        backgroundColor: '#0a0a0f',
        borderTop: '1px solid rgba(108, 92, 231, 0.12)',
    };

    const sectionHeaderSx = {
        fontWeight: 600,
        color: '#e2e2e8',
        mt: 2,
        mb: 1.5,
    };

    // Props comunes para desactivar autocompletado
    const noAutoComplete = {
        autoComplete: 'off',
        'data-lpignore': 'true',
        'data-form-type': 'other',
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
                    border: '1px solid rgba(108, 92, 231, 0.12)',
                },
            }}
        >
            <DialogTitle sx={dialogHeaderSx}>
                <Typography variant="h6" sx={{ fontWeight: 400, color: '#e2e2e8' }}>
                    {editMode ? 'Editar Equipo' : 'Nuevo Equipo'}
                </Typography>
                <IconButton onClick={handleClose} disabled={loading} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                        {/* ========== INFORMACIÓN BÁSICA ========== */}
                        <Grid size={12}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#e2e2e8', mb: 0.5 }}>
                                Información Básica
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                                        {...noAutoComplete}
                                    >
                                        {TIPOS_EQUIPOS.map((tipo) => (
                                            <MenuItem key={tipo} value={tipo}>
                                                {tipo}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                                        {...noAutoComplete}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                                        {...noAutoComplete}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Controller
                                name="serie"
                                control={control}
                                rules={{
                                    required: 'El número de serie es requerido',
                                    minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
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
                                        {...noAutoComplete}
                                    />
                                )}
                            />
                        </Grid>

                        {!esAccesorio && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                                            {...noAutoComplete}
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                                        {...noAutoComplete}
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

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Controller
                                name="fechaCompra"
                                control={control}
                                rules={{
                                    required: 'La fecha de compra es requerida',
                                    validate: (value) => {
                                        const fecha = new Date(value);
                                        const hoy = new Date();
                                        if (fecha > hoy) return 'La fecha no puede ser futura';
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
                                        {...noAutoComplete}
                                    />
                                )}
                            />
                        </Grid>

                        {/* ========== CAMPOS DE CELULAR ========== */}
                        {esCelular && (
                            <>
                                <Grid size={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1.5 }}>
                                        <PhoneAndroidIcon sx={{ color: '#00b894', fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={sectionHeaderSx}>
                                            Información del Celular
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#7c7c8a' }}>
                                        Datos específicos del dispositivo móvil
                                    </Typography>
                                </Grid>

                                <Grid size={12}>
                                    <Paper sx={sectionPaperSx}>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name="phoneNumber"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Número de Teléfono"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: +51 999 888 777"
                                                            error={!!errors.phoneNumber}
                                                            helperText={errors.phoneNumber?.message}
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name="imei"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="IMEI"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: 356938035643809"
                                                            error={!!errors.imei}
                                                            helperText={errors.imei?.message}
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name="codeSIM"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Código SIM"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: 8951100000000000000"
                                                            error={!!errors.codeSIM}
                                                            helperText={errors.codeSIM?.message}
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name="puk"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="PUK"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: 12345678"
                                                            error={!!errors.puk}
                                                            helperText={errors.puk?.message}
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Email Asociado"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Ej: equipo@empresa.com"
                                                            error={!!errors.email}
                                                            helperText={errors.email?.message}
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name="password"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Contraseña"
                                                            fullWidth
                                                            size="small"
                                                            type={showPasswords.celularPass ? 'text' : 'password'}
                                                            placeholder="••••••••"
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <Tooltip title={showPasswords.celularPass ? 'Ocultar' : 'Mostrar'}>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => togglePasswordVisibility('celularPass')}
                                                                            >
                                                                                {showPasswords.celularPass ? (
                                                                                    <VisibilityOffIcon fontSize="small" />
                                                                                ) : (
                                                                                    <VisibilityIcon fontSize="small" />
                                                                                )}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </>
                        )}

                        {/* ========== ESPECIFICACIONES TÉCNICAS (solo laptop/desktop) ========== */}
                        {!esAccesorio && (
                            <>
                                <Grid size={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" sx={sectionHeaderSx}>
                                        Especificaciones Técnicas
                                    </Typography>
                                </Grid>

                                <Grid size={12}>
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
                                                {...noAutoComplete}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                                {...noAutoComplete}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                                {...noAutoComplete}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                                {...noAutoComplete}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                                {...noAutoComplete}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Puertos */}
                                <Grid size={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" sx={sectionHeaderSx}>
                                        Conectividad
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Controller
                                        name="puertoRed"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" color="secondary" />}
                                                label="Puerto Red"
                                                sx={{ color: '#e2e2e8' }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Controller
                                        name="puertosUSB"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" color="secondary" />}
                                                label="Puerto USB"
                                                sx={{ color: '#e2e2e8' }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Controller
                                        name="puertoSerial"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" color="secondary" />}
                                                label="Puerto Serial"
                                                sx={{ color: '#e2e2e8' }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Controller
                                        name="puertoHDMI"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" color="secondary" />}
                                                label="Puerto HDMI"
                                                sx={{ color: '#e2e2e8' }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Controller
                                        name="puertoC"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" color="secondary" />}
                                                label="Puerto C"
                                                sx={{ color: '#e2e2e8' }}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* ========== PROVEEDOR ========== */}
                                <Grid size={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1.5 }}>
                                        <ShoppingCartIcon sx={{ color: '#00cec9', fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#e2e2e8' }}>
                                            Información del Proveedor
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#7c7c8a' }}>
                                        Datos de la compra y el proveedor
                                    </Typography>
                                </Grid>

                                <Grid size={12}>
                                    <Paper sx={sectionPaperSx}>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
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
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
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
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
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
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name="proveedor.precioUnitario"
                                                    control={control}
                                                    rules={{ min: { value: 0, message: 'El precio debe ser mayor o igual a 0' } }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Precio Unitario"
                                                            fullWidth
                                                            size="small"
                                                            type="number"
                                                            placeholder="0.00"
                                                            inputProps={{ step: '0.01', min: '0' }}
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
                                                                                        width: 110,
                                                                                        '& .MuiInput-underline:before': { borderBottom: 'none' },
                                                                                        '& .MuiInput-underline:hover:before': { borderBottom: 'none' },
                                                                                        '& .MuiInput-underline:after': { borderBottom: 'none' },
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
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* ========== CLAVES DE SEGURIDAD ========== */}
                                <Grid size={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1.5 }}>
                                        <LockIcon sx={{ color: '#6c5ce7', fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#e2e2e8' }}>
                                            Claves de Seguridad
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#7c7c8a' }}>
                                        Almacena las credenciales de acceso de este equipo de forma segura
                                    </Typography>
                                </Grid>

                                {/* BIOS */}
                                <Grid size={12}>
                                    <Paper sx={sectionPaperSx}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#e2e2e8' }}>
                                            🔐 Contraseña BIOS
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
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
                                                                            <IconButton size="small" onClick={() => togglePasswordVisibility('biosPass')}>
                                                                                {showPasswords.biosPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name="clavesBIOS.notas"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Notas BIOS"
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Información adicional..."
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* ADMINISTRADOR */}
                                <Grid size={12}>
                                    <Paper sx={sectionPaperSx}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#e2e2e8' }}>
                                            👤 Contraseña Administrador
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
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
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
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
                                                                            <IconButton size="small" onClick={() => togglePasswordVisibility('adminPass')}>
                                                                                {showPasswords.adminPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={12}>
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
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* EQUIPO / USUARIO */}
                                <Grid size={12}>
                                    <Paper sx={sectionPaperSx}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#e2e2e8' }}>
                                            🖥️ Contraseña Usuario Equipo
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
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
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
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
                                                                            <IconButton size="small" onClick={() => togglePasswordVisibility('equipoPass')}>
                                                                                {showPasswords.equipoPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={12}>
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
                                                            {...noAutoComplete}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </>
                        )}

                        {/* ========== OBSERVACIONES (siempre visible) ========== */}
                        <Grid size={12}>
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
                                        {...noAutoComplete}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={dialogFooterSx}>
                    <Button onClick={handleClose} disabled={loading} sx={{ color: '#7c7c8a' }}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading} startIcon={<SaveIcon />}>
                        {loading ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EquipoFormDialog;