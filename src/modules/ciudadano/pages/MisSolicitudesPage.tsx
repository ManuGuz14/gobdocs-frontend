import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';

export const MisSolicitudesPage = () => {
  return (
    <DashboardLayout>
      <div className="min-h-[80vh] p-4">
        <h1 className="text-3xl font-bold text-gobdocs-primary mb-6">
            Mis Solicitudes
        </h1>
        
        {/* Espacio vacío o mensaje de "No hay datos" */}
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-400">No tienes solicitudes registradas aún.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};