import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { User, ChevronDown, MessageCircle, ArrowLeft } from 'lucide-react'; 
import logo from '../../assets/GobDocsLogo.png'; 
import { ChatWidget } from '../components/ChatWidget';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== '/portal';

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="bg-gobdocs-primary text-white py-10 px-10  z-50 w-full relative">
        <div className= "w-full flex justify-between items-center">
          
          <Link to="/portal" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
             <img src={logo} alt="GobDocs Logo" className="h-10 w-auto object-contain" />
             <span className="font-bold text-lg tracking-wide">GobDocs RD</span>
          </Link>
          
          <div className="flex items-center gap-8">
            
            {/* --- MENÚ DESPLEGABLE: VISUALIZAR (Corrección aquí) --- */}
            <div className="relative group h-full flex items-center">
                
                {/* 1. Disparador (Texto visible 'Visualizar') */}
                <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200 transition-colors py-2">
                  <span className="font-medium">Visualizar</span>
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                </div>

                {/* 2. Menú Flotante (Opciones ocultas) */}
                <div className="absolute left-0 top-full pt-2 w-48 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">
                    <div className="bg-white rounded-xl shadow-xl py-2 border border-gray-100 relative">
                        
                        {/* Flechita decorativa arriba */}
                        <div className="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>

                        {/* Opciones */}
                        <div className="relative z-10 bg-white rounded-xl overflow-hidden">
                          <Link to="/portal/documentos" className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50 transition-colors font-medium">
                            Mis Documentos
                          </Link>
                          
                          {/* Enlace corregido a Mis Solicitudes */}
                          <Link to="/portal/solicitudes" className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50 transition-colors font-medium">
                            Mis Solicitudes
                          </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* ------------------------------------------ */}


            {/* Link: Solicitar */}
            <Link 
              to="/portal/solicitud" 
              className="hidden md:flex items-center gap-1 cursor-pointer hover:text-blue-200 transition-colors"
            >
              <span className="font-medium">Solicitar</span>
              <ChevronDown size={16} />
            </Link>

            {/* Menú de Usuario */}
            <div className="relative group pl-4 border-l border-white/20 ml-4">
                <div className="bg-white/10 p-2 rounded-full hover:bg-white/20 cursor-pointer transition-colors">
                  <User size={20} />
                </div>
                
                <div className="absolute right-0 top-full pt-2 w-48 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50 transform origin-top-right">
                    <div className="bg-white rounded-xl shadow-xl py-2 border border-gray-100 relative">
                        <div className="absolute -top-2 right-3 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
                        <div className="relative z-10 bg-white rounded-xl overflow-hidden">
                          <Link to="/portal/perfil" className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50 transition-colors font-medium">Mi perfil</Link>
                          <Link to="/portal/documentos" className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50 transition-colors font-medium">Mis Documentos</Link>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link to="/auth/login" className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50 transition-colors font-medium">Cerrar sesión</Link>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div> 
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 w-full relative">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="absolute left-40 top-6 z-20 flex items-center gap-2 text-white hover:text-gray-400 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        )}

        {/* si quieres dejar un poco de espacio general para el contenido */}
        <div className="pt-0">
          {children}
        </div>
      </main> 

      {/* FOOTER */}
      <footer className="bg-gobdocs-primary text-white py-6 px-8 text-xs mt-auto w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <span>GobDocs RD @ 2026</span>
        </div>
      </footer>

      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}

      <button 
        className={`fixed bottom-8 right-8 bg-white text-gobdocs-primary p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 border-2 border-blue-50 group ${isChatOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={() => setIsChatOpen(true)}
      >
        <MessageCircle size={32} strokeWidth={2.5} className="group-hover:-rotate-12 transition-transform" />
        <span className="absolute top-2 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </button>
    </div>
  );
};