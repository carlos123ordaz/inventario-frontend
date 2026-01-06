import React, { useState, useEffect, useCallback } from 'react';
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
    Avatar,
    Tooltip,
    Menu,
    MenuItem,
    Alert,
    Snackbar,
    useTheme,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    MoreVert as MoreVertIcon,
    Clear as ClearIcon,
    Description as DescriptionIcon,
} from '@mui/icons-material';
import { usuariosService } from '../../api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import UsuarioFormDialog from './UsuarioFormDialog';
import UsuarioDetailDialog from './UsuarioDetailDialog';
import GenerarActaDialog from './GenerarActaDialog';
import { AREAS } from '../../constants';

const UsuariosPage = () => {
    const theme = useTheme();

    // Estados
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterArea, setFilterArea] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [generarActaDialogOpen, setGenerarActaDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [showFilters, setShowFilters] = useState(false);

    // Cargar usuarios
    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const response = await usuariosService.filter({
                estado: filterEstado,
                area: filterArea,
                page: page + 1,
                limit: rowsPerPage,
            });
            setUsuarios(response.data);
            setTotalCount(response.pagination?.total || 0);
        } catch (error) {
            showNotification(error.message || 'Error al cargar usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Buscar usuarios con debounce
    const handleSearch = useCallback(async (term) => {
        if (!term.trim()) {
            loadUsuarios();
            return;
        }

        try {
            setLoading(true);
            const response = await usuariosService.search(term);
            setUsuarios(response.data);
            setTotalCount(response.data.length);
        } catch (error) {
            showNotification(error.message || 'Error en la búsqueda', 'error');
        } finally {
            setLoading(false);
        }
    }, [filterEstado, filterArea, page, rowsPerPage]);

    // Effect para debounce en la búsqueda
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchTerm) {
                handleSearch(searchTerm);
            } else {
                loadUsuarios();
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    // Cargar usuarios cuando cambian los filtros o paginación
    useEffect(() => {
        if (!searchTerm) {
            loadUsuarios();
        }
    }, [page, rowsPerPage, filterEstado, filterArea]);

    // Limpiar filtros
    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterEstado('');
        setFilterArea('');
        setPage(0);
    };

    // Abrir diálogo para crear
    const handleCreate = () => {
        setEditMode(false);
        setSelectedUsuario(null);
        setFormDialogOpen(true);
    };

    // Abrir diálogo de detalle
    const handleView = (usuario) => {
        setSelectedUsuario(usuario);
        setDetailDialogOpen(true);
        handleMenuClose();
    };

    // Abrir diálogo para editar
    const handleEdit = (usuario) => {
        setEditMode(true);
        setSelectedUsuario(usuario);
        setFormDialogOpen(true);
        handleMenuClose();
    };

    // Abrir diálogo para generar acta
    const handleGenerarActa = (usuario) => {
        setSelectedUsuario(usuario);
        setGenerarActaDialogOpen(true);
        handleMenuClose();
    };

    // Eliminar usuario
    const handleDeleteClick = (usuario) => {
        setSelectedUsuario(usuario);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        try {
            await usuariosService.delete(selectedUsuario._id);
            showNotification(selectedUsuario.nombre || 'Usuario eliminado correctamente', 'success');
            loadUsuarios();
        } catch (error) {
            const message = error.response?.data?.message || 'Error al eliminar usuario';
            showNotification(message, 'error');
        } finally {
            setDeleteDialogOpen(false);
            setSelectedUsuario(null);
        }
    };

    // Manejar guardado del formulario
    const handleFormSuccess = () => {
        setFormDialogOpen(false);
        showNotification(
            editMode ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
            'success'
        );
        loadUsuarios();
    };

    // Menú de acciones
    const handleMenuOpen = (event, usuario) => {
        setAnchorEl(event.currentTarget);
        setSelectedUsuario(usuario);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Paginación
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
            'Activo': 'success',
            'Inactivo': 'default',
            'Suspendido': 'error',
            'Baja': 'error',
        };
        return colors[estado] || 'default';
    };

    // Obtener iniciales
    const getInitials = (nombre, apellido) => {
        return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
    };

    if (loading && usuarios.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 400,
                        fontSize: '1.75rem',
                        color: theme.palette.text.primary,
                        mb: 0.5,
                    }}
                >
                    Gestión de Usuarios
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {totalCount} {totalCount === 1 ? 'usuario' : 'usuarios'}
                </Typography>
            </Box>

            {/* Toolbar */}
            <Paper
                elevation={0}
                sx={{
                    mb: 2,
                    border: `1px solid ${theme.palette.divider}`,
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
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.surface?.main
                            : '#fafafa',
                    }}
                >
                    {/* Barra de búsqueda */}
                    <TextField
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{
                            flexGrow: 1,
                            minWidth: 250,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchTerm('')}>
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
                                    border: `1px solid ${theme.palette.divider}`,
                                    backgroundColor: showFilters
                                        ? theme.palette.primary.main
                                        : 'transparent',
                                    color: showFilters
                                        ? theme.palette.primary.contrastText
                                        : theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: showFilters
                                            ? theme.palette.primary.dark
                                            : theme.palette.action.hover,
                                    },
                                }}
                            >
                                <FilterIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Actualizar">
                            <IconButton
                                onClick={loadUsuarios}
                                sx={{
                                    border: `1px solid ${theme.palette.divider}`,
                                    '&:hover': { backgroundColor: theme.palette.action.hover },
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
                                backgroundColor: theme.palette.primary.main,
                                textTransform: 'none',
                                fontWeight: 500,
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            Crear Usuario
                        </Button>
                    </Box>
                </Toolbar>

                {/* Panel de filtros colapsable */}
                {showFilters && (
                    <Box
                        sx={{
                            p: 2,
                            borderTop: `1px solid ${theme.palette.divider}`,
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
                            onChange={(e) => setFilterEstado(e.target.value)}
                            size="small"
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="Activo">Activo</MenuItem>
                            <MenuItem value="Inactivo">Inactivo</MenuItem>
                            <MenuItem value="Suspendido">Suspendido</MenuItem>
                            <MenuItem value="Baja">Baja</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Área"
                            value={filterArea}
                            onChange={(e) => setFilterArea(e.target.value)}
                            size="small"
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">Todas</MenuItem>
                            {
                                AREAS.map((area) => (
                                    <MenuItem key={area} value={area}>{area}</MenuItem>
                                ))
                            }
                        </TextField>

                        <Button
                            variant="text"
                            size="small"
                            onClick={handleClearFilters}
                            sx={{
                                textTransform: 'none',
                                color: theme.palette.primary.main,
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Tabla */}
            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                }}
            >
                <TableContainer sx={{ flexGrow: 1 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Usuario
                                </TableCell>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    DNI
                                </TableCell>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Cargo
                                </TableCell>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Área
                                </TableCell>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Correo
                                </TableCell>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Teléfono
                                </TableCell>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Estado
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? theme.palette.surface?.main
                                            : '#fafafa',
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                        width: 80,
                                    }}
                                >
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8, color: theme.palette.text.secondary }}>
                                        No se encontraron usuarios
                                    </TableCell>
                                </TableRow>
                            ) : (
                                usuarios.map((usuario) => (
                                    <TableRow
                                        key={usuario._id}
                                        hover
                                        sx={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleView(usuario)}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: theme.palette.primary.main,
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {getInitials(usuario.nombre, usuario.apellido)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {usuario.nombreCompleto || `${usuario.nombre} ${usuario.apellido}`}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                        @{usuario.usuario}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{usuario.dni}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{usuario.cargo}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{usuario.area}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {usuario.correo}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{usuario.telefono}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={usuario.estado}
                                                color={getEstadoColor(usuario.estado)}
                                                size="small"
                                                sx={{
                                                    fontWeight: 400,
                                                    fontSize: '0.75rem',
                                                    height: 24,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMenuOpen(e, usuario);
                                                }}
                                                sx={{ color: theme.palette.text.secondary }}
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
                        borderTop: `1px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.surface?.main
                            : '#fafafa',
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
                <MenuItem onClick={() => handleView(selectedUsuario)}>
                    <VisibilityIcon sx={{ mr: 1.5, fontSize: 18, color: theme.palette.text.secondary }} />
                    Ver Detalle
                </MenuItem>
                <MenuItem onClick={() => handleGenerarActa(selectedUsuario)}>
                    <DescriptionIcon sx={{ mr: 1.5, fontSize: 18, color: theme.palette.text.secondary }} />
                    Generar Acta
                </MenuItem>
                <MenuItem onClick={() => handleEdit(selectedUsuario)}>
                    <EditIcon sx={{ mr: 1.5, fontSize: 18, color: theme.palette.text.secondary }} />
                    Editar
                </MenuItem>
                <MenuItem onClick={() => handleDeleteClick(selectedUsuario)} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1.5, fontSize: 18 }} />
                    Eliminar
                </MenuItem>
            </Menu>

            {/* Diálogo de Formulario */}
            <UsuarioFormDialog
                open={formDialogOpen}
                onClose={() => setFormDialogOpen(false)}
                onSuccess={handleFormSuccess}
                editMode={editMode}
                usuarioData={selectedUsuario}
            />

            {/* Diálogo de Detalle */}
            <UsuarioDetailDialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                usuario={selectedUsuario}
                onEdit={() => {
                    setDetailDialogOpen(false);
                    handleEdit(selectedUsuario);
                }}
                onDelete={() => {
                    setDetailDialogOpen(false);
                    handleDeleteClick(selectedUsuario);
                }}
            />

            {/* Diálogo de Generar Acta */}
            <GenerarActaDialog
                open={generarActaDialogOpen}
                onClose={(success) => {
                    setGenerarActaDialogOpen(false);
                    if (success) {
                        showNotification('Acta generada correctamente', 'success');
                    }
                }}
                usuario={selectedUsuario}
            />

            {/* Diálogo de Confirmación de Eliminación */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title="Eliminar Usuario"
                message={`¿Estás seguro de eliminar a ${selectedUsuario?.nombreCompleto || selectedUsuario?.nombre}? Esta acción no se puede deshacer.`}
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

export default UsuariosPage;