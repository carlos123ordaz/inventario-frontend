// src/pages/Usuarios/GenerarActaDialog.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Divider,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Card,
    CardContent,
    CardActionArea,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    Close as CloseIcon,
    Description as DescriptionIcon,
    Person as PersonIcon,
    Computer as ComputerIcon,
    CheckCircle as CheckIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import actasService from '../../api/actasService';
import { usuariosService } from '../../api';

const GenerarActaDialog = ({ open, onClose, usuario }) => {
    const [actas, setActas] = useState([]);
    const [selectedActa, setSelectedActa] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [selectedEquipo, setSelectedEquipo] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [generatedActa, setGeneratedActa] = useState(null);
    const [step, setStep] = useState(1); // 1: Seleccionar plantilla, 2: Generar, 3: Éxito

    useEffect(() => {
        if (open && usuario) {
            loadData();
        } else {
            resetDialog();
        }
    }, [open, usuario]);

    const loadData = async () => {
        setLoadingData(true);
        try {
            // Cargar plantillas activas
            const actasResponse = await actasService.filter({ estado: 'Activa', limit: 100 });
            setActas(actasResponse.data || []);

            // Cargar equipos asignados al usuario
            if (usuario?._id) {
                const usuarioResponse = await usuariosService.getById(usuario._id);
                const equiposAsignados = usuarioResponse.data?.equiposAsignados || [];
                setEquipos(equiposAsignados);
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            setError('Error al cargar plantillas y equipos');
        } finally {
            setLoadingData(false);
        }
    };

    const resetDialog = () => {
        setSelectedActa(null);
        setSelectedEquipo('');
        setObservaciones('');
        setError('');
        setSuccess(false);
        setGeneratedActa(null);
        setStep(1);
    };

    const handleSelectActa = (acta) => {
        setSelectedActa(acta);
        setStep(2);
    };

    const handleGenerate = async () => {
        if (!selectedActa) {
            setError('Debe seleccionar una plantilla');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = {
                actaId: selectedActa._id,
                usuarioId: usuario._id,
                equipoId: selectedEquipo || undefined,
                observaciones: observaciones || undefined,
                generadoPor: 'Sistema',
            };

            const response = await actasService.generate(data);
            setGeneratedActa(response.data);
            setSuccess(true);
            setStep(3);
        } catch (error) {
            console.error('Error al generar acta:', error);
            const message = error.response?.data?.message || 'Error al generar el acta';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (generatedActa?.archivoUrl) {
            window.open(generatedActa.archivoUrl, '_blank');
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose(success);
            // Resetear después de cerrar para evitar parpadeo
            setTimeout(resetDialog, 300);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setSelectedActa(null);
            setSelectedEquipo('');
            setObservaciones('');
            setError('');
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

    if (!usuario) return null;

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon sx={{ color: '#0854a0', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {step === 3 ? 'Acta Generada' : 'Generar Acta'}
                    </Typography>
                </Box>
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

            <DialogContent sx={{ py: 3 }}>
                {loadingData ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                                {error}
                            </Alert>
                        )}

                        {/* Paso 1: Seleccionar Plantilla */}
                        {step === 1 && (
                            <Box>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    Selecciona una plantilla de acta
                                </Typography>

                                {actas.length === 0 ? (
                                    <Alert severity="info">
                                        No hay plantillas de actas disponibles
                                    </Alert>
                                ) : (
                                    <Grid container spacing={2}>
                                        {actas.map((acta) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={acta._id}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        '&:hover': {
                                                            borderColor: '#0854a0',
                                                            boxShadow: '0 2px 8px rgba(8, 84, 160, 0.15)',
                                                        },
                                                    }}
                                                >
                                                    <CardActionArea onClick={() => handleSelectActa(acta)}>
                                                        <CardContent>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                                                <DescriptionIcon
                                                                    sx={{
                                                                        color: '#0854a0',
                                                                        fontSize: 32,
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                                <Box sx={{ flexGrow: 1 }}>
                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        sx={{ fontWeight: 600, mb: 0.5 }}
                                                                    >
                                                                        {acta.titulo}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="textSecondary"
                                                                        sx={{
                                                                            display: '-webkit-box',
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: 'vertical',
                                                                            overflow: 'hidden',
                                                                        }}
                                                                    >
                                                                        {acta.descripcion || 'Sin descripción'}
                                                                    </Typography>
                                                                    <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                                        <Chip
                                                                            label={`${acta.camposIdentificados?.length || 0} campos`}
                                                                            size="small"
                                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                                        />
                                                                        <Chip
                                                                            label={`${acta.vecesUtilizada || 0} usos`}
                                                                            size="small"
                                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                                        />
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        )}

                        {/* Paso 2: Configurar Generación */}
                        {step === 2 && selectedActa && (
                            <Box>
                                {/* Plantilla Seleccionada */}
                                <Alert
                                    severity="info"
                                    sx={{ mb: 3 }}
                                    icon={<CheckIcon />}
                                >
                                    Plantilla seleccionada: <strong>{selectedActa.titulo}</strong>
                                </Alert>

                                {/* Información del Usuario */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                        <PersonIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                                        Información del Usuario
                                    </Typography>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Grid container spacing={1.5}>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Nombre
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {usuario.nombreCompleto || `${usuario.nombre} ${usuario.apellido}`}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        DNI
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {usuario.dni}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Cargo
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {usuario.cargo}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Área
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {usuario.area}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Box>

                                {/* Selección de Equipo (Opcional) */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                        <ComputerIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                                        Equipo (Opcional)
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Seleccionar Equipo</InputLabel>
                                        <Select
                                            value={selectedEquipo}
                                            onChange={(e) => setSelectedEquipo(e.target.value)}
                                            label="Seleccionar Equipo"
                                            disabled={loading || equipos.length === 0}
                                        >
                                            <MenuItem value="">
                                                <em>Sin equipo</em>
                                            </MenuItem>
                                            {equipos.map((historial) => (
                                                <MenuItem
                                                    key={historial._id}
                                                    value={historial.equipo?._id}
                                                >
                                                    {historial.equipo?.marca} {historial.equipo?.modelo} - {historial.equipo?.serie}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {equipos.length === 0 && (
                                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                            Este usuario no tiene equipos asignados actualmente
                                        </Typography>
                                    )}
                                </Box>

                                {/* Observaciones */}
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        label="Observaciones (Opcional)"
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        disabled={loading}
                                        placeholder="Agregar notas adicionales..."
                                    />
                                </Box>

                                {/* Campos que se llenarán */}
                                {selectedActa.camposIdentificados && selectedActa.camposIdentificados.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                            Campos que se completarán automáticamente
                                        </Typography>
                                        <Card variant="outlined">
                                            <List dense>
                                                {selectedActa.camposIdentificados.slice(0, 8).map((campo, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <Box
                                                                sx={{
                                                                    width: 8,
                                                                    height: 8,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: getCategoriaColor(campo.categoria),
                                                                }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                                                                >
                                                                    {'{' + campo.nombre + '}'}
                                                                </Typography>
                                                            }
                                                        />
                                                        <Chip
                                                            label={campo.categoria}
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '0.65rem',
                                                                backgroundColor: getCategoriaColor(campo.categoria),
                                                                color: '#fff'
                                                            }}
                                                        />
                                                    </ListItem>
                                                ))}
                                                {selectedActa.camposIdentificados.length > 8 && (
                                                    <ListItem>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="caption" color="textSecondary" align="center">
                                                                    Y {selectedActa.camposIdentificados.length - 8} campos más...
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                )}
                                            </List>
                                        </Card>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Paso 3: Éxito */}
                        {step === 3 && success && generatedActa && (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <CheckIcon
                                    sx={{
                                        fontSize: 64,
                                        color: '#4caf50',
                                        mb: 2
                                    }}
                                />
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                                    ¡Acta Generada Exitosamente!
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                    El documento ha sido creado y está listo para descargar
                                </Typography>

                                <Card variant="outlined" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <DescriptionIcon sx={{ fontSize: 40, color: '#0854a0' }} />
                                            <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {generatedActa.archivoNombre}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Generado el {new Date(generatedActa.createdAt).toLocaleString('es-PE')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<DownloadIcon />}
                                            onClick={handleDownload}
                                            sx={{
                                                backgroundColor: '#0854a0',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    backgroundColor: '#0a6ed1',
                                                },
                                            }}
                                        >
                                            Descargar Acta
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Alert severity="info">
                                    El acta también ha sido guardada en el historial y puedes acceder a ella en cualquier momento
                                </Alert>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2 }}>
                {step === 1 && (
                    <Button
                        onClick={handleClose}
                        disabled={loading}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                )}

                {step === 2 && (
                    <>
                        <Button
                            onClick={handleBack}
                            disabled={loading}
                            sx={{ textTransform: 'none' }}
                        >
                            Atrás
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleGenerate}
                            disabled={loading || !selectedActa}
                            sx={{
                                backgroundColor: '#0854a0',
                                textTransform: 'none',
                                minWidth: 120,
                                '&:hover': {
                                    backgroundColor: '#0a6ed1',
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: '#fff' }} />
                            ) : (
                                'Generar Acta'
                            )}
                        </Button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                resetDialog();
                                setStep(1);
                            }}
                            sx={{
                                textTransform: 'none',
                                borderColor: '#0854a0',
                                color: '#0854a0',
                            }}
                        >
                            Generar Otra Acta
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleClose}
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
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default GenerarActaDialog;