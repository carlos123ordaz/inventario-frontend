import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Avatar,
    Chip,
    Divider,
    IconButton,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    useTheme,
} from '@mui/material';
import {
    Close as CloseIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    Badge as BadgeIcon,
    Person as PersonIcon,
    Computer as ComputerIcon,
    Cloud as CloudIcon,
    Check as CheckIcon,
    Close as CloseIconX,
    OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { usuariosService } from '../../api';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const UsuarioDetailDialog = ({ open, onClose, usuario: usuarioProp, onEdit, onDelete }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && usuarioProp) {
            loadUsuarioDetalle();
        }
    }, [open, usuarioProp]);

    const loadUsuarioDetalle = async () => {
        try {
            setLoading(true);
            const response = await usuariosService.getById(usuarioProp._id);
            setUsuario(response.data);
        } catch (error) {
            console.error('Error al cargar detalle:', error);
        } finally {
            setLoading(false);
        }
    };

    const getEstadoColor = (estado) => {
        const colors = {
            'Activo': 'success',
            'Inactivo': 'default',
            'Baja': 'error',
        };
        return colors[estado] || 'default';
    };

    const getInitials = (nombre, apellido) => {
        return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
    };

    const handleEquipoClick = (equipoId) => {
        onClose(); // Cerrar el diálogo
        navigate(`/equipos/${equipoId}`); // Navegar a detalle del equipo
    };

    if (!usuario && !loading) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                    Detalle del Usuario
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3, maxHeight: '70vh', overflow: 'auto' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <Typography color="text.secondary">Cargando...</Typography>
                    </Box>
                ) : usuario ? (
                    <Grid container spacing={3}>
                        {/* Header con Avatar */}
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: theme.palette.primary.main,
                                        fontSize: '1.75rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {getInitials(usuario.nombre, usuario.apellido)}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 500, mb: 0.5 }}>
                                        {usuario.nombreCompleto || `${usuario.nombre} ${usuario.apellido}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        @{usuario.usuario}
                                    </Typography>
                                    <Chip
                                        label={usuario.estado}
                                        color={getEstadoColor(usuario.estado)}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                            <Divider />
                        </Grid>

                        {/* Información de Sistema */}
                        <Grid size={{ xs: 12 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 2
                                }}
                            >
                                Información de Sistema
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PersonIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                                        Usuario
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {usuario.usuario}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <BadgeIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                                        Iniciales
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                                        {usuario.iniciales}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Información Personal */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 2,
                                    mt: 2
                                }}
                            >
                                Información Personal
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <BadgeIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                                        DNI
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {usuario.dni}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Información Laboral */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 2,
                                    mt: 2
                                }}
                            >
                                Información Laboral
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <WorkIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                                        Cargo
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {usuario.cargo}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <BusinessIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                                        Área
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {usuario.area}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Contacto */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 2,
                                    mt: 2
                                }}
                            >
                                Información de Contacto
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <EmailIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                                        Correo Electrónico
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {usuario.correo}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PhoneIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                                        Teléfono
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {usuario.telefono?.prefijo} {usuario.telefono?.numero}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Cuentas de Sistemas */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 2 }}>
                                <CloudIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    Cuentas de Sistemas
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Bitrix24 */}
                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{
                                p: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: usuario.cuentas?.bitrix24
                                    ? theme.palette.mode === 'dark'
                                        ? 'rgba(76, 175, 80, 0.1)'
                                        : 'rgba(76, 175, 80, 0.05)'
                                    : 'transparent'
                            }}>
                                {usuario.cuentas?.bitrix24 ? (
                                    <CheckIcon sx={{ color: theme.palette.success.main }} />
                                ) : (
                                    <CloseIconX sx={{ color: theme.palette.text.secondary }} />
                                )}
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Bitrix24
                                </Typography>
                            </Box>
                        </Grid>

                        {/* NAS */}
                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{
                                p: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: usuario.cuentas?.nas
                                    ? theme.palette.mode === 'dark'
                                        ? 'rgba(76, 175, 80, 0.1)'
                                        : 'rgba(76, 175, 80, 0.05)'
                                    : 'transparent'
                            }}>
                                {usuario.cuentas?.nas ? (
                                    <CheckIcon sx={{ color: theme.palette.success.main }} />
                                ) : (
                                    <CloseIconX sx={{ color: theme.palette.text.secondary }} />
                                )}
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    NAS
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Microsoft Accounts */}
                        {usuario.cuentas?.microsoft && usuario.cuentas.microsoft.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 1 }}>
                                    Cuentas Microsoft:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {usuario.cuentas.microsoft.map((account) => (
                                        <Chip
                                            key={account}
                                            label={account}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </Grid>
                        )}

                        {/* Observaciones */}
                        {usuario.observacion && (
                            <>
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 0.5 }}>
                                        Observaciones
                                    </Typography>
                                    <Typography variant="body2">
                                        {usuario.observacion}
                                    </Typography>
                                </Grid>
                            </>
                        )}

                        {/* Equipos Asignados */}
                        {usuario.equiposAsignados && usuario.equiposAsignados.length > 0 && (
                            <>
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 2 }}>
                                        <ComputerIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.text.primary
                                            }}
                                        >
                                            Equipos Asignados ({usuario.equiposAsignados.length})
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                        Equipo
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                        Marca/Modelo
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                        Serie
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                        Fecha Asignación
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, color: theme.palette.text.primary, width: 50 }}>
                                                        Acción
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {usuario.equiposAsignados.map((asignacion) => (
                                                    <TableRow key={asignacion._id} hover>
                                                        <TableCell>{asignacion.equipo?.tipo}</TableCell>
                                                        <TableCell>
                                                            {asignacion.equipo?.marca} {asignacion.equipo?.modelo}
                                                        </TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.813rem' }}>
                                                            {asignacion.equipo?.serie}
                                                        </TableCell>
                                                        <TableCell>
                                                            {moment(asignacion.fechaAsignacion).format('DD/MM/YYYY')}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Tooltip title="Ver detalle del equipo">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleEquipoClick(asignacion.equipo._id)}
                                                                    sx={{
                                                                        color: theme.palette.primary.main,
                                                                        '&:hover': {
                                                                            backgroundColor: theme.palette.action.hover,
                                                                        },
                                                                    }}
                                                                >
                                                                    <OpenInNewIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </>
                        )}
                    </Grid>
                ) : null}
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette.surface?.main
                        : '#fafafa',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={onDelete}
                    sx={{
                        textTransform: 'none',
                    }}
                >
                    Eliminar
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        onClick={onClose}
                        sx={{
                            textTransform: 'none',
                            color: theme.palette.text.primary,
                        }}
                    >
                        Cerrar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={onEdit}
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
                        Editar
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default UsuarioDetailDialog;