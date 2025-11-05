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
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import { equiposService } from '../../api';
import moment from 'moment';

const EquipoFormDialog = ({ open, onClose, onSuccess, editMode = false, equipoData = null }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setError: setFieldError,
    } = useForm({
        defaultValues: {
            equipo: 'Laptop',
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
            observaciones: '',
        },
    });

    useEffect(() => {
        if (editMode && equipoData) {
            reset({
                equipo: equipoData.equipo,
                marca: equipoData.marca,
                modelo: equipoData.modelo,
                serie: equipoData.serie,
                host: equipoData.host,
                estado: equipoData.estado,
                fechaCompra: moment(equipoData.fechaCompra).format('YYYY-MM-DD'),
                primerUso: moment(equipoData.primerUso).format('YYYY-MM-DD'),
                procesador: equipoData.procesador,
                almacenamiento: equipoData.almacenamiento,
                memoria: equipoData.memoria,
                pantalla: equipoData.pantalla || '',
                tarjetaGrafica: equipoData.tarjetaGrafica || '',
                puertoRed: equipoData.puertoRed,
                puertosUSB: equipoData.puertosUSB,
                puertoSerial: equipoData.puertoSerial,
                puertoHDMI: equipoData.puertoHDMI,
                puertoC: equipoData.puertoC,
                observaciones: equipoData.observaciones || '',
            });
        } else {
            reset({
                equipo: 'Laptop',
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
                observaciones: '',
            });
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
                    backgroundColor: '#fafafa',
                    borderBottom: '1px solid #e5e5e5',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 400, color: '#32363a' }}>
                    {editMode ? 'Editar Equipo' : 'Nuevo Equipo'}
                </Typography>
                <IconButton onClick={handleClose} disabled={loading} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 3 }}>
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
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#32363a', mb: 1.5 }}>
                                Información Básica
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={4}>
                            <Controller
                                name="equipo"
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
                                        error={!!errors.equipo}
                                        helperText={errors.equipo?.message}
                                    >
                                        <MenuItem value="Laptop">Laptop</MenuItem>
                                        <MenuItem value="Desktop">Desktop</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={4}>
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

                        {/* Especificaciones Técnicas */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#32363a', mt: 2, mb: 1.5 }}>
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

                        {/* Puertos */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#32363a', mt: 2, mb: 1.5 }}>
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
                                name="puertoUSB"
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

                        {/* Observaciones */}
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
                        backgroundColor: '#fafafa',
                        borderTop: '1px solid #e5e5e5',
                    }}
                >
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            color: '#32363a',
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
                            backgroundColor: '#0854a0',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#0a6ed1',
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