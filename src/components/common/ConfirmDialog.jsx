import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    IconButton,
} from '@mui/material';
import {
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    CheckCircle as SuccessIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

const ConfirmDialog = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'warning', // warning, error, info, success
    confirmColor = 'primary',
    maxWidth = 'sm',
}) => {
    const getIcon = () => {
        const iconProps = { sx: { fontSize: 60, mb: 2 } };

        switch (type) {
            case 'error':
                return <ErrorIcon {...iconProps} color="error" />;
            case 'success':
                return <SuccessIcon {...iconProps} color="success" />;
            case 'info':
                return <InfoIcon {...iconProps} color="info" />;
            case 'warning':
            default:
                return <WarningIcon {...iconProps} color="warning" />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'error':
                return 'error';
            case 'success':
                return 'success';
            case 'info':
                return 'info';
            case 'warning':
            default:
                return 'warning';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth={maxWidth}
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1,
                }}
            >
                {title}
                <IconButton
                    aria-label="close"
                    onClick={onCancel}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    py={2}
                >
                    {getIcon()}
                    <DialogContentText
                        sx={{
                            fontSize: '1rem',
                            color: 'text.primary',
                            mb: 2,
                        }}
                    >
                        {message}
                    </DialogContentText>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        minWidth: 100,
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    autoFocus
                    sx={{
                        minWidth: 100,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: 2,
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;