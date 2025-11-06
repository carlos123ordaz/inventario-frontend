// src/pages/Actas/ActaDetailDialog.jsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Chip,
    Divider,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    Close as CloseIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CloudDownload as DownloadIcon,
    Description as DescriptionIcon,
    CalendarToday as CalendarIcon,
    Assessment as StatsIcon,
} from '@mui/icons-material';

const ActaDetailDialog = ({ open, onClose, acta, onEdit, onDelete }) => {
    if (!acta) return null;

    const getCategoriaColor = (categoria) => {
        const colors = {
            'usuario': '#2196f3',
            'equipo': '#4caf50',
            'general': '#ff9800',
        };
        return colors[categoria] || '#9e9e9e';
    };

    const handleDownload = () => {
        window.open(acta.archivoUrl, '_blank');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon sx={{ color: '#0854a0', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Detalle de Plantilla
                    </Typography>
                </Box>
                <IconButton edge="end" onClick={onClose} sx={{ color: '#6a6d70' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Información General */}
                    <Paper variant="outlined" sx={{ p: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#0854a0' }}>
                            Información General
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="caption" color="textSecondary">
                                    Título
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {acta.titulo}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="caption" color="textSecondary">
                                    Descripción
                                </Typography>
                                <Typography variant="body2">
                                    {acta.descripcion || 'Sin descripción'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="textSecondary">
                                    Estado
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip
                                        label={acta.estado}
                                        color={acta.estado === 'Activa' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="textSecondary">
                                    Archivo
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    {acta.archivoNombre}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Estadísticas de Uso */}
                    <Paper variant="outlined" sx={{ p: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#0854a0' }}>
                            <StatsIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                            Estadísticas de Uso
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f9fc', borderRadius: 1 }}>
                                    <Typography variant="h3" sx={{ color: '#0854a0', fontWeight: 500 }}>
                                        {acta.vecesUtilizada || 0}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Veces Utilizada
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="caption" color="textSecondary">
                                        <CalendarIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                        Último Uso
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                        {acta.ultimoUso
                                            ? new Date(acta.ultimoUso).toLocaleString('es-PE')
                                            : 'Nunca utilizada'
                                        }
                                    </Typography>

                                    <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                                        Fecha de Creación
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                        {new Date(acta.createdAt).toLocaleString('es-PE')}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Campos Identificados */}
                    {acta.camposIdentificados && acta.camposIdentificados.length > 0 && (
                        <Paper variant="outlined" sx={{ p: 2.5 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#0854a0' }}>
                                Campos Identificados ({acta.camposIdentificados.length})
                            </Typography>

                            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                <List dense>
                                    {acta.camposIdentificados.map((campo, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? '#fafafa' : 'transparent',
                                                borderRadius: 1,
                                                mb: 0.5,
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <DescriptionIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: getCategoriaColor(campo.categoria)
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontFamily: 'monospace',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {'{' + campo.nombre + '}'}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                                        <Chip
                                                            label={campo.categoria}
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '0.7rem',
                                                                backgroundColor: getCategoriaColor(campo.categoria),
                                                                color: '#fff'
                                                            }}
                                                        />
                                                        <Chip
                                                            label={campo.tipo}
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '0.7rem'
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Paper>
                    )}
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
                <Box>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={onDelete}
                        color="error"
                        sx={{ textTransform: 'none' }}
                    >
                        Eliminar
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        sx={{ textTransform: 'none' }}
                    >
                        Descargar
                    </Button>
                    <Button
                        startIcon={<EditIcon />}
                        onClick={onEdit}
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderColor: '#0854a0',
                            color: '#0854a0',
                        }}
                    >
                        Editar
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            backgroundColor: '#0854a0',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#0a6ed1',
                            },
                        }}
                    >
                        Cerrar
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ActaDetailDialog;