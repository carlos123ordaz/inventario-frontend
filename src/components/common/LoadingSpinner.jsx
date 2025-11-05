import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

const LoadingSpinner = ({
    fullScreen = false,
    message = 'Cargando...',
    size = 40
}) => {
    if (fullScreen) {
        return (
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }}
                open={true}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CircularProgress
                        size={size}
                        thickness={4}
                        sx={{ color: '#0070F2' }}
                    />
                    {message && (
                        <Typography
                            variant="body1"
                            sx={{ mt: 2, color: 'white', fontWeight: 500 }}
                        >
                            {message}
                        </Typography>
                    )}
                </Box>
            </Backdrop>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
            width="100%"
        >
            <CircularProgress
                size={size}
                thickness={4}
                sx={{ color: 'primary.main' }}
            />
            {message && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default LoadingSpinner;