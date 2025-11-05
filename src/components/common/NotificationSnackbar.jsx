import React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const NotificationSnackbar = ({
    open,
    message,
    severity = 'success',
    autoHideDuration = 6000,
    onClose,
    anchorOrigin = { vertical: 'top', horizontal: 'right' },
}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: '100%',
                    boxShadow: 3,
                    '& .MuiAlert-icon': {
                        fontSize: 24,
                    },
                }}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={onClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationSnackbar;