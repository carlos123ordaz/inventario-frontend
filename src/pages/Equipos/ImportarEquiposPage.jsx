import React, { useState, useCallback } from 'react';
import {
    Box, Paper, Typography, Button, Stepper, Step, StepLabel,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, MenuItem, Chip, Alert, LinearProgress, IconButton,
    Checkbox, FormControlLabel, useTheme, Tooltip, Stack,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    InsertDriveFile as FileIcon,
    Delete as DeleteIcon,
    InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { equiposService } from '../../api';

const STEPS = ['Subir archivo', 'Mapear columnas', 'Revisar e importar'];

const ImportarEquiposPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    // Step control
    const [activeStep, setActiveStep] = useState(0);

    // Step 1: File upload
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    // Step 2: Mapping
    const [columnas, setColumnas] = useState([]);
    const [preview, setPreview] = useState([]);
    const [totalFilas, setTotalFilas] = useState(0);
    const [campos, setCampos] = useState([]);
    const [mapeo, setMapeo] = useState({});
    const [actualizarExistentes, setActualizarExistentes] = useState(false);

    // Step 3: Results
    const [importing, setImporting] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [importError, setImportError] = useState('');

    const [delimitador, setDelimitador] = useState(',');

    const DELIMITADORES = [
        { value: ',', label: 'Coma ( , )' },
        { value: ';', label: 'Punto y coma ( ; )' },
        { value: '\t', label: 'Tabulación (Tab)' },
        { value: '|', label: 'Pipe ( | )' },
    ];
    // ==========================================
    // STEP 1: File Upload
    // ==========================================
    const handleFileSelect = async (selectedFile) => {
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.csv')) {
            setUploadError('Solo se permiten archivos CSV');
            return;
        }

        setFile(selectedFile);
        setUploadError('');
        procesarArchivo(selectedFile, delimitador);
    };

    const procesarArchivo = async (selectedFile, sep) => {
        setUploading(true);
        setUploadError('');
        try {
            const response = await equiposService.previsualizarCSV(selectedFile, sep);
            const { columnas, preview, totalFilas, campos } = response.data;

            setColumnas(columnas);
            setPreview(preview);
            setTotalFilas(totalFilas);
            setCampos(campos);

            // Auto-mapeo inteligente
            const autoMapeo = {};
            columnas.forEach((col) => {
                const colLower = col.toLowerCase().replace(/[_\s-]/g, '');
                const match = campos.find((campo) => {
                    const keyLower = campo.key.toLowerCase().replace(/\./g, '');
                    const labelLower = campo.label.toLowerCase().replace(/[_\s-]/g, '');
                    return (
                        colLower === keyLower ||
                        colLower === labelLower ||
                        colLower.includes(keyLower) ||
                        keyLower.includes(colLower)
                    );
                });
                autoMapeo[col] = match ? match.key : '';
            });
            setMapeo(autoMapeo);

            setActiveStep(1);
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al procesar el archivo';
            setUploadError(msg);
        } finally {
            setUploading(false);
        }
    };

    // Cuando cambia el delimitador, re-procesar si ya hay archivo
    const handleDelimitadorChange = (nuevoDelimitador) => {
        setDelimitador(nuevoDelimitador);
        if (file) {
            procesarArchivo(file, nuevoDelimitador);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileSelect(droppedFile);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    // ==========================================
    // STEP 2: Mapping
    // ==========================================
    const handleMapeoChange = (columna, campoKey) => {
        setMapeo((prev) => ({ ...prev, [columna]: campoKey }));
    };

    const getCamposUsados = () => {
        return Object.values(mapeo).filter((v) => v && v !== '');
    };

    const getMapeoValido = () => {
        const camposRequeridos = campos.filter((c) => c.required).map((c) => c.key);
        const mapeados = getCamposUsados();
        return camposRequeridos.every((cr) => mapeados.includes(cr));
    };

    const getCamposRequeridosFaltantes = () => {
        const camposRequeridos = campos.filter((c) => c.required);
        const mapeados = getCamposUsados();
        return camposRequeridos.filter((c) => !mapeados.includes(c.key));
    };

    // ==========================================
    // STEP 3: Import
    // ==========================================
    const handleImportar = async () => {
        setImporting(true);
        setImportError('');
        setResultado(null);

        try {
            const response = await equiposService.importar(file, mapeo, actualizarExistentes, delimitador);
            setResultado(response.data);
            setActiveStep(2);
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al importar equipos';
            setImportError(msg);
        } finally {
            setImporting(false);
        }
    };
    // ==========================================
    // RENDER STEPS
    // ==========================================
    const renderStep1 = () => (
        <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <TextField
                select
                label="Delimitador"
                value={delimitador}
                onChange={(e) => handleDelimitadorChange(e.target.value)}
                size="small"
                sx={{ width: 240 }}
                helperText="Selecciona el separador que usa tu archivo CSV"
            >
                {DELIMITADORES.map((d) => (
                    <MenuItem key={d.value} value={d.value}>
                        {d.label}
                    </MenuItem>
                ))}
            </TextField>
            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                sx={{
                    width: '100%',
                    maxWidth: 560,
                    border: `2px dashed ${dragOver ? theme.palette.primary.main : theme.palette.divider}`,
                    borderRadius: 2,
                    p: 5,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: dragOver
                        ? `${theme.palette.primary.main}08`
                        : theme.palette.background.paper,
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: `${theme.palette.primary.main}05`,
                    },
                }}
                onClick={() => document.getElementById('csv-file-input').click()}
            >
                {file ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <FileIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {(file.size / 1024).toFixed(1)} KB
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                                setUploadError('');
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ) : (
                    <>
                        <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                            Arrastra tu archivo CSV aquí
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            o haz clic para seleccionar un archivo
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Formato soportado: .csv (máx. 10MB)
                        </Typography>
                    </>
                )}
            </Box>

            <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            {uploading && (
                <Box sx={{ width: '100%', maxWidth: 560 }}>
                    <LinearProgress />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                        Procesando archivo...
                    </Typography>
                </Box>
            )}

            {uploadError && (
                <Alert severity="error" sx={{ maxWidth: 560, width: '100%' }}>
                    {uploadError}
                </Alert>
            )}
        </Box>
    );

    const renderStep2 = () => {
        const faltantes = getCamposRequeridosFaltantes();

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Info */}
                <Alert severity="info" icon={<InfoIcon />}>
                    Se detectaron <strong>{columnas.length} columnas</strong> y{' '}
                    <strong>{totalFilas} filas</strong> en tu archivo. Relaciona cada columna del CSV con el
                    campo correspondiente del sistema.
                </Alert>

                {/* Campos requeridos faltantes */}
                {faltantes.length > 0 && (
                    <Alert severity="warning">
                        Campos requeridos sin mapear:{' '}
                        {faltantes.map((c) => (
                            <Chip
                                key={c.key}
                                label={c.label}
                                size="small"
                                color="warning"
                                sx={{ mx: 0.5 }}
                            />
                        ))}
                    </Alert>
                )}

                {/* Tabla de mapeo */}
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ border: `1px solid ${theme.palette.divider}` }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, width: '25%' }}>
                                    Columna del archivo
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, width: '30%' }}>Campo</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Vista previa de los datos</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {columnas.map((columna, idx) => (
                                <TableRow key={columna} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {columna}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            value={mapeo[columna] || ''}
                                            onChange={(e) => handleMapeoChange(columna, e.target.value)}
                                            sx={{ minWidth: 200 }}
                                        >
                                            <MenuItem value="">
                                                <em>— No importar —</em>
                                            </MenuItem>
                                            {campos.map((campo) => {
                                                const yaUsado =
                                                    getCamposUsados().includes(campo.key) &&
                                                    mapeo[columna] !== campo.key;
                                                return (
                                                    <MenuItem
                                                        key={campo.key}
                                                        value={campo.key}
                                                        disabled={yaUsado}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {campo.label}
                                                            {campo.required && (
                                                                <Chip label="Requerido" size="small" color="error" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                            )}
                                                        </Box>
                                                    </MenuItem>
                                                );
                                            })}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                                            {preview.slice(0, 2).map((row, i) => (
                                                <Typography
                                                    key={i}
                                                    variant="caption"
                                                    sx={{ color: theme.palette.text.secondary }}
                                                >
                                                    {i + 1}. {row[columna] || '—'}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Opciones adicionales */}
                <Paper
                    elevation={0}
                    sx={{ p: 2.5, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
                >
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                        Opciones adicionales
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={actualizarExistentes}
                                onChange={(e) => setActualizarExistentes(e.target.checked)}
                            />
                        }
                        label={
                            <Box>
                                <Typography variant="body2">
                                    Actualizar datos de equipos existentes
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Si no se marca, los equipos con serie duplicada serán omitidos
                                </Typography>
                            </Box>
                        }
                    />
                </Paper>

                {importError && (
                    <Alert severity="error">{importError}</Alert>
                )}
            </Box>
        );
    };

    const renderStep3 = () => {
        if (!resultado) return null;

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
                {/* Resumen */}
                <Alert
                    severity={resultado.errores.length === 0 ? 'success' : 'warning'}
                    icon={resultado.errores.length === 0 ? <CheckCircleIcon /> : <ErrorIcon />}
                >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Importación completada
                    </Typography>
                    <Typography variant="body2">
                        Se procesaron {resultado.total} filas del archivo
                    </Typography>
                </Alert>

                {/* Estadísticas */}
                <Stack direction="row" spacing={2}>
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1, p: 3, textAlign: 'center',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                            {resultado.creados}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Creados
                        </Typography>
                    </Paper>
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1, p: 3, textAlign: 'center',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                            {resultado.actualizados}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Actualizados
                        </Typography>
                    </Paper>
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1, p: 3, textAlign: 'center',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                            {resultado.errores.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Errores
                        </Typography>
                    </Paper>
                </Stack>

                {/* Tabla de errores */}
                {resultado.errores.length > 0 && (
                    <Paper
                        elevation={0}
                        sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
                    >
                        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Detalle de errores
                            </Typography>
                        </Box>
                        <TableContainer sx={{ maxHeight: 300 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, width: 80 }}>Fila</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Error</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultado.errores.map((error, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Chip label={`Fila ${error.fila}`} size="small" color="error" variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{error.mensaje}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate('/equipos')} size="small">
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 500 }}>
                        Importar Equipos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Importa equipos desde un archivo CSV
                    </Typography>
                </Box>
            </Box>

            {/* Stepper */}
            <Paper
                elevation={0}
                sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
            >
                <Stepper activeStep={activeStep} alternativeLabel>
                    {STEPS.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            {/* Content */}
            <Paper
                elevation={0}
                sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
            >
                {activeStep === 0 && renderStep1()}
                {activeStep === 1 && renderStep2()}
                {activeStep === 2 && renderStep3()}
            </Paper>

            {/* Navigation buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                        if (activeStep === 0 || activeStep === 2) {
                            navigate('/equipos');
                        } else {
                            setActiveStep((prev) => prev - 1);
                        }
                    }}
                    sx={{ textTransform: 'none' }}
                >
                    {activeStep === 0 || activeStep === 2 ? 'Volver a Equipos' : 'Atrás'}
                </Button>

                {activeStep === 1 && (
                    <Button
                        variant="contained"
                        endIcon={importing ? null : <ArrowForwardIcon />}
                        onClick={handleImportar}
                        disabled={!getMapeoValido() || importing}
                        sx={{ textTransform: 'none', fontWeight: 500 }}
                    >
                        {importing ? 'Importando...' : `Importar ${totalFilas} equipos`}
                    </Button>
                )}

                {activeStep === 2 && (
                    <Button
                        variant="contained"
                        onClick={() => navigate('/equipos')}
                        sx={{ textTransform: 'none', fontWeight: 500 }}
                    >
                        Ver equipos
                    </Button>
                )}
            </Box>

            {importing && <LinearProgress sx={{ borderRadius: 1 }} />}
        </Box>
    );
};

export default ImportarEquiposPage;