import React, { useState, useEffect, useContext } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Chip,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Autocomplete,
    Card,
    CardContent,
    InputAdornment,
    Tooltip,
    useTheme,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Computer as ComputerIcon,
    Laptop as LaptopIcon,
    Memory as MemoryIcon,
    Storage as StorageIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Usb as UsbIcon,
    Wifi as WifiIcon,
    Cable as CableIcon,
    Videocam as VideocamIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    History as HistoryIcon,
    Person as PersonIcon,
    AssignmentInd as AssignmentIndIcon,
    AssignmentReturn as AssignmentReturnIcon,
    SwapHoriz as SwapHorizIcon,
    Lock as LockIcon,
    ContentCopy as ContentCopyIcon,
    Keyboard,
    MouseOutlined,
    MonitorHeartOutlined,
    ColorLensRounded,
} from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/es';
import { equiposService, usuariosService, historialService } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ROUTES } from '../../routes/routes.constants';
import { MainContext } from '../../context/MainContextProvider';

moment.locale('es');

const EquipoDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { darkMode } = useContext(MainContext);

    // ========== ESTADOS PRINCIPALES ==========
    const [equipo, setEquipo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    // ========== ESTADOS DE DIÁLOGOS ==========
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);

    // ========== ESTADOS DE USUARIO ==========
    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // ========== ESTADOS DE ASIGNACIÓN ==========
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [tipoUso, setTipoUso] = useState('Asignación Definitiva');
    const [observaciones, setObservaciones] = useState('');

    // ========== ESTADOS DE DEVOLUCIÓN ==========
    const [observacionesDevolucion, setObservacionesDevolucion] = useState('');

    // ========== ESTADOS DE TRANSFERENCIA ==========
    const [nuevoUsuario, setNuevoUsuario] = useState(null);
    const [observacionesTransferencia, setObservacionesTransferencia] = useState('');

    // ========== ESTADOS DE SEGURIDAD ==========
    const [showPasswords, setShowPasswords] = useState({
        bios: false,
        admin: false,
        equipo: false,
        pin: false,
    });

    // ========== EFECTOS ==========
    useEffect(() => {
        loadEquipo();
    }, [id]);

    // ========== FUNCIONES DE CARGA ==========
    const loadEquipo = async () => {
        try {
            setLoading(true);
            const response = await equiposService.getById(id);
            setEquipo(response.data);
        } catch (error) {
            setError(error.message || 'Error al cargar la información del equipo');
        } finally {
            setLoading(false);
        }
    };

    const loadUsuarios = async () => {
        try {
            setLoadingUsuarios(true);
            const response = await usuariosService.filter({ estado: 'Activo', limit: 100 });
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        } finally {
            setLoadingUsuarios(false);
        }
    };

    // ========== FUNCIONES DE UTILIDAD ==========
    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Disponible':
                return 'success';
            case 'En Uso':
                return 'info';
            case 'Mantenimiento':
                return 'warning';
            case 'Dado de Baja':
                return 'default';
            case 'Extraviado':
                return 'error';
            default:
                return 'default';
        }
    };

    const getTipoIcon = (tipo) => {
        const iconColor = darkMode ? '#64B5F6' : '#0854a0';
        switch (tipo) {
            case 'LAPTOP':
                return <LaptopIcon sx={{ fontSize: 80, color: iconColor }} />;
            case 'DESKTOP':
                return <ComputerIcon sx={{ fontSize: 80, color: iconColor }} />;
            case 'MOUSE':
                return <MouseOutlined sx={{ fontSize: 80, color: iconColor }} />;
            case 'MONITOR':
                return <MonitorHeartOutlined sx={{ fontSize: 80, color: iconColor }} />;
            case 'COOLER':
                return <ColorLensRounded sx={{ fontSize: 80, color: iconColor }} />;
            case 'TECLADO':
                return <Keyboard sx={{ fontSize: 80, color: iconColor }} />;
            default:
                return <ComputerIcon sx={{ fontSize: 80, color: iconColor }} />;
        }
    };

    // ========== FUNCIONES DE ELIMINAR ==========
    const handleDelete = async () => {
        try {
            await equiposService.delete(id);
            navigate(ROUTES.EQUIPOS.LIST);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al eliminar equipo');
            setDeleteDialogOpen(false);
        }
    };

    // ========== FUNCIONES DE ASIGNACIÓN ==========
    const handleOpenAssign = () => {
        loadUsuarios();
        setAssignDialogOpen(true);
    };

    const handleCloseAssign = () => {
        setAssignDialogOpen(false);
        setSelectedUsuario(null);
        setTipoUso('Asignación Definitiva');
        setObservaciones('');
    };

    const handleAssign = async () => {
        if (!selectedUsuario) {
            alert('Por favor selecciona un usuario');
            return;
        }

        try {
            setSubmitting(true);
            await historialService.asignar({
                equipoId: id,
                usuarioId: selectedUsuario._id,
                tipoUso,
                observaciones,
            });
            setError(null);
            alert('Equipo asignado correctamente');
            handleCloseAssign();
            loadEquipo();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al asignar equipo');
        } finally {
            setSubmitting(false);
        }
    };

    // ========== FUNCIONES DE DEVOLUCIÓN ==========
    const handleOpenReturn = () => {
        setReturnDialogOpen(true);
    };

    const handleCloseReturn = () => {
        setReturnDialogOpen(false);
        setObservacionesDevolucion('');
    };

    const handleReturn = async () => {
        try {
            setSubmitting(true);
            await historialService.devolverPorEquipo(id, observacionesDevolucion);
            setError(null);
            alert('Equipo devuelto correctamente');
            handleCloseReturn();
            loadEquipo();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al devolver equipo');
        } finally {
            setSubmitting(false);
        }
    };

    // ========== FUNCIONES DE TRANSFERENCIA ==========
    const handleOpenTransfer = () => {
        loadUsuarios();
        setTransferDialogOpen(true);
    };

    const handleCloseTransfer = () => {
        setTransferDialogOpen(false);
        setNuevoUsuario(null);
        setObservacionesTransferencia('');
    };

    const handleTransfer = async () => {
        if (!nuevoUsuario) {
            alert('Por favor selecciona un usuario');
            return;
        }

        try {
            setSubmitting(true);
            await historialService.transferir({
                equipoId: id,
                nuevoUsuarioId: nuevoUsuario._id,
                observaciones: observacionesTransferencia,
            });
            setError(null);
            alert('Equipo transferido correctamente');
            handleCloseTransfer();
            loadEquipo();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al transferir equipo');
        } finally {
            setSubmitting(false);
        }
    };

    // ========== COMPONENTE REUTILIZABLE PARA CLAVES ==========
    const ClaveSeguridad = ({ titulo, icono, usuario, contrasena, notas, campo }) => (
        <Card sx={{
            border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
            backgroundColor: darkMode ? theme.palette.background.paper : '#fafafa'
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {icono} {titulo}
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {usuario && (
                        <Grid size={{ xs: 12 }} sm={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                Usuario
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: 'monospace',
                                        backgroundColor: darkMode ? theme.palette.background.default : '#fff',
                                        p: 1,
                                        borderRadius: 1,
                                        flex: 1,
                                        border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    {usuario || '-'}
                                </Typography>
                                <Tooltip title={copiedField === `${campo}-user` ? '¡Copiado!' : 'Copiar'}>
                                    <IconButton
                                        size="small"
                                        onClick={() => copyToClipboard(usuario, `${campo}-user`)}
                                    >
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    )}
                    {contrasena && (
                        <Grid size={{ xs: 12 }} sm={usuario ? 6 : 12}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                Contraseña
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: 'monospace',
                                        backgroundColor: darkMode ? theme.palette.background.default : '#fff',
                                        p: 1,
                                        borderRadius: 1,
                                        flex: 1,
                                        border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    {showPasswords[campo] ? contrasena : '••••••••'}
                                </Typography>
                                <Tooltip title={showPasswords[campo] ? 'Ocultar' : 'Mostrar'}>
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setShowPasswords(prev => ({
                                                ...prev,
                                                [campo]: !prev[campo],
                                            }))
                                        }
                                    >
                                        {showPasswords[campo] ? (
                                            <VisibilityOffIcon fontSize="small" />
                                        ) : (
                                            <VisibilityIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copiedField === `${campo}-pass` ? '¡Copiado!' : 'Copiar'}>
                                    <IconButton
                                        size="small"
                                        onClick={() => copyToClipboard(contrasena, `${campo}-pass`)}
                                    >
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    )}
                    {notas && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                Notas
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    backgroundColor: darkMode ? theme.palette.background.default : '#fff',
                                    p: 1,
                                    borderRadius: 1,
                                    border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {notas || '-'}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );

    // ========== COMPONENTE DE PUERTO ==========
    const PortIcon = ({ available, label }) => (
        <Chip
            icon={available ? <CheckIcon /> : <CloseIcon />}
            label={label}
            size="small"
            color={available ? 'success' : 'default'}
            variant={available ? 'filled' : 'outlined'}
        />
    );

    // ========== RENDERIZADO ==========
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error && !equipo) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(ROUTES.EQUIPOS.LIST)}>
                    Volver
                </Button>
            </Box>
        );
    }

    if (!equipo) {
        return (
            <Box>
                <Alert severity="warning">Equipo no encontrado</Alert>
            </Box>
        );
    }

    const isAsignado = equipo.asignacionActual && equipo.estado === 'En Uso';
    const tieneClaves = equipo.clavesBIOS?.contrasena ||
        equipo.clavesAdministrador?.contrasena ||
        equipo.clavesEquipo?.contrasena ||
        equipo.PIN?.valor;

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* ========== HEADER ==========*/}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate(ROUTES.EQUIPOS.LIST)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 400, fontSize: '1.75rem', color: theme.palette.text.primary }}>
                        Detalle del Equipo
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {!isAsignado ? (
                        <Button
                            variant="contained"
                            startIcon={<AssignmentIndIcon />}
                            onClick={handleOpenAssign}
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
                            Asignar
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outlined"
                                startIcon={<SwapHorizIcon />}
                                onClick={handleOpenTransfer}
                                sx={{
                                    textTransform: 'none',
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                }}
                            >
                                Transferir
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<AssignmentReturnIcon />}
                                onClick={handleOpenReturn}
                                sx={{
                                    textTransform: 'none',
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                }}
                            >
                                Devolver
                            </Button>
                        </>
                    )}

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                        sx={{ textTransform: 'none' }}
                    >
                        Eliminar
                    </Button>
                </Box>
            </Box>

            {/* ========== CONTENIDO PRINCIPAL ==========*/}
            <Grid container spacing={3}>
                {/* INFORMACIÓN PRINCIPAL */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                            borderRadius: '0.5rem',
                            textAlign: 'center',
                            backgroundColor: darkMode ? theme.palette.background.paper : 'white'
                        }}
                    >
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                margin: '0 auto 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: darkMode ? 'rgba(100, 181, 246, 0.1)' : '#f0f7ff',
                                borderRadius: 2,
                            }}
                        >
                            {getTipoIcon(equipo.tipo)}
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1, color: theme.palette.text.primary }}>
                            {equipo.marca}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {equipo.modelo}
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                            <Chip
                                label={equipo.estado}
                                color={getEstadoColor(equipo.estado)}
                            />
                            <Chip
                                label={equipo.tipo}
                                variant="outlined"
                            />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            Serie: {equipo.serie}
                        </Typography>
                        {equipo.host && (
                            <Typography variant="body2" color="text.secondary">
                                Host: {equipo.hostname}
                            </Typography>
                        )}
                        {equipo.host && (
                            <Typography variant="body2" color="text.secondary">
                                Hostname: {equipo.host}
                            </Typography>
                        )}
                    </Paper>

                    {/* USUARIO ASIGNADO */}
                    {equipo.asignacionActual && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                mt: 2,
                                border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                                borderRadius: '0.5rem',
                                backgroundColor: darkMode ? 'rgba(100, 181, 246, 0.05)' : '#f0f7ff',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Usuario Asignado
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, color: theme.palette.text.primary }}>
                                {equipo.asignacionActual.usuario?.nombreCompleto ||
                                    `${equipo.asignacionActual.usuario?.nombre} ${equipo.asignacionActual.usuario?.apellido}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {equipo.asignacionActual.usuario?.cargo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Área: {equipo.asignacionActual.usuario?.area}
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Tipo: {equipo.asignacionActual.tipoUso}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Desde: {moment(equipo.asignacionActual.fechaAsignacion).format('DD/MM/YYYY')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Tiempo: {equipo.asignacionActual.tiempoUso} días
                            </Typography>
                        </Paper>
                    )}
                </Grid>
                {/* INFORMACIÓN DEL PROVEEDOR */}
                {equipo.proveedor && (equipo.proveedor.razonSocial || equipo.proveedor.ruc || equipo.proveedor.nroFactura || equipo.proveedor.precioUnitario > 0) && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mt: 2,
                            border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                            borderRadius: '0.5rem',
                            backgroundColor: darkMode ? 'rgba(76, 175, 80, 0.05)' : '#f1f8f4',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ShoppingCartIcon sx={{ mr: 1, color: theme.palette.success.main, fontSize: 24 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                Información del Proveedor
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            {equipo.proveedor.razonSocial && (
                                <Grid size={{ xs: 12 }} sm={6}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        Razón Social
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                        {equipo.proveedor.razonSocial}
                                    </Typography>
                                </Grid>
                            )}

                            {equipo.proveedor.ruc && (
                                <Grid size={{ xs: 12 }} sm={6}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        RUC
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace', color: theme.palette.text.primary }}>
                                        {equipo.proveedor.ruc}
                                    </Typography>
                                </Grid>
                            )}

                            {equipo.proveedor.nroFactura && (
                                <Grid size={{ xs: 12 }} sm={6}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        Número de Factura
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace', color: theme.palette.text.primary }}>
                                        {equipo.proveedor.nroFactura}
                                    </Typography>
                                </Grid>
                            )}

                            {equipo.proveedor.precioUnitario > 0 && (
                                <Grid size={{ xs: 12 }} sm={6}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        Precio Unitario
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                                        {equipo.proveedor.moneda} {equipo.proveedor.precioUnitario.toFixed(2)}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                )}
                {/* ESPECIFICACIONES TÉCNICAS */}
                {equipo.procesador && (
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                                borderRadius: '0.5rem',
                                mb: 3,
                                backgroundColor: darkMode ? theme.palette.background.paper : 'white'
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
                                Especificaciones Técnicas
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Procesador
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <MemoryIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                                {equipo.procesador}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Memoria RAM
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <MemoryIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                                {equipo.memoria}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Almacenamiento
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <StorageIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                                {equipo.almacenamiento}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {equipo.pantalla && (
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Pantalla
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                <VisibilityIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                                    {equipo.pantalla}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                )}

                                {equipo.tarjetaGrafica && (
                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Tarjeta Gráfica
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                <VideocamIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                                    {equipo.tarjetaGrafica}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                )}

                                {/* PUERTOS */}
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                        Puertos y Conectividad
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        <PortIcon available={equipo.puertoRed} label="Puerto Red" />
                                        <PortIcon available={equipo.puertosUSB} label="USB" />
                                        <PortIcon available={equipo.puertoSerial} label="Serial" />
                                        <PortIcon available={equipo.puertoHDMI} label="HDMI" />
                                        <PortIcon available={equipo.puertoC} label="USB-C" />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* INFORMACIÓN ADICIONAL */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                                borderRadius: '0.5rem',
                                backgroundColor: darkMode ? theme.palette.background.paper : 'white'
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
                                Información Adicional
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Fecha de Registro
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                        {equipo.createdAt ? moment(equipo.createdAt).format('DD/MM/YYYY') : 'No especificado'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Fecha de Compra
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                        {equipo.fechaCompra ? moment.utc(equipo.fechaCompra).format('DD/MM/YYYY') : 'No especificado'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" color="text.secondary"> Antigüedad </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {equipo.fechaCompra
                                            ? `${moment().diff(moment(equipo.fechaCompra), 'years')} años`
                                            : 'No especificado'}
                                    </Typography>
                                </Grid>

                                {equipo.observaciones && (
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Observaciones
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                            {equipo.observaciones}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {/* ========== SECCIÓN DE CLAVES DE SEGURIDAD ==========*/}
                {tieneClaves && (
                    <Grid size={{ xs: 12 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: `2px solid ${theme.palette.primary.main}`,
                                borderRadius: '0.5rem',
                                backgroundColor: darkMode ? 'rgba(100, 181, 246, 0.05)' : '#f0f7ff',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <LockIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Claves de Seguridad
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={2}>
                                {equipo.clavesAdministrador?.contrasena && (
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <ClaveSeguridad
                                            titulo="Contraseña Administrador"
                                            icono="👤"
                                            usuario={equipo.clavesAdministrador?.usuario}
                                            contrasena={equipo.clavesAdministrador?.contrasena}
                                            notas={equipo.clavesAdministrador?.notas}
                                            campo="admin"
                                        />
                                    </Grid>
                                )}

                                {equipo.clavesEquipo?.contrasena && (
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <ClaveSeguridad
                                            titulo="Contraseña Usuario Equipo"
                                            icono="🖥️"
                                            usuario={equipo.clavesEquipo?.usuario}
                                            contrasena={equipo.clavesEquipo?.contrasena}
                                            notas={equipo.clavesEquipo?.notas}
                                            campo="equipo"
                                        />
                                    </Grid>
                                )}
                                {equipo.clavesBIOS?.contrasena && (
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <ClaveSeguridad
                                            titulo="Contraseña BIOS"
                                            icono="🔐"
                                            usuario={equipo.clavesBIOS?.usuario}
                                            contrasena={equipo.clavesBIOS?.contrasena}
                                            notas={equipo.clavesBIOS?.notas}
                                            campo="bios"
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {/* HISTORIAL DE ASIGNACIONES */}
                {equipo.historial && equipo.historial.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                                borderRadius: '0.5rem',
                                backgroundColor: darkMode ? theme.palette.background.paper : 'white'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <HistoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Historial de Asignaciones
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{
                                                backgroundColor: darkMode ? theme.palette.action.hover : '#fafafa',
                                                fontWeight: 600,
                                                color: theme.palette.text.primary
                                            }}>
                                                Usuario
                                            </TableCell>
                                            <TableCell sx={{
                                                backgroundColor: darkMode ? theme.palette.action.hover : '#fafafa',
                                                fontWeight: 600,
                                                color: theme.palette.text.primary
                                            }}>
                                                Área
                                            </TableCell>
                                            <TableCell sx={{
                                                backgroundColor: darkMode ? theme.palette.action.hover : '#fafafa',
                                                fontWeight: 600,
                                                color: theme.palette.text.primary
                                            }}>
                                                Tipo de Uso
                                            </TableCell>
                                            <TableCell sx={{
                                                backgroundColor: darkMode ? theme.palette.action.hover : '#fafafa',
                                                fontWeight: 600,
                                                color: theme.palette.text.primary
                                            }}>
                                                Fecha Asignación
                                            </TableCell>
                                            <TableCell sx={{
                                                backgroundColor: darkMode ? theme.palette.action.hover : '#fafafa',
                                                fontWeight: 600,
                                                color: theme.palette.text.primary
                                            }}>
                                                Fecha Devolución
                                            </TableCell>
                                            <TableCell sx={{
                                                backgroundColor: darkMode ? theme.palette.action.hover : '#fafafa',
                                                fontWeight: 600,
                                                color: theme.palette.text.primary
                                            }}>
                                                Tiempo de Uso
                                            </TableCell>
                                            <TableCell sx={{
                                                backgroundColor: darkMode ? theme.palette.action.hover : '#fafafa',
                                                fontWeight: 600,
                                                color: theme.palette.text.primary
                                            }}>
                                                Estado
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {equipo.historial.map((asignacion) => (
                                            <TableRow key={asignacion._id} hover>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>
                                                    {asignacion.usuario?.nombreCompleto ||
                                                        `${asignacion.usuario?.nombre} ${asignacion.usuario?.apellido}`}
                                                </TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>
                                                    {asignacion.usuario?.area}
                                                </TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>
                                                    {asignacion.tipoUso}
                                                </TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>
                                                    {moment(asignacion.fechaAsignacion).format('DD/MM/YYYY')}
                                                </TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>
                                                    {asignacion.fechaDevolucion
                                                        ? moment(asignacion.fechaDevolucion).format('DD/MM/YYYY')
                                                        : '-'}
                                                </TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>
                                                    {asignacion.tiempoUso} días
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={asignacion.activo ? 'Activo' : 'Finalizado'}
                                                        color={asignacion.activo ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* ========== DIÁLOGOS ==========*/}

            {/* DIÁLOGO DE ASIGNACIÓN */}
            <Dialog
                open={assignDialogOpen}
                onClose={handleCloseAssign}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '0.5rem',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: darkMode ? theme.palette.background.default : '#fafafa',
                        borderBottom: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIndIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="h6" sx={{ fontWeight: 400, color: theme.palette.text.primary }}>
                            Asignar Equipo
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Selecciona el usuario al que deseas asignar el equipo <strong>{equipo.marca} {equipo.modelo}</strong>
                    </Typography>

                    <Autocomplete
                        options={usuarios}
                        getOptionLabel={(option) =>
                            `${option.nombreCompleto || `${option.nombre} ${option.apellido}`} - ${option.area}`
                        }
                        value={selectedUsuario}
                        onChange={(event, newValue) => setSelectedUsuario(newValue)}
                        loading={loadingUsuarios}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Usuario"
                                placeholder="Buscar usuario..."
                                required
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <Box>
                                    <Typography variant="body2">
                                        {option.nombreCompleto || `${option.nombre} ${option.apellido}`}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {option.cargo} - {option.area}
                                    </Typography>
                                </Box>
                            </li>
                        )}
                    />

                    <TextField
                        select
                        label="Tipo de Uso"
                        value={tipoUso}
                        onChange={(e) => setTipoUso(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="Asignación Definitiva">Asignación Definitiva</MenuItem>
                        <MenuItem value="Préstamo Temporal">Préstamo Temporal</MenuItem>
                        <MenuItem value="Uso en Proyecto">Uso en Proyecto</MenuItem>
                        <MenuItem value="Reemplazo Temporal">Reemplazo Temporal</MenuItem>
                    </TextField>

                    <TextField
                        label="Observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Notas adicionales sobre la asignación..."
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        backgroundColor: darkMode ? theme.palette.background.default : '#fafafa',
                        borderTop: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                    }}
                >
                    <Button onClick={handleCloseAssign} disabled={submitting} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAssign}
                        variant="contained"
                        disabled={submitting || !selectedUsuario}
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
                        {submitting ? 'Asignando...' : 'Asignar Equipo'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIÁLOGO DE DEVOLUCIÓN */}
            <Dialog
                open={returnDialogOpen}
                onClose={handleCloseReturn}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '0.5rem',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: darkMode ? theme.palette.background.default : '#fafafa',
                        borderBottom: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentReturnIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="h6" sx={{ fontWeight: 400, color: theme.palette.text.primary }}>
                            Devolver Equipo
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        El equipo será devuelto y quedará disponible para una nueva asignación.
                    </Alert>

                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.primary }}>
                        <strong>Equipo:</strong> {equipo.marca} {equipo.modelo}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.primary }}>
                        <strong>Usuario actual:</strong>{' '}
                        {equipo.asignacionActual?.usuario?.nombreCompleto ||
                            `${equipo.asignacionActual?.usuario?.nombre} ${equipo.asignacionActual?.usuario?.apellido}`}
                    </Typography>

                    <TextField
                        label="Observaciones de devolución"
                        value={observacionesDevolucion}
                        onChange={(e) => setObservacionesDevolucion(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Estado del equipo, razón de devolución, etc..."
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        backgroundColor: darkMode ? theme.palette.background.default : '#fafafa',
                        borderTop: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                    }}
                >
                    <Button onClick={handleCloseReturn} disabled={submitting} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleReturn}
                        variant="contained"
                        disabled={submitting}
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
                        {submitting ? 'Procesando...' : 'Confirmar Devolución'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIÁLOGO DE TRANSFERENCIA */}
            <Dialog
                open={transferDialogOpen}
                onClose={handleCloseTransfer}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '0.5rem',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: darkMode ? theme.palette.background.default : '#fafafa',
                        borderBottom: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SwapHorizIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="h6" sx={{ fontWeight: 400, color: theme.palette.text.primary }}>
                            Transferir Equipo
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        El equipo será transferido del usuario actual al nuevo usuario seleccionado.
                    </Alert>

                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.primary }}>
                        <strong>Equipo:</strong> {equipo.marca} {equipo.modelo}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.primary }}>
                        <strong>Usuario actual:</strong>{' '}
                        {equipo.asignacionActual?.usuario?.nombreCompleto ||
                            `${equipo.asignacionActual?.usuario?.nombre} ${equipo.asignacionActual?.usuario?.apellido}`}
                    </Typography>

                    <Autocomplete
                        options={usuarios.filter((u) => u._id !== equipo.asignacionActual?.usuario?._id)}
                        getOptionLabel={(option) =>
                            `${option.nombreCompleto || `${option.nombre} ${option.apellido}`} - ${option.area}`
                        }
                        value={nuevoUsuario}
                        onChange={(event, newValue) => setNuevoUsuario(newValue)}
                        loading={loadingUsuarios}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Nuevo Usuario"
                                placeholder="Buscar usuario..."
                                required
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <Box>
                                    <Typography variant="body2">
                                        {option.nombreCompleto || `${option.nombre} ${option.apellido}`}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {option.cargo} - {option.area}
                                    </Typography>
                                </Box>
                            </li>
                        )}
                    />

                    <TextField
                        label="Observaciones"
                        value={observacionesTransferencia}
                        onChange={(e) => setObservacionesTransferencia(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Motivo de la transferencia..."
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        backgroundColor: darkMode ? theme.palette.background.default : '#fafafa',
                        borderTop: `1px solid ${darkMode ? theme.palette.divider : '#e5e5e5'}`,
                    }}
                >
                    <Button onClick={handleCloseTransfer} disabled={submitting} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleTransfer}
                        variant="contained"
                        disabled={submitting || !nuevoUsuario}
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
                        {submitting ? 'Transfiriendo...' : 'Confirmar Transferencia'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIÁLOGO DE ELIMINACIÓN */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title="Eliminar Equipo"
                message={`¿Estás seguro de eliminar el equipo ${equipo.marca} ${equipo.modelo}? Esta acción no se puede deshacer.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteDialogOpen(false)}
            />
        </Box>
    );
};

export default EquipoDetailPage;