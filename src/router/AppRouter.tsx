import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../modules/Auth/pages/LoginPage';
import { RegisterPage } from '../modules/Auth/pages/RegisterPage';
import { DashboardPage } from '../modules/ciudadano/pages/DashboardPage';
import { CreateSolicitudPage } from '../modules/ciudadano/pages/CreateSolicitudPage';
import { ProfilePage } from '../modules/ciudadano/pages/ProfilePage';
import { MyDocumentsPage } from '../modules/ciudadano/pages/MyDocumentsPage'; // <--- 1. IMPORTAR

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      
      {/* Rutas Públicas */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* Rutas Privadas (Módulo Ciudadano) */}
      <Route path="/portal" element={<DashboardPage />} />
      <Route path="/portal/solicitud" element={<CreateSolicitudPage />} />
      <Route path="/portal/perfil" element={<ProfilePage />} />
      <Route path="/portal/documentos" element={<MyDocumentsPage />} /> {/* <--- 2. AGREGAR RUTA */}

      <Route path="*" element={<div>404 - No encontrado</div>} />
    </Routes>
  );
};