import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';
import { usuariosService } from '../../api';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const UsuarioDetailDialog = ({ open, onClose, usuario: usuarioProp, onEdit, onDelete }) => {
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
            'Suspendido': 'error',
        };
        return colors[estado] || 'default';
    };

    const getInitials = (nombre, apellido) => {
        return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
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
                    backgroundColor: '#fafafa',
                    borderBottom: '1px solid #e5e5e5',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 400, color: '#32363a' }}>
                    Detalle del Usuario
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
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
                                        backgroundColor: '#0854a0',
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

                        {/* Información Personal */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#32363a', mb: 2 }}>
                                Información Personal
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <BadgeIcon sx={{ color: '#6a6d70', fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6a6d70', display: 'block' }}>
                                        DNI
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {usuario.dni}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PersonIcon sx={{ color: '#6a6d70', fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6a6d70', display: 'block' }}>
                                        Iniciales
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {usuario.iniciales}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Información Laboral */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#32363a', mb: 2, mt: 2 }}>
                                Información Laboral
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <WorkIcon sx={{ color: '#6a6d70', fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6a6d70', display: 'block' }}>
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
                                <BusinessIcon sx={{ color: '#6a6d70', fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6a6d70', display: 'block' }}>
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
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#32363a', mb: 2, mt: 2 }}>
                                Información de Contacto
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <EmailIcon sx={{ color: '#6a6d70', fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6a6d70', display: 'block' }}>
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
                                <PhoneIcon sx={{ color: '#6a6d70', fontSize: 20 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#6a6d70', display: 'block' }}>
                                        Teléfono
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {usuario.telefono}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Observaciones */}
                        {usuario.observacion && (
                            <>
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" sx={{ color: '#6a6d70', display: 'block', mb: 0.5 }}>
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
                                        <ComputerIcon sx={{ color: '#0854a0', fontSize: 20 }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#32363a' }}>
                                            Equipos Asignados ({usuario.equiposAsignados.length})
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Equipo</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Marca/Modelo</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Serie</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Fecha Asignación</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {usuario.equiposAsignados.map((asignacion) => (
                                                    <TableRow key={asignacion._id}>
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
                    backgroundColor: '#fafafa',
                    borderTop: '1px solid #e5e5e5',
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
                            color: '#32363a',
                        }}
                    >
                        Cerrar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={onEdit}
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
                        Editar
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default UsuarioDetailDialog;