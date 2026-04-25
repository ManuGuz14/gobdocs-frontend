import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoginPage } from '../modules/Auth/pages/LoginPage';
import { RegisterPage } from '../auth/ui/RegisterPage';
import { OlvideContrasenaPage } from '../auth/ui/OlvideContrasenaPage';
import { ResetPasswordPage } from '../auth/ui/ResetPasswordPage';
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
import { EmitirPage } from "../modules/BackOffice/EmitirPage.tsx";
import { AprobarSolicitudPage } from "../modules/BackOffice/AprobarSolicitudPage.tsx";
import { ProfileOperatorPage } from "../modules/BackOffice/ProfileOperatorPage.tsx";
import { DocumentosEmitidosPage } from "../modules/BackOffice/DocumentosEmitidosPage.tsx";
import { PagoExitosoPage } from '../modules/ciudadano/pages/PagoExitosoPage.tsx';
import { SolicitudDetailPage } from '../modules/ciudadano/pages/MiSolicitudDetailPage';
import { PaymentPage } from '../modules/ciudadano/pages/PaymentPage.tsx';
import { AdminDashboardPage } from '../modules/Admin/pages/AdminDashboardPage';
import { BulkUploadPage } from '../modules/Admin/pages/BulkUploadPage';
import { CreateInstitucionPage } from '../modules/Admin/pages/CreateInstitucionPage';
import { CreateDocumentTypePage } from '../modules/Admin/pages/CreateDocumentTypePage';
import { FormulariosPage } from '../modules/Admin/pages/Formularios/FormulariosPage.tsx';
import { CreateFormularioPage } from '../modules/Admin/pages/Formularios/CreateFormulariosPage.tsx';
import { EditFormularioPage } from '../modules/Admin/pages/Formularios/EditFormularioPage.tsx';
import { ViewFormularioPage } from '../modules/Admin/pages/Formularios/ViewFormularioPage.tsx';

export const AppRouter = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Públicas */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/olvide-contrasena" element={<OlvideContrasenaPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/pages/RegisterOperatorPage" element={<RegisterOperadorPage />} />
        <Route path="/landingbkoffice" element={<LandingBkOfficePage />} />

        {/* Ciudadano */}
        <Route path="/portal" element={<DashboardPage />} />
        <Route path="/portal/solicitar" element={<SolicitarDocumentosPage />} />
        <Route path="/portal/crear-solicitud/:tipoDocumentoId" element={<CreateSolicitudPage />} />
        <Route path="/portal/perfil" element={<ProfilePage />} />
        <Route path="/portal/documentos" element={<MyDocumentsPage />} />
        <Route path="/portal/solicitudes" element={<MisSolicitudesPage />} />
        <Route path="/portal/mi-solicitud/:id" element={<SolicitudDetailPage />} />
        <Route path="/portal/pago/:numeroSolicitud" element={<PaymentPage />} />
        <Route path="/portal/pago/multiple" element={<PaymentPage />} />
        <Route path="/portal/pago-exitoso" element={<PagoExitosoPage />} />

        {/* Backoffice */}
        <Route path="/backoffice/solicitudes" element={<VerAllSolicitudBkOfficePage />} />
        <Route path="/backoffice/solicitud/:id" element={<VerSolicitudBkOfficePage />} />
        <Route path="/backoffice/emitir" element={<EmitirPage />} />
        <Route path="/backoffice/aprobar/:id" element={<AprobarSolicitudPage />} />
        <Route path="/backoffice/perfil" element={<ProfileOperatorPage />} />
        <Route path="/backoffice/documentos" element={<DocumentosEmitidosPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/carga-masiva" element={<BulkUploadPage />} />
        <Route path="/admin/instituciones" element={<CreateInstitucionPage />} />
        <Route path="/admin/tipos-documento" element={<CreateDocumentTypePage />} />

        <Route path="/admin/formularios" element={<FormulariosPage />} />
        <Route path="/admin/formularios/create" element={<CreateFormularioPage />} />
        <Route path="/admin/formularios/edit/:id" element={<EditFormularioPage />} />
        <Route path="/admin/formularios/:id" element={<ViewFormularioPage />} />
        <Route path="*" element={<div>404 - No encontrado</div>} />
      </Routes>
    </div>
  );
};