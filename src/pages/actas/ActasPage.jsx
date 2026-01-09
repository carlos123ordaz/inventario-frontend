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
    Card,
    CardContent,
    Grid,
    useTheme,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    MoreVert as MoreVertIcon,
    Clear as ClearIcon,
    Description as DescriptionIcon,
    CloudDownload as CloudDownloadIcon,
    InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import actasService from '../../api/actasService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ActaFormDialog from './ActaFormDialog';
import ActaDetailDialog from './ActaDetailDialog';

const ActasPage = () => {
    const theme = useTheme();

    // Estados
    const [actas, setActas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedActa, setSelectedActa] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [estadisticas, setEstadisticas] = useState(null);

    // Cargar actas
    const loadActas = async () => {
        try {
            setLoading(true);
            const response = await actasService.filter({
                estado: filterEstado,
                page: page + 1,
                limit: rowsPerPage,
            });
            setActas(response.data);
            setTotalCount(response.pagination?.total || 0);
        } catch (error) {
            showNotification(error.message || 'Error al cargar actas', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Cargar estadísticas
    const loadEstadisticas = async () => {
        try {
            const response = await actasService.getStatistics();
            setEstadisticas(response.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    // Effects
    useEffect(() => {
        loadActas();
    }, [page, rowsPerPage, filterEstado]);

    useEffect(() => {
        loadEstadisticas();
    }, []);

    // Búsqueda con filtro local
    const actasFiltradas = actas.filter(acta => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            acta.titulo?.toLowerCase().includes(term) ||
            acta.descripcion?.toLowerCase().includes(term)
        );
    });

    // Abrir diálogo para crear
    const handleCreate = () => {
        setEditMode(false);
        setSelectedActa(null);
        setFormDialogOpen(true);
    };

    // Abrir diálogo de detalle
    const handleView = (acta) => {
        setSelectedActa(acta);
        setDetailDialogOpen(true);
        handleMenuClose();
    };

    // Abrir diálogo para editar
    const handleEdit = (acta) => {
        setEditMode(true);
        setSelectedActa(acta);
        setFormDialogOpen(true);
        handleMenuClose();
    };

    // Eliminar acta
    const handleDeleteClick = (acta) => {
        setSelectedActa(acta);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        try {
            await actasService.delete(selectedActa._id);
            showNotification('Acta eliminada correctamente', 'success');
            loadActas();
            loadEstadisticas();
        } catch (error) {
            const message = error.response?.data?.message || 'Error al eliminar acta';
            showNotification(message, 'error');
        } finally {
            setDeleteDialogOpen(false);
            setSelectedActa(null);
        }
    };

    // Manejar guardado del formulario
    const handleFormSuccess = () => {
        setFormDialogOpen(false);
        showNotification(
            editMode ? 'Acta actualizada correctamente' : 'Acta creada correctamente',
            'success'
        );
        loadActas();
        loadEstadisticas();
    };

    // Menú de acciones
    const handleMenuOpen = (event, acta) => {
        setAnchorEl(event.currentTarget);
        setSelectedActa(acta);
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
        return estado === 'Activa' ? 'success' : 'default';
    };

    // Descargar template
    const handleDownloadTemplate = (acta) => {
        window.open(acta.archivoUrl, '_blank');
        handleMenuClose();
    };

    if (loading && actas.length === 0) {
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
                    Gestión de Actas
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {totalCount} {totalCount === 1 ? 'plantilla' : 'plantillas'} registradas
                </Typography>
            </Box>

            {/* Tarjetas de Estadísticas */}
            {estadisticas && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Total Plantillas
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{ color: theme.palette.primary.main, fontWeight: 500 }}
                                >
                                    {estadisticas.resumen.totalActas}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Activas
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{ color: theme.palette.success.main, fontWeight: 500 }}
                                >
                                    {estadisticas.resumen.actasActivas}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Actas Generadas
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{ color: theme.palette.warning.main, fontWeight: 500 }}
                                >
                                    {estadisticas.resumen.totalGeneradas}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Más Usada
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
                                    {estadisticas.actasMasUsadas[0]?.titulo || 'N/A'}
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

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
                        placeholder="Buscar actas..."
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
                        <Tooltip title="Actualizar">
                            <IconButton
                                onClick={() => {
                                    loadActas();
                                    loadEstadisticas();
                                }}
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
                            Nueva Plantilla
                        </Button>
                    </Box>
                </Toolbar>
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
                                    Título
                                </TableCell>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Descripción
                                </TableCell>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Campos
                                </TableCell>
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Veces Usada
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
                                <TableCell sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.surface?.main
                                        : '#fafafa',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}>
                                    Fecha Creación
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
                            {actasFiltradas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8, color: theme.palette.text.secondary }}>
                                        <FileIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                                        <Typography>No se encontraron plantillas de actas</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                actasFiltradas.map((acta) => (
                                    <TableRow
                                        key={acta._id}
                                        hover
                                        sx={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleView(acta)}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <DescriptionIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {acta.titulo}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {acta.descripcion || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`${acta.camposIdentificados?.length || 0} campos`}
                                                size="small"
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {acta.vecesUtilizada || 0}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={acta.estado}
                                                color={getEstadoColor(acta.estado)}
                                                size="small"
                                                sx={{ fontSize: '0.75rem', height: 24 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {new Date(acta.createdAt).toLocaleDateString('es-PE')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMenuOpen(e, acta);
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
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
                    sx: { minWidth: 180 },
                }}
            >
                <MenuItem onClick={() => handleView(selectedActa)}>
                    <VisibilityIcon sx={{ mr: 1.5, fontSize: 18, color: theme.palette.text.secondary }} />
                    Ver Detalle
                </MenuItem>
                <MenuItem onClick={() => handleDownloadTemplate(selectedActa)}>
                    <CloudDownloadIcon sx={{ mr: 1.5, fontSize: 18, color: theme.palette.text.secondary }} />
                    Descargar Template
                </MenuItem>
                <MenuItem onClick={() => handleEdit(selectedActa)}>
                    <EditIcon sx={{ mr: 1.5, fontSize: 18, color: theme.palette.text.secondary }} />
                    Editar
                </MenuItem>
                <MenuItem onClick={() => handleDeleteClick(selectedActa)} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1.5, fontSize: 18 }} />
                    Eliminar
                </MenuItem>
            </Menu>

            {/* Diálogos */}
            <ActaFormDialog
                open={formDialogOpen}
                onClose={() => setFormDialogOpen(false)}
                onSuccess={handleFormSuccess}
                editMode={editMode}
                actaData={selectedActa}
            />

            <ActaDetailDialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                acta={selectedActa}
                onEdit={() => {
                    setDetailDialogOpen(false);
                    handleEdit(selectedActa);
                }}
                onDelete={() => {
                    setDetailDialogOpen(false);
                    handleDeleteClick(selectedActa);
                }}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Eliminar Plantilla de Acta"
                message={`¿Estás seguro de eliminar la plantilla "${selectedActa?.titulo}"? Esta acción no se puede deshacer.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialogOpen(false)}
            />

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
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ActasPage;