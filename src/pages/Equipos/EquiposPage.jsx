import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Toolbar,
    Tooltip,
    Menu,
    MenuItem,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Laptop as LaptopIcon,
    Computer as ComputerIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { equiposService } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EquipoFormDialog from './EquipoFormDialog';
import moment from 'moment';
import 'moment/locale/es';
import { useNavigate } from 'react-router-dom';

moment.locale('es');

const EquiposPage = () => {
    const navigate = useNavigate();

    // Estados
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [showFilters, setShowFilters] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Cargar equipos con filtros
    useEffect(() => {
        if (!isSearching) {
            loadEquipos();
        }
    }, [page, rowsPerPage, filterEstado, filterTipo, isSearching]);

    // Búsqueda en tiempo real con debounce
    useEffect(() => {
        if (searchTerm.trim()) {
            const delayDebounce = setTimeout(() => {
                handleSearch();
            }, 500); // Espera 500ms después de que el usuario deja de escribir

            return () => clearTimeout(delayDebounce);
        } else {
            setIsSearching(false);
            setPage(0);
        }
    }, [searchTerm]);

    const loadEquipos = async () => {
        try {
            setLoading(true);
            const response = await equiposService.filter({
                estado: filterEstado,
                equipo: filterTipo,
                page: page + 1,
                limit: rowsPerPage,
            });
            setEquipos(response.data);
            setTotalCount(response.pagination?.total || 0);
        } catch (error) {
            showNotification('Error al cargar equipos', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Buscar equipos por texto
    const handleSearch = async () => {
        const term = searchTerm.trim();

        if (!term) {
            setIsSearching(false);
            loadEquipos();
            return;
        }
        try {
            setLoading(true);
            setIsSearching(true);
            const response = await equiposService.search(term);
            let filteredData = response.data;
            if (filterEstado) {
                filteredData = filteredData.filter(e => e.estado === filterEstado);
            }
            if (filterTipo) {
                filteredData = filteredData.filter(e => e.equipo === filterTipo);
            }
            setEquipos(filteredData);
            setTotalCount(filteredData.length);
            setPage(0);
        } catch (error) {
            showNotification('Error en la búsqueda', 'error');
            setEquipos([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterEstado('');
        setFilterTipo('');
        setPage(0);
        setIsSearching(false);
    };

    // Limpiar solo búsqueda
    const handleClearSearch = () => {
        setSearchTerm('');
        setIsSearching(false);
        setPage(0);
    };

    // Abrir diálogo para crear
    const handleCreate = () => {
        setEditMode(false);
        setSelectedEquipo(null);
        setFormDialogOpen(true);
    };

    // Abrir diálogo para editar
    const handleEdit = (equipo) => {
        setEditMode(true);
        setSelectedEquipo(equipo);
        setFormDialogOpen(true);
        handleMenuClose();
    };

    // Eliminar equipo
    const handleDeleteClick = (equipo) => {
        setSelectedEquipo(equipo);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        try {
            await equiposService.delete(selectedEquipo._id);
            showNotification('Equipo eliminado correctamente', 'success');

            // Recargar según el modo actual
            if (isSearching && searchTerm.trim()) {
                handleSearch();
            } else {
                loadEquipos();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error al eliminar equipo';
            showNotification(message, 'error');
        } finally {
            setDeleteDialogOpen(false);
            setSelectedEquipo(null);
        }
    };

    // Manejar guardado del formulario
    const handleFormSuccess = () => {
        setFormDialogOpen(false);
        showNotification(
            editMode ? 'Equipo actualizado correctamente' : 'Equipo creado correctamente',
            'success'
        );

        // Recargar según el modo actual
        if (isSearching && searchTerm.trim()) {
            handleSearch();
        } else {
            loadEquipos();
        }
    };

    // Menú de acciones
    const handleMenuOpen = (event, equipo) => {
        event.stopPropagation(); // Evitar que se active el click de la fila
        setAnchorEl(event.currentTarget);
        setSelectedEquipo(equipo);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Paginación (solo funciona cuando no está buscando)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Notificaciones
    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        const colors = {
            'Disponible': 'success',
            'En Uso': 'info',
            'Mantenimiento': 'warning',
            'Dado de Baja': 'default',
            'Extraviado': 'error',
        };
        return colors[estado] || 'default';
    };

    // Obtener icono del tipo
    const getTipoIcon = (tipo) => {
        return tipo === 'Laptop' ? <LaptopIcon sx={{ fontSize: 20 }} /> : <ComputerIcon sx={{ fontSize: 20 }} />;
    };

    // Navegar al detalle
    const handleRowClick = (equipoId) => {
        navigate(`/equipos/${equipoId}`);
    };

    if (loading && equipos.length === 0) {
        return <LoadingSpinner />;
    }

    // Calcular equipos para la página actual (solo cuando está buscando)
    const displayedEquipos = isSearching
        ? equipos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : equipos;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header Section - Estilo SAP Fiori */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 400,
                        fontSize: '1.75rem',
                        color: '#32363a',
                        mb: 0.5,
                    }}
                >
                    Gestión de Equipos
                </Typography>
                <Typography variant="body2" sx={{ color: '#6a6d70' }}>
                    {totalCount} {totalCount === 1 ? 'equipo' : 'equipos'}
                    {isSearching && searchTerm && (
                        <Chip
                            label={`Buscando: "${searchTerm}"`}
                            size="small"
                            onDelete={handleClearSearch}
                            sx={{ ml: 1, height: 20 }}
                        />
                    )}
                </Typography>
            </Box>

            {/* Toolbar - Estilo SAP Fiori */}
            <Paper
                elevation={0}
                sx={{
                    mb: 2,
                    border: '1px solid #e5e5e5',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                }}
            >
                <Toolbar
                    sx={{
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        minHeight: 'auto !important',
                        backgroundColor: '#fafafa',
                    }}
                >
                    {/* Barra de búsqueda */}
                    <TextField
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{
                            flexGrow: 1,
                            minWidth: 250,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                '&:hover': {
                                    backgroundColor: '#fff',
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#6a6d70', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={handleClearSearch}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Botones de acción */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Filtros">
                            <IconButton
                                onClick={() => setShowFilters(!showFilters)}
                                sx={{
                                    border: '1px solid #e5e5e5',
                                    backgroundColor: showFilters ? '#0854a0' : '#fff',
                                    color: showFilters ? '#fff' : '#0854a0',
                                    '&:hover': {
                                        backgroundColor: showFilters ? '#0854a0' : '#f5f5f5',
                                    },
                                }}
                            >
                                <FilterListIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Actualizar">
                            <IconButton
                                onClick={() => {
                                    if (isSearching && searchTerm.trim()) {
                                        handleSearch();
                                    } else {
                                        loadEquipos();
                                    }
                                }}
                                sx={{
                                    border: '1px solid #e5e5e5',
                                    backgroundColor: '#fff',
                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                }}
                            >
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                            sx={{
                                backgroundColor: '#0854a0',
                                textTransform: 'none',
                                fontWeight: 400,
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#0a6ed1',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            Crear Equipo
                        </Button>
                    </Box>
                </Toolbar>

                {/* Panel de filtros colapsable */}
                {showFilters && (
                    <Box
                        sx={{
                            p: 2,
                            borderTop: '1px solid #e5e5e5',
                            backgroundColor: '#fff',
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            select
                            label="Estado"
                            value={filterEstado}
                            onChange={(e) => {
                                setFilterEstado(e.target.value);
                                setPage(0);
                            }}
                            size="small"
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="Disponible">Disponible</MenuItem>
                            <MenuItem value="En Uso">En Uso</MenuItem>
                            <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                            <MenuItem value="Dado de Baja">Dado de Baja</MenuItem>
                            <MenuItem value="Extraviado">Extraviado</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Tipo"
                            value={filterTipo}
                            onChange={(e) => {
                                setFilterTipo(e.target.value);
                                setPage(0);
                            }}
                            size="small"
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="Laptop">Laptop</MenuItem>
                            <MenuItem value="Desktop">Desktop</MenuItem>
                            <MenuItem value="PC">PC</MenuItem>
                        </TextField>

                        {(filterEstado || filterTipo) && (
                            <Button
                                variant="text"
                                size="small"
                                onClick={handleClearFilters}
                                sx={{
                                    textTransform: 'none',
                                    color: '#0854a0',
                                }}
                            >
                                Limpiar filtros
                            </Button>
                        )}
                    </Box>
                )}
            </Paper>

            {/* Tabla - Estilo SAP Fiori */}
            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #e5e5e5',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                }}
            >
                <TableContainer sx={{ flexGrow: 1 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#fafafa', fontWeight: 600, color: '#32363a' }}>
                                    Tipo
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fafafa', fontWeight: 600, color: '#32363a' }}>
                                    Marca / Modelo
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fafafa', fontWeight: 600, color: '#32363a' }}>
                                    Serie
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fafafa', fontWeight: 600, color: '#32363a' }}>
                                    Hostname
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fafafa', fontWeight: 600, color: '#32363a' }}>
                                    Estado
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fafafa', fontWeight: 600, color: '#32363a' }}>
                                    Especificaciones
                                </TableCell>
                                <TableCell sx={{ backgroundColor: '#fafafa', fontWeight: 600, color: '#32363a' }}>
                                    Usuario Asignado
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ backgroundColor: '#fafafa', fontWeight: 600, color: '#32363a', width: 80 }}
                                >
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                        <Typography color="text.secondary">Cargando...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : displayedEquipos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8, color: '#6a6d70' }}>
                                        {isSearching ? (
                                            <>
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    No se encontraron resultados para "{searchTerm}"
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    onClick={handleClearSearch}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Limpiar búsqueda
                                                </Button>
                                            </>
                                        ) : (
                                            'No se encontraron equipos'
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedEquipos.map((equipo) => (
                                    <TableRow
                                        key={equipo._id}
                                        hover
                                        onClick={() => handleRowClick(equipo._id)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f5f9fc',
                                            },
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getTipoIcon(equipo.equipo)}
                                                <Typography variant="body2">{equipo.equipo}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {equipo.marca}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#6a6d70' }}>
                                                {equipo.modelo}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.813rem' }}>
                                                {equipo.serie}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.813rem' }}>
                                                {equipo.host}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={equipo.estado}
                                                color={getEstadoColor(equipo.estado)}
                                                size="small"
                                                sx={{
                                                    fontWeight: 400,
                                                    fontSize: '0.75rem',
                                                    height: 24,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ display: 'block', color: '#32363a' }}>
                                                {equipo.procesador}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#6a6d70' }}>
                                                {equipo.memoria} | {equipo.almacenamiento}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {equipo.asignacionActual ? (
                                                <Typography variant="body2">
                                                    {equipo.asignacionActual.usuario?.nombreCompleto ||
                                                        `${equipo.asignacionActual.usuario?.nombre} ${equipo.asignacionActual.usuario?.apellido}`}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" sx={{ color: '#6a6d70', fontStyle: 'italic' }}>
                                                    Sin asignar
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, equipo)}
                                                sx={{ color: '#6a6d70' }}
                                            >
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
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
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    sx={{
                        borderTop: '1px solid #e5e5e5',
                        backgroundColor: '#fafafa',
                    }}
                />
            </Paper>

            {/* Menú de Acciones */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        minWidth: 180,
                        '& .MuiMenuItem-root': {
                            fontSize: '0.875rem',
                        },
                    },
                }}
            >
                <MenuItem onClick={() => handleEdit(selectedEquipo)}>
                    <EditIcon sx={{ mr: 1.5, fontSize: 18, color: '#6a6d70' }} />
                    Editar
                </MenuItem>
                <MenuItem onClick={() => handleDeleteClick(selectedEquipo)} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1.5, fontSize: 18 }} />
                    Eliminar
                </MenuItem>
            </Menu>

            {/* Diálogo de Formulario */}
            <EquipoFormDialog
                open={formDialogOpen}
                onClose={() => setFormDialogOpen(false)}
                onSuccess={handleFormSuccess}
                editMode={editMode}
                equipoData={selectedEquipo}
            />

            {/* Diálogo de Confirmación de Eliminación */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title="Eliminar Equipo"
                message={`¿Estás seguro de eliminar el equipo ${selectedEquipo?.marca} ${selectedEquipo?.modelo}? Esta acción no se puede deshacer.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialogOpen(false)}
            />

            {/* Notificaciones */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EquiposPage;