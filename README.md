inventario-frontend/
│
├── public/                          # Archivos públicos estáticos
│   ├── index.html                   # HTML base
│   ├── favicon.ico                  # Icono de la aplicación
│   └── manifest.json                # Configuración PWA
│
├── src/                             # Código fuente
│   │
│   ├── api/                         # 🔌 Servicios y llamadas al backend
│   │   ├── axios.config.js          # Configuración de Axios
│   │   ├── usuariosService.js       # API de usuarios
│   │   ├── equiposService.js        # API de equipos
│   │   └── historialService.js      # API de historial
│   │
│   ├── components/                  # 🧩 Componentes reutilizables
│   │   │
│   │   ├── common/                  # Componentes comunes
│   │   │   ├── Navbar.jsx           # Barra de navegación
│   │   │   ├── Sidebar.jsx          # Menú lateral
│   │   │   ├── Footer.jsx           # Pie de página
│   │   │   ├── LoadingSpinner.jsx   # Spinner de carga
│   │   │   ├── ConfirmDialog.jsx    # Diálogo de confirmación
│   │   │   └── Breadcrumbs.jsx      # Navegación breadcrumb
│   │   │
│   │   ├── usuarios/                # Componentes de usuarios
│   │   │   ├── UsuarioCard.jsx      # Tarjeta de usuario
│   │   │   ├── UsuarioForm.jsx      # Formulario de usuario
│   │   │   ├── UsuarioTable.jsx     # Tabla de usuarios
│   │   │   └── UsuarioFilter.jsx    # Filtros de usuarios
│   │   │
│   │   ├── equipos/                 # Componentes de equipos
│   │   │   ├── EquipoCard.jsx       # Tarjeta de equipo
│   │   │   ├── EquipoForm.jsx       # Formulario de equipo
│   │   │   ├── EquipoTable.jsx      # Tabla de equipos
│   │   │   ├── EquipoFilter.jsx     # Filtros de equipos
│   │   │   └── EquipoSpecs.jsx      # Especificaciones técnicas
│   │   │
│   │   ├── historial/               # Componentes de historial
│   │   │   ├── AsignacionCard.jsx   # Tarjeta de asignación
│   │   │   ├── AsignacionForm.jsx   # Formulario de asignación
│   │   │   ├── HistorialTable.jsx   # Tabla de historial
│   │   │   └── Timeline.jsx         # Línea de tiempo
│   │   │
│   │   └── dashboard/               # Componentes del dashboard
│   │       ├── StatCard.jsx         # Tarjeta de estadística
│   │       ├── ChartEquipos.jsx     # Gráfico de equipos
│   │       ├── ChartUsuarios.jsx    # Gráfico de usuarios
│   │       └── ActivityFeed.jsx     # Feed de actividad
│   │
│   ├── pages/                       # 📄 Páginas/Vistas principales
│   │   ├── Dashboard.jsx            # Dashboard principal
│   │   ├── Usuarios/                # Módulo de usuarios
│   │   │   ├── UsuariosPage.jsx     # Lista de usuarios
│   │   │   ├── UsuarioDetailPage.jsx # Detalle de usuario
│   │   │   └── UsuarioCreatePage.jsx # Crear/Editar usuario
│   │   │
│   │   ├── Equipos/                 # Módulo de equipos
│   │   │   ├── EquiposPage.jsx      # Lista de equipos
│   │   │   ├── EquipoDetailPage.jsx # Detalle de equipo
│   │   │   └── EquipoCreatePage.jsx # Crear/Editar equipo
│   │   │
│   │   ├── Historial/               # Módulo de historial
│   │   │   ├── HistorialPage.jsx    # Lista de historial
│   │   │   ├── AsignacionesPage.jsx # Asignaciones activas
│   │   │   └── AsignarPage.jsx      # Asignar equipo
│   │   │
│   │   └── NotFound.jsx             # Página 404
│   │
│   ├── context/                     # 🔄 Context API para estado global
│   │   ├── AuthContext.jsx          # Contexto de autenticación (futuro)
│   │   ├── NotificationContext.jsx  # Contexto de notificaciones
│   │   └── ThemeContext.jsx         # Contexto de tema (dark/light)
│   │
│   ├── hooks/                       # 🪝 Custom Hooks
│   │   ├── useUsuarios.js           # Hook para usuarios
│   │   ├── useEquipos.js            # Hook para equipos
│   │   ├── useHistorial.js          # Hook para historial
│   │   ├── usePagination.js         # Hook para paginación
│   │   └── useDebounce.js           # Hook para debounce en búsquedas
│   │
│   ├── utils/                       # 🛠️ Utilidades y helpers
│   │   ├── formatters.js            # Formateo de fechas, números, etc.
│   │   ├── validators.js            # Validaciones de formularios
│   │   ├── constants.js             # Constantes de la aplicación
│   │   └── helpers.js               # Funciones auxiliares
│   │
│   ├── styles/                      # 🎨 Estilos globales
│   │   ├── theme.js                 # Tema de Material-UI
│   │   ├── globalStyles.js          # Estilos globales
│   │   └── colors.js                # Paleta de colores
│   │
│   ├── routes/                      # 🛣️ Configuración de rutas
│   │   └── AppRoutes.jsx            # Definición de rutas
│   │
│   ├── App.jsx                      # Componente principal
│   ├── index.js                     # Punto de entrada
│   └── reportWebVitals.js           # Métricas de rendimiento
│
├── .env.example                     # Ejemplo de variables de entorno
├── .env                             # Variables de entorno (no subir a git)
├── .gitignore                       # Archivos ignorados por git
├── package.json                     # Dependencias y scripts
├── README.md                        # Documentación del frontend
└── ESTRUCTURA.md                    # Este archivo