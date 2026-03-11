import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../modules/Auth/pages/LoginPage';
import { RegisterPage } from '../auth/ui/RegisterPage';
import { DashboardPage } from '../modules/ciudadano/pages/DashboardPage';
import { CreateSolicitudPage } from '../modules/ciudadano/pages/CreateSolicitudPage';
import { SolicitarDocumentosPage } from '../modules/ciudadano/pages/SolicitarDocumentosPage';
import { ProfilePage } from '../modules/ciudadano/pages/ProfilePage';
import { MyDocumentsPage } from '../modules/ciudadano/pages/MyDocumentsPage';
import { MisSolicitudesPage } from '../modules/ciudadano/pages/MisSolicitudesPage';
import { RegisterOperadorPage } from '../modules/Auth/pages/RegisterOperatorPage';
import { LandingBkOfficePage } from '../modules/BackOffice/LandingBkOfficePage';
import { VerSolicitudBkOfficePage } from "../modules/BackOffice/VerSolicitudIndvBkOfficePage.tsx";
import { VerAllSolicitudBkOfficePage } from "../modules/BackOffice/VerAllSolicitudBkOfficePage.tsx";
import { PagoExitosoPage } from '../modules/ciudadano/pages/PagoExitosoPage.tsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      {/* Rutas Públicas */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/pages/RegisterOperatorPage" element={<RegisterOperadorPage />} />
      <Route path="/landingbkoffice" element={<LandingBkOfficePage />} />

      {/* Rutas Privadas (Módulo Ciudadano) */}
      <Route path="/portal" element={<DashboardPage />} />
      <Route path="/portal/solicitar" element={<SolicitarDocumentosPage />} />
      <Route path="/portal/crear-solicitud/:tipoDocumentoId" element={<CreateSolicitudPage />} />
      <Route path="/portal/perfil" element={<ProfilePage />} />
      <Route path="/portal/documentos" element={<MyDocumentsPage />} />
      <Route path="/portal/solicitudes" element={<MisSolicitudesPage />} />
      <Route path="/backoffice/solicitud/69" element={<VerSolicitudBkOfficePage />} />
      <Route path="/backoffice/solicitudes" element={<VerAllSolicitudBkOfficePage />} />
      <Route path="/portal/pago-exitoso" element={<PagoExitosoPage />} />

      <Route path="*" element={<div>404 - No encontrado</div>} />
    </Routes>
  );
};