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
    Tooltip,
    useTheme,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon,
    Computer as ComputerIcon,
    Laptop as LaptopIcon,
    Memory as MemoryIcon,
    Storage as StorageIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
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
    PhoneAndroid as PhoneAndroidIcon,
    SimCard as SimCardIcon,
    Email as EmailIcon,
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
        celular: false,
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
            case 'Disponible': return 'success';
            case 'En Uso': return 'info';
            case 'Mantenimiento': return 'warning';
            case 'Dado de Baja': return 'default';
            case 'Extraviado': return 'error';
            default: return 'default';
        }
    };

    const getTipoIcon = (tipo) => {
        const iconColor = '#a29bfe';
        switch (tipo) {
            case 'LAPTOP': return <LaptopIcon sx={{ fontSize: 80, color: iconColor }} />;
            case 'DESKTOP': return <ComputerIcon sx={{ fontSize: 80, color: iconColor }} />;
            case 'MOUSE': return <MouseOutlined sx={{ fontSize: 80, color: iconColor }} />;
            case 'MONITOR': return <MonitorHeartOutlined sx={{ fontSize: 80, color: iconColor }} />;
            case 'COOLER': return <ColorLensRounded sx={{ fontSize: 80, color: iconColor }} />;
            case 'TECLADO': return <Keyboard sx={{ fontSize: 80, color: iconColor }} />;
            case 'CELULAR': return <PhoneAndroidIcon sx={{ fontSize: 80, color: iconColor }} />;
            default: return <ComputerIcon sx={{ fontSize: 80, color: iconColor }} />;
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
    const handleOpenReturn = () => setReturnDialogOpen(true);

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

    // ========== ESTILOS REUTILIZABLES ==========
    const cardSx = {
        border: '1px solid rgba(108, 92, 231, 0.12)',
        borderRadius: '0.5rem',
        backgroundColor: '#13131a',
    };

    const dialogHeaderSx = {
        backgroundColor: '#0a0a0f',
        borderBottom: '1px solid rgba(108, 92, 231, 0.12)',
    };

    const dialogFooterSx = {
        px: 3,
        py: 2,
        backgroundColor: '#0a0a0f',
        borderTop: '1px solid rgba(108, 92, 231, 0.12)',
    };

    const monoFieldSx = {
        fontFamily: '"JetBrains Mono", monospace',
        backgroundColor: '#0a0a0f',
        p: 1,
        borderRadius: 1,
        flex: 1,
        border: '1px solid rgba(108, 92, 231, 0.12)',
        color: '#e2e2e8',
    };

    // ========== COMPONENTE REUTILIZABLE PARA CLAVES ==========
    const ClaveSeguridad = ({ titulo, icono, usuario, contrasena, notas, campo }) => (
        <Card sx={{
            border: '1px solid rgba(108, 92, 231, 0.15)',
            backgroundColor: '#1a1a24',
            backgroundImage: 'none',
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#e2e2e8' }}>
                        {icono} {titulo}
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {usuario && (
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#7c7c8a' }}>
                                Usuario
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={monoFieldSx}>
                                    {usuario || '-'}
                                </Typography>
                                <Tooltip title={copiedField === `${campo}-user` ? '¡Copiado!' : 'Copiar'}>
                                    <IconButton size="small" onClick={() => copyToClipboard(usuario, `${campo}-user`)}>
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    )}
                    {contrasena && (
                        <Grid size={{ xs: 12, sm: usuario ? 6 : 12 }}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#7c7c8a' }}>
                                Contraseña
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={monoFieldSx}>
                                    {showPasswords[campo] ? contrasena : '••••••••'}
                                </Typography>
                                <Tooltip title={showPasswords[campo] ? 'Ocultar' : 'Mostrar'}>
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setShowPasswords(prev => ({ ...prev, [campo]: !prev[campo] }))
                                        }
                                    >
                                        {showPasswords[campo] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copiedField === `${campo}-pass` ? '¡Copiado!' : 'Copiar'}>
                                    <IconButton size="small" onClick={() => copyToClipboard(contrasena, `${campo}-pass`)}>
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    )}
                    {notas && (
                        <Grid size={12}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#7c7c8a' }}>
                                Notas
                            </Typography>
                            <Typography variant="body2" sx={{ ...monoFieldSx, fontFamily: 'inherit', color: '#7c7c8a' }}>
                                {notas || '-'}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );

    // ========== COMPONENTE CAMPO COPIABLE ==========
    const CampoCopiable = ({ label, value, icon, mono = true }) => (
        <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#7c7c8a' }}>
                {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon && <Box sx={{ color: '#7c7c8a', display: 'flex', alignItems: 'center' }}>{icon}</Box>}
                <Typography
                    variant="body2"
                    sx={{
                        ...monoFieldSx,
                        fontFamily: mono ? '"JetBrains Mono", monospace' : 'inherit',
                    }}
                >
                    {value || '-'}
                </Typography>
                {value && (
                    <Tooltip title={copiedField === `cel-${label}` ? '¡Copiado!' : 'Copiar'}>
                        <IconButton size="small" onClick={() => copyToClipboard(value, `cel-${label}`)}>
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
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
    if (loading) return <LoadingSpinner />;

    if (error && !equipo) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(ROUTES.EQUIPOS.LIST)}>Volver</Button>
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
    const esCelular = equipo.tipo === 'CELULAR';
    const tieneDatosCelular = esCelular && (
        equipo.phoneNumber || equipo.imei || equipo.codeSIM || equipo.puk || equipo.email || equipo.password
    );
    const tieneClaves = equipo.clavesBIOS?.contrasena ||
        equipo.clavesAdministrador?.contrasena ||
        equipo.clavesEquipo?.contrasena ||
        equipo.PIN?.valor;

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
            )}

            {/* ========== HEADER ========== */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate(ROUTES.EQUIPOS.LIST)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 400, fontSize: '1.75rem', color: '#e2e2e8' }}>
                        Detalle del Equipo
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {!isAsignado ? (
                        <Button variant="contained" startIcon={<AssignmentIndIcon />} onClick={handleOpenAssign}>
                            Asignar
                        </Button>
                    ) : (
                        <>
                            <Button variant="outlined" startIcon={<SwapHorizIcon />} onClick={handleOpenTransfer}>
                                Transferir
                            </Button>
                            <Button variant="outlined" startIcon={<AssignmentReturnIcon />} onClick={handleOpenReturn}>
                                Devolver
                            </Button>
                        </>
                    )}
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        Eliminar
                    </Button>
                </Box>
            </Box>

            {/* ========== CONTENIDO PRINCIPAL ========== */}
            <Grid container spacing={3}>
                {/* INFORMACIÓN PRINCIPAL */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ ...cardSx, p: 3, textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                margin: '0 auto 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(108, 92, 231, 0.08)',
                                borderRadius: 2,
                            }}
                        >
                            {getTipoIcon(equipo.tipo)}
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1, color: '#e2e2e8' }}>
                            {equipo.marca}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: '#7c7c8a' }}>
                            {equipo.modelo}
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                            <Chip label={equipo.estado} color={getEstadoColor(equipo.estado)} />
                            <Chip label={equipo.tipo} variant="outlined" />
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#7c7c8a', fontFamily: '"JetBrains Mono", monospace' }}>
                            Serie: {equipo.serie}
                        </Typography>
                        {equipo.host && (
                            <Typography variant="body2" sx={{ color: '#7c7c8a' }}>
                                Host: {equipo.hostname}
                            </Typography>
                        )}
                        {equipo.host && (
                            <Typography variant="body2" sx={{ color: '#7c7c8a' }}>
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
                                border: '1px solid rgba(108, 92, 231, 0.15)',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(108, 92, 231, 0.05)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon sx={{ mr: 1, color: '#6c5ce7' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e2e8' }}>
                                    Usuario Asignado
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, color: '#e2e2e8' }}>
                                {equipo.asignacionActual.usuario?.nombreCompleto ||
                                    `${equipo.asignacionActual.usuario?.nombre} ${equipo.asignacionActual.usuario?.apellido}`}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5, color: '#7c7c8a' }}>
                                {equipo.asignacionActual.usuario?.cargo}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#7c7c8a' }}>
                                Área: {equipo.asignacionActual.usuario?.area}
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography variant="caption" sx={{ display: 'block', color: '#7c7c8a' }}>
                                Tipo: {equipo.asignacionActual.tipoUso}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', color: '#7c7c8a' }}>
                                Desde: {moment(equipo.asignacionActual.fechaAsignacion).format('DD/MM/YYYY')}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', color: '#7c7c8a', fontFamily: '"JetBrains Mono", monospace' }}>
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
                            border: '1px solid rgba(0, 206, 201, 0.15)',
                            borderRadius: '0.5rem',
                            backgroundColor: 'rgba(0, 206, 201, 0.04)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ShoppingCartIcon sx={{ mr: 1, color: '#00cec9', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e2e8' }}>
                                Información del Proveedor
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            {equipo.proveedor.razonSocial && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#7c7c8a' }}>
                                        Razón Social
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8' }}>
                                        {equipo.proveedor.razonSocial}
                                    </Typography>
                                </Grid>
                            )}
                            {equipo.proveedor.ruc && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#7c7c8a' }}>
                                        RUC
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: '"JetBrains Mono", monospace', color: '#e2e2e8' }}>
                                        {equipo.proveedor.ruc}
                                    </Typography>
                                </Grid>
                            )}
                            {equipo.proveedor.nroFactura && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#7c7c8a' }}>
                                        Número de Factura
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: '"JetBrains Mono", monospace', color: '#e2e2e8' }}>
                                        {equipo.proveedor.nroFactura}
                                    </Typography>
                                </Grid>
                            )}
                            {equipo.proveedor.precioUnitario > 0 && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#7c7c8a' }}>
                                        Precio Unitario
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#00cec9', fontFamily: '"JetBrains Mono", monospace' }}>
                                        {equipo.proveedor.moneda} {equipo.proveedor.precioUnitario.toFixed(2)}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                )}

                {/* ========== INFORMACIÓN DEL CELULAR ========== */}
                {tieneDatosCelular && (
                    <Grid size={12}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid rgba(0, 184, 148, 0.2)',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(0, 184, 148, 0.04)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <PhoneAndroidIcon sx={{ fontSize: 24, color: '#00b894' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e2e8' }}>
                                    Información del Celular
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={2.5}>
                                {equipo.phoneNumber && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoCopiable
                                            label="Número de Teléfono"
                                            value={equipo.phoneNumber}
                                            icon={<PhoneAndroidIcon fontSize="small" />}
                                        />
                                    </Grid>
                                )}
                                {equipo.imei && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoCopiable
                                            label="IMEI"
                                            value={equipo.imei}
                                        />
                                    </Grid>
                                )}
                                {equipo.codeSIM && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoCopiable
                                            label="Código SIM"
                                            value={equipo.codeSIM}
                                            icon={<SimCardIcon fontSize="small" />}
                                        />
                                    </Grid>
                                )}
                                {equipo.puk && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoCopiable
                                            label="PUK"
                                            value={equipo.puk}
                                        />
                                    </Grid>
                                )}
                                {equipo.email && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoCopiable
                                            label="Email Asociado"
                                            value={equipo.email}
                                            icon={<EmailIcon fontSize="small" />}
                                            mono={false}
                                        />
                                    </Grid>
                                )}
                                {equipo.password && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#7c7c8a' }}>
                                                Contraseña
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" sx={monoFieldSx}>
                                                    {showPasswords.celular ? equipo.password : '••••••••'}
                                                </Typography>
                                                <Tooltip title={showPasswords.celular ? 'Ocultar' : 'Mostrar'}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            setShowPasswords(prev => ({ ...prev, celular: !prev.celular }))
                                                        }
                                                    >
                                                        {showPasswords.celular ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={copiedField === 'cel-password' ? '¡Copiado!' : 'Copiar'}>
                                                    <IconButton size="small" onClick={() => copyToClipboard(equipo.password, 'cel-password')}>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {/* ESPECIFICACIONES TÉCNICAS */}
                {equipo.procesador && (
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper elevation={0} sx={{ ...cardSx, p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#e2e2e8' }}>
                                Especificaciones Técnicas
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#7c7c8a' }}>Procesador</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <MemoryIcon sx={{ mr: 1, color: '#7c7c8a', fontSize: 20 }} />
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8' }}>
                                                {equipo.procesador}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#7c7c8a' }}>Memoria RAM</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <MemoryIcon sx={{ mr: 1, color: '#7c7c8a', fontSize: 20 }} />
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8' }}>
                                                {equipo.memoria}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#7c7c8a' }}>Almacenamiento</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <StorageIcon sx={{ mr: 1, color: '#7c7c8a', fontSize: 20 }} />
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8' }}>
                                                {equipo.almacenamiento}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {equipo.pantalla && (
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" sx={{ color: '#7c7c8a' }}>Pantalla</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                <VisibilityIcon sx={{ mr: 1, color: '#7c7c8a', fontSize: 20 }} />
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8' }}>
                                                    {equipo.pantalla}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                )}

                                {equipo.tarjetaGrafica && (
                                    <Grid size={12}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" sx={{ color: '#7c7c8a' }}>Tarjeta Gráfica</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                <VideocamIcon sx={{ mr: 1, color: '#7c7c8a', fontSize: 20 }} />
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8' }}>
                                                    {equipo.tarjetaGrafica}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                )}

                                {/* PUERTOS */}
                                <Grid size={12}>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#7c7c8a' }}>
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
                        <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#e2e2e8' }}>
                                Información Adicional
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" sx={{ color: '#7c7c8a' }}>Fecha de Registro</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8' }}>
                                        {equipo.createdAt ? moment(equipo.createdAt).format('DD/MM/YYYY') : 'No especificado'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" sx={{ color: '#7c7c8a' }}>Fecha de Compra</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8' }}>
                                        {equipo.fechaCompra ? moment.utc(equipo.fechaCompra).format('DD/MM/YYYY') : 'No especificado'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" sx={{ color: '#7c7c8a' }}>Antigüedad</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8', fontFamily: '"JetBrains Mono", monospace' }}>
                                        {equipo.fechaCompra
                                            ? `${moment().diff(moment(equipo.fechaCompra), 'years')} años`
                                            : 'No especificado'}
                                    </Typography>
                                </Grid>
                                {equipo.observaciones && (
                                    <Grid size={12}>
                                        <Typography variant="caption" sx={{ color: '#7c7c8a' }}>Observaciones</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#e2e2e8' }}>
                                            {equipo.observaciones}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {/* ========== SECCIÓN DE CLAVES DE SEGURIDAD ========== */}
                {tieneClaves && (
                    <Grid size={12}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '2px solid rgba(108, 92, 231, 0.3)',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(108, 92, 231, 0.04)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <LockIcon sx={{ fontSize: 24, color: '#6c5ce7' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e2e8' }}>
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
                    <Grid size={12}>
                        <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <HistoryIcon sx={{ mr: 1, color: '#6c5ce7' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e2e8' }}>
                                    Historial de Asignaciones
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {['Usuario', 'Área', 'Tipo de Uso', 'Fecha Asignación', 'Fecha Devolución', 'Tiempo de Uso', 'Estado'].map((h) => (
                                                <TableCell key={h}>{h}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {equipo.historial.map((asignacion) => (
                                            <TableRow key={asignacion._id} hover>
                                                <TableCell>
                                                    {asignacion.usuario?.nombreCompleto ||
                                                        `${asignacion.usuario?.nombre} ${asignacion.usuario?.apellido}`}
                                                </TableCell>
                                                <TableCell>{asignacion.usuario?.area}</TableCell>
                                                <TableCell>{asignacion.tipoUso}</TableCell>
                                                <TableCell>{moment(asignacion.fechaAsignacion).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell>
                                                    {asignacion.fechaDevolucion
                                                        ? moment(asignacion.fechaDevolucion).format('DD/MM/YYYY')
                                                        : '-'}
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
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

            {/* ========== DIÁLOGOS ========== */}

            {/* DIÁLOGO DE ASIGNACIÓN */}
            <Dialog open={assignDialogOpen} onClose={handleCloseAssign} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '0.5rem', border: '1px solid rgba(108, 92, 231, 0.12)' } }}
            >
                <DialogTitle sx={dialogHeaderSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIndIcon sx={{ color: '#6c5ce7' }} />
                        <Typography variant="h6" sx={{ fontWeight: 400, color: '#e2e2e8' }}>Asignar Equipo</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Typography variant="body2" sx={{ mb: 3, color: '#7c7c8a' }}>
                        Selecciona el usuario al que deseas asignar el equipo <strong style={{ color: '#e2e2e8' }}>{equipo.marca} {equipo.modelo}</strong>
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
                            <TextField {...params} label="Usuario" placeholder="Buscar usuario..." required fullWidth sx={{ mb: 2 }} />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#e2e2e8' }}>
                                        {option.nombreCompleto || `${option.nombre} ${option.apellido}`}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#7c7c8a' }}>
                                        {option.cargo} - {option.area}
                                    </Typography>
                                </Box>
                            </li>
                        )}
                    />

                    <TextField select label="Tipo de Uso" value={tipoUso} onChange={(e) => setTipoUso(e.target.value)} fullWidth sx={{ mb: 2 }}>
                        <MenuItem value="Asignación Definitiva">Asignación Definitiva</MenuItem>
                        <MenuItem value="Préstamo Temporal">Préstamo Temporal</MenuItem>
                        <MenuItem value="Uso en Proyecto">Uso en Proyecto</MenuItem>
                        <MenuItem value="Reemplazo Temporal">Reemplazo Temporal</MenuItem>
                    </TextField>

                    <TextField
                        label="Observaciones" value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        multiline rows={3} fullWidth placeholder="Notas adicionales sobre la asignación..."
                    />
                </DialogContent>
                <DialogActions sx={dialogFooterSx}>
                    <Button onClick={handleCloseAssign} disabled={submitting}>Cancelar</Button>
                    <Button onClick={handleAssign} variant="contained" disabled={submitting || !selectedUsuario}>
                        {submitting ? 'Asignando...' : 'Asignar Equipo'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIÁLOGO DE DEVOLUCIÓN */}
            <Dialog open={returnDialogOpen} onClose={handleCloseReturn} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '0.5rem', border: '1px solid rgba(108, 92, 231, 0.12)' } }}
            >
                <DialogTitle sx={dialogHeaderSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentReturnIcon sx={{ color: '#6c5ce7' }} />
                        <Typography variant="h6" sx={{ fontWeight: 400, color: '#e2e2e8' }}>Devolver Equipo</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        El equipo será devuelto y quedará disponible para una nueva asignación.
                    </Alert>
                    <Typography variant="body2" sx={{ mb: 2, color: '#e2e2e8' }}>
                        <strong>Equipo:</strong> {equipo.marca} {equipo.modelo}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: '#e2e2e8' }}>
                        <strong>Usuario actual:</strong>{' '}
                        {equipo.asignacionActual?.usuario?.nombreCompleto ||
                            `${equipo.asignacionActual?.usuario?.nombre} ${equipo.asignacionActual?.usuario?.apellido}`}
                    </Typography>
                    <TextField
                        label="Observaciones de devolución" value={observacionesDevolucion}
                        onChange={(e) => setObservacionesDevolucion(e.target.value)}
                        multiline rows={3} fullWidth placeholder="Estado del equipo, razón de devolución, etc..."
                    />
                </DialogContent>
                <DialogActions sx={dialogFooterSx}>
                    <Button onClick={handleCloseReturn} disabled={submitting}>Cancelar</Button>
                    <Button onClick={handleReturn} variant="contained" disabled={submitting}>
                        {submitting ? 'Procesando...' : 'Confirmar Devolución'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIÁLOGO DE TRANSFERENCIA */}
            <Dialog open={transferDialogOpen} onClose={handleCloseTransfer} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '0.5rem', border: '1px solid rgba(108, 92, 231, 0.12)' } }}
            >
                <DialogTitle sx={dialogHeaderSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SwapHorizIcon sx={{ color: '#6c5ce7' }} />
                        <Typography variant="h6" sx={{ fontWeight: 400, color: '#e2e2e8' }}>Transferir Equipo</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        El equipo será transferido del usuario actual al nuevo usuario seleccionado.
                    </Alert>
                    <Typography variant="body2" sx={{ mb: 2, color: '#e2e2e8' }}>
                        <strong>Equipo:</strong> {equipo.marca} {equipo.modelo}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: '#e2e2e8' }}>
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
                            <TextField {...params} label="Nuevo Usuario" placeholder="Buscar usuario..." required fullWidth sx={{ mb: 2 }} />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#e2e2e8' }}>
                                        {option.nombreCompleto || `${option.nombre} ${option.apellido}`}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#7c7c8a' }}>
                                        {option.cargo} - {option.area}
                                    </Typography>
                                </Box>
                            </li>
                        )}
                    />

                    <TextField
                        label="Observaciones" value={observacionesTransferencia}
                        onChange={(e) => setObservacionesTransferencia(e.target.value)}
                        multiline rows={3} fullWidth placeholder="Motivo de la transferencia..."
                    />
                </DialogContent>
                <DialogActions sx={dialogFooterSx}>
                    <Button onClick={handleCloseTransfer} disabled={submitting}>Cancelar</Button>
                    <Button onClick={handleTransfer} variant="contained" disabled={submitting || !nuevoUsuario}>
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