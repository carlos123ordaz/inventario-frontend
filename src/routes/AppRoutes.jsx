import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/common/MainLayout';
import UsuariosPage from '../pages/Usuarios/UsuariosPage';
import EquiposPage from '../pages/Equipos/EquiposPage';
import EquipoDetailPage from '../pages/Equipos/EquipoDetailPage';
import HistorialPage from '../pages/Historial/HistorialPage';
import Dashboard from '../pages/Dashboard';
import ActasPage from '../pages/actas/ActasPage';
const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/usuarios" element={<UsuariosPage />} />
                <Route path="/equipos/:id" element={<EquipoDetailPage />} />
                <Route path="/equipos" element={<EquiposPage />} />
                <Route path="/actas" element={<ActasPage />} />
                <Route path="/historial">
                    <Route index element={<HistorialPage />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;