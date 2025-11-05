// Constantes de rutas para fácil navegación y mantenimiento
export const ROUTES = {
    DASHBOARD: '/dashboard',
    USUARIOS: {
        LIST: '/usuarios',
        NEW: '/usuarios/nuevo',
        DETAIL: (id) => `/usuarios/${id}`,
        EDIT: (id) => `/usuarios/${id}/editar`,
    },
    EQUIPOS: {
        LIST: '/equipos',
        NEW: '/equipos/nuevo',
        DETAIL: (id) => `/equipos/${id}`,
        EDIT: (id) => `/equipos/${id}/editar`,
    },

    HISTORIAL: {
        LIST: '/historial',
    },
    ASIGNACIONES: {
        LIST: '/asignaciones',
        NEW: '/asignaciones/nueva',
        TRANSFER: (equipoId) => `/asignaciones/transferir/${equipoId}`,
    },
};

export const BREADCRUMB_LABELS = {
    dashboard: 'Dashboard',
    usuarios: 'Usuarios',
    nuevo: 'Nuevo',
    editar: 'Editar',
    equipos: 'Equipos',
    historial: 'Historial',
    asignaciones: 'Asignaciones',
    nueva: 'Nueva Asignación',
    transferir: 'Transferir',
};

export default ROUTES;