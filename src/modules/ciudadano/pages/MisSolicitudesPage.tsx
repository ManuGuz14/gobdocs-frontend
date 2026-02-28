import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';
import { Search } from 'lucide-react';

export const MisSolicitudesPage = () => {
  return (
    <DashboardLayout>
       <div className="min-h-[80vh] flex flex-col">
        
        {/* --- HEADER AZUL --- */}
        <div className="bg-gradient-to-b from-gobdocs-primary to-gobdocs-secondaryblue -mx-6 md:-mx-8 px-6 md:px-8 pt-12 pb-24 text-center relative shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Tus Solicitudes
            </h1>

            <div className="max-w-3xl mx-auto relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg transition-all"
                />
            </div>
        </div>
        
        {/* Espacio vacío o mensaje de "No hay datos" */}
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-400">No tienes solicitudes registradas aún.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};