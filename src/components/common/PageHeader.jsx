import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({
    title,
    subtitle,
    showBackButton = false,
    primaryAction,
    primaryActionText,
    primaryActionIcon = <AddIcon />,
    secondaryAction,
    secondaryActionText,
    badge,
    badgeColor = 'primary',
}) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: '2px solid',
                borderColor: 'divider',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            {/* Left side - Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {showBackButton && (
                    <Button
                        variant="text"
                        color="inherit"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{
                            textTransform: 'none',
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'primary.main',
                                backgroundColor: 'transparent',
                            },
                        }}
                    >
                        Atrás
                    </Button>
                )}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: { xs: '1.75rem', md: '2.125rem' },
                            }}
                        >
                            {title}
                        </Typography>
                        {badge && (
                            <Chip
                                label={badge}
                                color={badgeColor}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                }}
                            />
                        )}
                    </Box>
                    {subtitle && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Right side - Actions */}
            {(primaryAction || secondaryAction) && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {secondaryAction && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={secondaryAction}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                borderRadius: 1,
                                px: 3,
                            }}
                        >
                            {secondaryActionText}
                        </Button>
                    )}
                    {primaryAction && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={primaryAction}
                            startIcon={primaryActionIcon}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                borderRadius: 1,
                                px: 3,
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4,
                                },
                            }}
                        >
                            {primaryActionText}
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default PageHeader;