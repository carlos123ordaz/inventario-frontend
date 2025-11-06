// src/pages/Actas/ActaFormDialog.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Alert,
    Chip,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Close as CloseIcon,
    CloudUpload as UploadIcon,
    Description as DescriptionIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import actasService from '../../api/actasService';

const ActaFormDialog = ({ open, onClose, onSuccess, editMode, actaData }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        estado: 'Activa',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [campos, setCampos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            if (editMode && actaData) {
                setFormData({
                    titulo: actaData.titulo || '',
                    descripcion: actaData.descripcion || '',
                    estado: actaData.estado || 'Activa',
                });
                setCampos(actaData.camposIdentificados || []);
            } else {
                resetForm();
            }
        }
    }, [open, editMode, actaData]);

    const resetForm = () => {
        setFormData({
            titulo: '',
            descripcion: '',
            estado: 'Activa',
        });
        setSelectedFile(null);
        setCampos([]);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar que sea un archivo .docx
            if (!file.name.endsWith('.docx')) {
                setError('Solo se permiten archivos .docx');
                return;
            }

            // Validar tamaño (máximo 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('El archivo no debe superar los 10MB');
                return;
            }

            setSelectedFile(file);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo.trim()) {
            setError('El título es requerido');
            return;
        }

        if (!editMode && !selectedFile) {
            setError('Debe seleccionar un archivo');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (editMode) {
                // Modo edición - solo actualizar datos
                await actasService.update(actaData._id, formData);
            } else {
                // Modo creación - subir archivo y crear
                const formDataToSend = new FormData();
                formDataToSend.append('titulo', formData.titulo);
                formDataToSend.append('descripcion', formData.descripcion);
                formDataToSend.append('estado', formData.estado);
                formDataToSend.append('archivo', selectedFile);

                await actasService.create(formDataToSend);
            }

            onSuccess();
            handleClose();
        } catch (error) {
            const message = error.response?.data?.message || 'Error al procesar la solicitud';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            onClose();
        }
    };

    const getCategoriaColor = (categoria) => {
        const colors = {
            'usuario': '#2196f3',
            'equipo': '#4caf50',
            'general': '#ff9800',
        };
        return colors[categoria] || '#9e9e9e';
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
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
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {editMode ? 'Editar Plantilla de Acta' : 'Nueva Plantilla de Acta'}
                </Typography>
                <IconButton
                    edge="end"
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ color: '#6a6d70' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ py: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Título */}
                        <TextField
                            name="titulo"
                            label="Título"
                            value={formData.titulo}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={loading}
                            placeholder="Ej: Acta de Entrega de Equipo"
                        />

                        {/* Descripción */}
                        <TextField
                            name="descripcion"
                            label="Descripción"
                            value={formData.descripcion}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            disabled={loading}
                            placeholder="Descripción breve de la plantilla..."
                        />

                        {/* Estado (solo en edición) */}
                        {editMode && (
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    label="Estado"
                                    disabled={loading}
                                >
                                    <MenuItem value="Activa">Activa</MenuItem>
                                    <MenuItem value="Inactiva">Inactiva</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {/* Carga de archivo (solo en creación) */}
                        {!editMode && (
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    borderStyle: 'dashed',
                                    borderWidth: 2,
                                    borderColor: selectedFile ? '#2196f3' : '#e0e0e0',
                                    backgroundColor: selectedFile ? '#f5f9fc' : '#fafafa',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        borderColor: '#2196f3',
                                        backgroundColor: '#f5f9fc',
                                    }
                                }}
                                onClick={() => document.getElementById('file-input').click()}
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".docx"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    disabled={loading}
                                />

                                {selectedFile ? (
                                    <Box>
                                        <CheckIcon sx={{ fontSize: 48, color: '#2196f3', mb: 1 }} />
                                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                                            {selectedFile.name}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {(selectedFile.size / 1024).toFixed(2)} KB
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <UploadIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 1 }} />
                                        <Typography variant="body1" sx={{ mb: 0.5 }}>
                                            Haz clic para seleccionar un archivo
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Solo archivos .docx (máximo 10MB)
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        )}

                        {/* Información sobre campos */}
                        <Alert severity="info" sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Cómo usar plantillas:</strong>
                            </Typography>
                            <Typography variant="caption" component="div">
                                En tu documento Word, utiliza llaves dobles para definir campos. Ejemplos:
                            </Typography>
                            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                                <Typography component="li" variant="caption">
                                    <code>{'{usuario_nombreCompleto}'}</code> - Nombre completo del usuario
                                </Typography>
                                <Typography component="li" variant="caption">
                                    <code>{'{usuario_dni}'}</code> - DNI del usuario
                                </Typography>
                                <Typography component="li" variant="caption">
                                    <code>{'{equipo_marca}'}</code> - Marca del equipo
                                </Typography>
                                <Typography component="li" variant="caption">
                                    <code>{'{equipo_serie}'}</code> - Serie del equipo
                                </Typography>
                                <Typography component="li" variant="caption">
                                    <code>{'{fecha_actual}'}</code> - Fecha actual
                                </Typography>
                            </Box>
                        </Alert>

                        {/* Mostrar campos identificados (en edición) */}
                        {editMode && campos.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Campos Identificados ({campos.length})
                                </Typography>
                                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    <List dense>
                                        {campos.map((campo, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem>
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
                                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
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
                                                {index < campos.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#0854a0',
                            textTransform: 'none',
                            minWidth: 100,
                            '&:hover': {
                                backgroundColor: '#0a6ed1',
                            },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: '#fff' }} />
                        ) : (
                            editMode ? 'Actualizar' : 'Crear Plantilla'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ActaFormDialog;