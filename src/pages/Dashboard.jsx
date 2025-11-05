import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    Avatar,
    Chip,
    IconButton,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
} from '@mui/material';
import {
    Computer as ComputerIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    TrendingUp as TrendingUpIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Laptop as LaptopIcon,
    DesktopWindows as DesktopIcon,
} from '@mui/icons-material';
import { equiposService, usuariosService, historialService } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTES } from '../routes/routes.constants';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEquipos: 0,
        disponibles: 0,
        enUso: 0,
        mantenimiento: 0,
        totalUsuarios: 0,
        asignacionesActivas: 0,
    });
    const [equiposStats, setEquiposStats] = useState(null);
    const [historialStats, setHistorialStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [equiposRes, usuariosRes, historialRes, actividadRes] = await Promise.all([
                equiposService.getEstadisticas(),
                usuariosService.getAll(),
                historialService.getEstadisticas(),
                historialService.filter({ limit: 5, page: 1 }),
            ]);

            // Estadísticas generales
            setStats({
                totalEquipos: equiposRes.data.resumen.totalEquipos,
                disponibles: equiposRes.data.resumen.disponibles,
                enUso: equiposRes.data.resumen.enUso,
                mantenimiento: equiposRes.data.resumen.enMantenimiento,
                totalUsuarios: usuariosRes.data.length,
                asignacionesActivas: historialRes.data.resumen.asignacionesActivas,
            });

            setEquiposStats(equiposRes.data);
            setHistorialStats(historialRes.data);
            setRecentActivity(actividadRes.data);
        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
        <Card
            elevation={0}
            sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                '&:hover': onClick ? {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                } : {},
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 600, color, mb: 0.5 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Avatar
                        sx={{
                            backgroundColor: `${color}15`,
                            color: color,
                            width: 56,
                            height: 56,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#354a5f', mb: 1 }}>
                    Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Bienvenido al sistema de gestión de inventario de equipos
                </Typography>
            </Box>

            {/* Estadísticas principales */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total de Equipos"
                        value={stats.totalEquipos}
                        icon={<ComputerIcon sx={{ fontSize: 28 }} />}
                        color="#0070f3"
                        subtitle="En inventario"
                        onClick={() => navigate(ROUTES.EQUIPOS.LIST)}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Equipos Disponibles"
                        value={stats.disponibles}
                        icon={<CheckCircleIcon sx={{ fontSize: 28 }} />}
                        color="#2e7d32"
                        subtitle="Listos para asignar"
                        onClick={() => navigate(ROUTES.EQUIPOS.LIST)}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Equipos en Uso"
                        value={stats.enUso}
                        icon={<AssignmentIcon sx={{ fontSize: 28 }} />}
                        color="#ed6c02"
                        subtitle="Asignados actualmente"
                        onClick={() => navigate(ROUTES.ASIGNACIONES.LIST)}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Usuarios"
                        value={stats.totalUsuarios}
                        icon={<PeopleIcon sx={{ fontSize: 28 }} />}
                        color="#9c27b0"
                        subtitle="Registrados"
                        onClick={() => navigate(ROUTES.USUARIOS.LIST)}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Distribución por tipo de equipo */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Distribución por Tipo
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {equiposStats?.porTipo.map((item) => (
                            <Box key={item._id} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {item._id === 'Laptop' ? (
                                            <LaptopIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                                        ) : (
                                            <DesktopIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                                        )}
                                        <Typography variant="body2">{item._id}</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {item.cantidad}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={(item.cantidad / stats.totalEquipos) * 100}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: '#e0e0e0',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#0070f3',
                                        },
                                    }}
                                />
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Top marcas */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Top Marcas
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {equiposStats?.porMarca.slice(0, 5).map((item, index) => (
                            <Box
                                key={item._id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 1.5,
                                    backgroundColor: index === 0 ? '#f0f7ff' : '#f5f5f5',
                                    borderRadius: 1,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            backgroundColor: index === 0 ? '#0070f3' : '#757575',
                                            mr: 1.5,
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {index + 1}
                                    </Avatar>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {item._id}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={item.cantidad}
                                    size="small"
                                    color={index === 0 ? 'primary' : 'default'}
                                />
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Estado de equipos */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Estado de Equipos
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 20, color: '#2e7d32', mr: 1 }} />
                                    <Typography variant="body2">Disponibles</Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                                    {stats.disponibles}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AssignmentIcon sx={{ fontSize: 20, color: '#0070f3', mr: 1 }} />
                                    <Typography variant="body2">En Uso</Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0070f3' }}>
                                    {stats.enUso}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <WarningIcon sx={{ fontSize: 20, color: '#ed6c02', mr: 1 }} />
                                    <Typography variant="body2">Mantenimiento</Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ed6c02' }}>
                                    {stats.mantenimiento}
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                mt: 3,
                                p: 2,
                                backgroundColor: '#f0f7ff',
                                borderRadius: 1,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Tasa de utilización
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#0070f3' }}>
                                {stats.totalEquipos > 0
                                    ? Math.round((stats.enUso / stats.totalEquipos) * 100)
                                    : 0}%
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Actividad reciente */}
                <Grid size={{ xs: 12 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Actividad Reciente
                            </Typography>
                            <Button
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate(ROUTES.HISTORIAL.LIST)}
                                sx={{ textTransform: 'none' }}
                            >
                                Ver todo
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Equipo</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Acción</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentActivity.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                <Typography color="text.secondary">
                                                    No hay actividad reciente
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recentActivity.map((activity) => (
                                            <TableRow key={activity._id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                backgroundColor: '#0070f3',
                                                                fontSize: '0.75rem',
                                                                mr: 1,
                                                            }}
                                                        >
                                                            {activity.usuario?.iniciales}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {activity.usuario?.nombre} {activity.usuario?.apellido}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {activity.usuario?.area}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {activity.equipo?.marca} {activity.equipo?.modelo}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {activity.equipo?.serie}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={activity.tipoUso}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {moment(activity.fechaAsignacion).format('DD/MM/YYYY')}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {moment(activity.fechaAsignacion).fromNow()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={activity.activo ? 'Activo' : 'Finalizado'}
                                                        color={activity.activo ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>


            </Grid>
        </Box>
    );
};

export default Dashboard;