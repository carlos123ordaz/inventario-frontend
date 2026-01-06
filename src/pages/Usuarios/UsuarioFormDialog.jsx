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
    Typography,
    Divider,
    IconButton,
    Alert,
    Collapse,
    Box,
    useTheme,
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import { usuariosService } from '../../api';
import { AREAS } from '../../constants';

const UsuarioFormDialog = ({ open, onClose, onSuccess, editMode = false, usuarioData = null }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        setError: setFieldError,
    } = useForm({
        defaultValues: {
            dni: '',
            nombre: '',
            apellido: '',
            cargo: '',
            area: '',
            correo: '',
            telefono: '',
            usuario: '',
            iniciales: '',
            estado: 'Activo',
            observacion: '',
        },
    });

    const nombre = watch('nombre');
    const apellido = watch('apellido');

    // Generar iniciales y usuario automáticamente (solo en modo creación)
    useEffect(() => {
        if (!editMode && nombre && apellido) {
            const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
            setValue('iniciales', iniciales);

            const nombreLimpio = nombre.toLowerCase().trim().split(' ')[0];
            const apellidoLimpio = apellido.toLowerCase().trim().split(' ')[0];
            const usuarioSugerido = `${nombreLimpio.charAt(0)}${apellidoLimpio}`;
            setValue('usuario', usuarioSugerido);
        }
    }, [nombre, apellido, setValue, editMode]);

    useEffect(() => {
        if (editMode && usuarioData) {
            reset({
                dni: usuarioData.dni,
                nombre: usuarioData.nombre,
                apellido: usuarioData.apellido,
                cargo: usuarioData.cargo,
                area: usuarioData.area,
                correo: usuarioData.correo,
                telefono: usuarioData.telefono,
                usuario: usuarioData.usuario,
                iniciales: usuarioData.iniciales,
                estado: usuarioData.estado,
                observacion: usuarioData.observacion || '',
            });
        } else {
            reset({
                dni: '',
                nombre: '',
                apellido: '',
                cargo: '',
                area: '',
                correo: '',
                telefono: '',
                usuario: '',
                iniciales: '',
                estado: 'Activo',
                observacion: '',
            });
        }
        setError(null);
        setValidationErrors([]);
    }, [editMode, usuarioData, reset, open]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError(null);
            setValidationErrors([]);

            if (editMode) {
                await usuariosService.update(usuarioData._id, data);
            } else {
                await usuariosService.create(data);
            }
            onSuccess();
        } catch (error) {
            console.error('Error al guardar usuario:', error);

            if (error.response) {
                const { status, data } = error.response;

                if (status === 400) {
                    if (data.message) {
                        if (data.message.includes('dni')) {
                            setFieldError('dni', {
                                type: 'manual',
                                message: 'Este DNI ya está registrado',
                            });
                            setError('El DNI ya está registrado en el sistema');
                        } else if (data.message.includes('correo')) {
                            setFieldError('correo', {
                                type: 'manual',
                                message: 'Este correo ya está registrado',
                            });
                            setError('El correo electrónico ya está registrado en el sistema');
                        } else if (data.message.includes('usuario')) {
                            setFieldError('usuario', {
                                type: 'manual',
                                message: 'Este nombre de usuario ya existe',
                            });
                            setError('El nombre de usuario ya está en uso');
                        } else if (data.message.includes('equipos asignados')) {
                            setError(data.message);
                        } else {
                            setError(data.message);
                        }
                    }

                    if (data.errors && Array.isArray(data.errors)) {
                        setValidationErrors(data.errors);
                        data.errors.forEach((err) => {
                            if (err.param) {
                                setFieldError(err.param, {
                                    type: 'manual',
                                    message: err.msg,
                                });
                            }
                        });

                        if (!data.message) {
                            setError('Por favor corrige los errores en el formulario');
                        }
                    }
                } else if (status === 404) {
                    setError('El usuario no fue encontrado. Es posible que haya sido eliminado.');
                } else if (status === 500) {
                    setError('Error en el servidor. Por favor, intenta nuevamente más tarde.');
                } else {
                    setError(data.message || 'Ocurrió un error al guardar el usuario.');
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
                    backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette.surface?.main
                        : '#fafafa',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 400, color: theme.palette.text.primary }}>
                    {editMode ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                        {/* Información Personal */}
                        <Grid size={{ xs: 12 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 1.5
                                }}
                            >
                                Información Personal
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={4}>
                            <Controller
                                name="dni"
                                control={control}
                                rules={{
                                    required: 'El DNI es requerido',
                                    pattern: {
                                        value: /^[0-9]{8}$/,
                                        message: 'El DNI debe tener exactamente 8 dígitos',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="DNI"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.dni}
                                        helperText={errors.dni?.message}
                                        inputProps={{ maxLength: 8 }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={4}>
                            <Controller
                                name="nombre"
                                control={control}
                                rules={{
                                    required: 'El nombre es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Debe tener al menos 2 caracteres',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nombre"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.nombre}
                                        helperText={errors.nombre?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={4}>
                            <Controller
                                name="apellido"
                                control={control}
                                rules={{
                                    required: 'El apellido es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Debe tener al menos 2 caracteres',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Apellido"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.apellido}
                                        helperText={errors.apellido?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Información Laboral */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mt: 2,
                                    mb: 1.5
                                }}
                            >
                                Información Laboral
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Controller
                                name="cargo"
                                control={control}
                                rules={{ required: 'El cargo es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Cargo"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.cargo}
                                        helperText={errors.cargo?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Controller
                                name="area"
                                control={control}
                                rules={{ required: 'El área es requerida' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Área"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.area}
                                        helperText={errors.area?.message}
                                    >
                                        {
                                            AREAS.map((area) => (
                                                <MenuItem key={area} value={area}>{area}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Contacto */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mt: 2,
                                    mb: 1.5
                                }}
                            >
                                Información de Contacto
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Controller
                                name="correo"
                                control={control}
                                rules={{
                                    required: 'El correo es requerido',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Debe ser un correo electrónico válido',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Correo Electrónico"
                                        type="email"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.correo}
                                        helperText={errors.correo?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Controller
                                name="telefono"
                                control={control}
                                rules={{
                                    required: 'El teléfono es requerido',
                                    pattern: {
                                        value: /^[0-9]{9}$/,
                                        message: 'El teléfono debe tener exactamente 9 dígitos',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Teléfono"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.telefono}
                                        helperText={errors.telefono?.message}
                                        inputProps={{ maxLength: 9 }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Credenciales */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mt: 2,
                                    mb: 1.5
                                }}
                            >
                                Credenciales de Sistema
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={4}>
                            <Controller
                                name="usuario"
                                control={control}
                                rules={{
                                    required: 'El nombre de usuario es requerido',
                                    minLength: {
                                        value: 3,
                                        message: 'Debe tener al menos 3 caracteres',
                                    },
                                    pattern: {
                                        value: /^[a-z0-9._]+$/,
                                        message: 'Solo letras minúsculas, números, puntos y guiones bajos',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Usuario"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.usuario}
                                        helperText={errors.usuario?.message || (!editMode && 'Se genera automáticamente')}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={4}>
                            <Controller
                                name="iniciales"
                                control={control}
                                rules={{
                                    required: 'Las iniciales son requeridas',
                                    minLength: {
                                        value: 2,
                                        message: 'Debe tener al menos 2 caracteres',
                                    },
                                    maxLength: {
                                        value: 4,
                                        message: 'No puede tener más de 4 caracteres',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Iniciales"
                                        fullWidth
                                        size="small"
                                        required
                                        error={!!errors.iniciales}
                                        helperText={errors.iniciales?.message || (!editMode && 'Se generan automáticamente')}
                                        inputProps={{ maxLength: 4, style: { textTransform: 'uppercase' } }}
                                        onChange={(e) => {
                                            field.onChange(e.target.value.toUpperCase());
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={4}>
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
                                    >
                                        <MenuItem value="Activo">Activo</MenuItem>
                                        <MenuItem value="Inactivo">Inactivo</MenuItem>
                                        <MenuItem value="Suspendido">Baja</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Observaciones */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="observacion"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Observaciones"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        placeholder="Notas adicionales sobre el usuario..."
                                        error={!!errors.observacion}
                                        helperText={errors.observacion?.message}
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
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.surface?.main
                            : '#fafafa',
                        borderTop: `1px solid ${theme.palette.divider}`,
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

export default UsuarioFormDialog;