import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { User, ChevronDown, MessageCircle, ArrowLeft } from 'lucide-react'; 
import logo from '../../assets/GbdLogo.png'; 
import { ChatWidget } from '../components/ChatWidget';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Fíjate que aquí dice "export const", eso es lo que busca el otro archivo
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // LÓGICA DEL BOTÓN VOLVER
  const location = useLocation();
  const navigate = useNavigate();
  // Mostrar botón volver si NO estamos en la raíz del portal
  const showBackButton = location.pathname !== '/portal';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      
      {/* NAVBAR */}
      <nav className="bg-gobdocs-primary text-white py-4 px-8 shadow-lg z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo con Link al inicio */}
          <Link to="/portal" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
             <img src={logo} alt="GobDocs Logo" className="h-10 w-auto object-contain" />
             <span className="font-bold text-lg tracking-wide">GobDocs RD</span>
          </Link>
          
          <div className="flex items-center gap-8">
            
{/* Link: Visualizar - Ahora te lleva a la galería de documentos */}
            <Link 
              to="/portal/documentos" 
              className="hidden md:flex items-center gap-1 cursor-pointer hover:text-blue-200 transition-colors"
            >
              <span className="font-medium">Visualizar</span>
              <ChevronDown size={16} />
            </Link>

            {/* Link: Solicitar */}
            <Link 
              to="/portal/solicitud" 
              className="hidden md:flex items-center gap-1 cursor-pointer hover:text-blue-200 transition-colors"
            >
              <span className="font-medium">Solicitar</span>
              <ChevronDown size={16} />
            </Link>

            {/* --- MENÚ DE USUARIO DESPLEGABLE --- */}
            <div className="relative group pl-4 border-l border-white/20 ml-4">
                
                {/* Icono (Disparador) */}
                <div className="bg-white/10 p-2 rounded-full hover:bg-white/20 cursor-pointer transition-colors">
                  <User size={20} />
                </div>

                {/* Menú Flotante (Aparece al pasar el mouse) */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50 border border-gray-100 transform origin-top-right">
                    
                    {/* Flechita decorativa */}
                    <div className="absolute -top-2 right-3 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>

                    <div className="relative z-10 bg-white rounded-xl overflow-hidden">
                      <Link to="/portal/perfil" className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50 transition-colors font-medium">
                        Mi perfil
                      </Link>
                      
                      <Link to="/portal/documentos" className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50 transition-colors font-medium">
                        Mis Documentos
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <Link to="/auth/login" className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50 transition-colors font-medium">
                        Cerrar sesión
                      </Link>
                    </div>
                </div>
            </div>
            {/* ----------------------------------- */}

          </div>
        </div> 
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 relative">
        {/* Botón Volver Dinámico */}
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)} 
            className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gobdocs-primary transition-colors font-medium z-50 relative"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        )}

        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-gobdocs-primary text-white py-6 px-8 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <span>GobDocs RD @ 2026</span>
        </div>
      </footer>

      {/* CHAT WIDGET */}
      {isChatOpen && (
        <ChatWidget onClose={() => setIsChatOpen(false)} />
      )}

      {/* FAB (Botón Flotante) */}
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