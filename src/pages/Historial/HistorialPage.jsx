import React, { useState, useEffect } from 'react';

import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Grid,
    MenuItem,
    Avatar,
    useTheme,
} from '@mui/material';
import {
    FilterList as FilterIcon,
    Computer as ComputerIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { historialService } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const HistorialPage = () => {
    const theme = useTheme();

    // Estados
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filterActivo, setFilterActivo] = useState('');
    const [filterTipoUso, setFilterTipoUso] = useState('');

    // Cargar historial
    useEffect(() => {
        loadHistorial();
    }, [page, rowsPerPage, filterActivo, filterTipoUso]);

    const loadHistorial = async () => {
        try {
            setLoading(true);
            const filters = {
                page: page + 1,
                limit: rowsPerPage,
            };

            if (filterActivo !== '') {
                filters.activo = filterActivo === 'true';
            }

            const response = await historialService.filter(filters);
            setHistorial(response.data);
            setTotalCount(response.pagination?.total || 0);
        } catch (error) {
            console.error('Error al cargar historial:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getEstadoChip = (activo) => {
        return activo ? (
            <Chip
                icon={<CheckCircleIcon />}
                label="Activo"
                color="success"
                size="small"
            />
        ) : (
            <Chip
                icon={<CancelIcon />}
                label="Finalizado"
                color="default"
                size="small"
            />
        );
    };

    const getTipoUsoColor = (tipoUso) => {
        switch (tipoUso) {
            case 'Asignación Permanente':
                return 'primary';
            case 'Préstamo Temporal':
                return 'warning';
            case 'Mantenimiento':
                return 'info';
            case 'Prueba':
                return 'secondary';
            default:
                return 'default';
        }
    };

    if (loading && historial.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        Historial de Asignaciones
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Registro completo de todas las asignaciones de equipos
                </Typography>
            </Box>

            {/* Filtros */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label="Estado"
                            value={filterActivo}
                            onChange={(e) => setFilterActivo(e.target.value)}
                            size="small"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="true">Activos</MenuItem>
                            <MenuItem value="false">Finalizados</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label="Tipo de Uso"
                            value={filterTipoUso}
                            onChange={(e) => setFilterTipoUso(e.target.value)}
                            size="small"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="Asignación Permanente">Asignación Permanente</MenuItem>
                            <MenuItem value="Préstamo Temporal">Préstamo Temporal</MenuItem>
                            <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                            <MenuItem value="Prueba">Prueba</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FilterIcon />}
                            onClick={loadHistorial}
                            sx={{ textTransform: 'none' }}
                        >
                            Aplicar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla de Historial */}
            <Paper
                elevation={0}
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? theme.palette.surface?.main
                                    : '#f5f5f5'
                            }}
                        >
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Usuario
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Equipo
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Tipo de Uso
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Fecha Asignación
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Fecha Devolución
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Tiempo de Uso
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                    Estado
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historial.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No se encontraron registros
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                historial.map((registro) => (
                                    <TableRow
                                        key={registro._id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: theme.palette.mode === 'dark'
                                                    ? 'rgba(255, 255, 255, 0.05)'
                                                    : '#f9fafb',
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: theme.palette.primary.main,
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    {registro.usuario?.iniciales || 'U'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {registro.usuario?.nombreCompleto ||
                                                            `${registro.usuario?.nombre} ${registro.usuario?.apellido}`}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {registro.usuario?.area}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ComputerIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {registro.equipo?.marca} {registro.equipo?.modelo}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        S/N: {registro.equipo?.serie}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={registro.tipoUso}
                                                color={getTipoUsoColor(registro.tipoUso)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CalendarIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                                <Typography variant="body2">
                                                    {moment(registro.fechaAsignacion).format('DD/MM/YYYY')}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {moment(registro.fechaAsignacion).fromNow()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {registro.fechaDevolucion ? (
                                                <>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CalendarIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                                        <Typography variant="body2">
                                                            {moment(registro.fechaDevolucion).format('DD/MM/YYYY')}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {moment(registro.fechaDevolucion).fromNow()}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    -
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {registro.tiempoUso} días
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {getEstadoChip(registro.activo)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Paginación */}
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                    sx={{
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.surface?.main
                            : '#f5f5f5',
                    }}
                />
            </Paper>
        </Box>
    );
};

export default HistorialPage;