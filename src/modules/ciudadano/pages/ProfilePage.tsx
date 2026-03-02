import { User, ArrowLeft, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';
// Asegúrate de importar la imagen de fondo correctamente
import Imagendefondo from '../../../assets/Perfil/Geo-Background-Profile.png'; 

export const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Contenedor Principal */}
      <div className="relative min-h-[85vh] flex items-center justify-center p-4">
        
        {/* --- CAPA 0: FONDO GEOMÉTRICO --- */}
        <div className="absolute bottom-0 right-0 w-[500px] opacity-40 pointer-events-none">
          <img
            src={Imagendefondo}
            alt="Fondo decorativo"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* --- CAPA 1: CONTENIDO --- */}
        <div className="relative z-10 w-full max-w-4xl">
            
            {/* Título fuera de la tarjeta */}
            <h1 className="text-3xl font-bold text-gobdocs-primary mb-6 ml-2">Tu perfil</h1>

            {/* TARJETA BLANCA */}
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-gray-100 relative">
                
                {/* Flecha de regreso interna (Como en tu diseño) */}
                <button 
                  onClick={() => navigate(-1)}
                  className="absolute top-8 left-8 text-gobdocs-primary hover:scale-110 transition-transform"
                >
                    <ArrowLeft size={32} strokeWidth={1.5} /> {/* Flecha larga y fina */}
                </button>

                {/* --- ICONO DE USUARIO GIGANTE --- */}
                <div className="flex justify-center mb-10">
                    <div className="w-32 h-32 border-2 border-gray-300 rounded-2xl flex items-center justify-center text-gobdocs-primary bg-white shadow-sm">
                        <User size={80} strokeWidth={1.5} />
                    </div>
                </div>

                {/* --- FORMULARIO --- */}
                <div className="space-y-6 max-w-2xl mx-auto">
                    
                    {/* Input: Nombre */}
                    <div>
                        <label className="block text-gobdocs-primary font-bold mb-2">Tu Nombre:</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Nombre" 
                                className="w-full border-2 border-gray-300 rounded-full py-3 px-6 text-gray-600 focus:outline-none focus:border-gobdocs-primary transition-colors"
                            />
                            <PenLine className="absolute right-6 top-1/2 -translate-y-1/2 text-gobdocs-primary cursor-pointer" size={20} />
                        </div>
                    </div>

                    {/* Input: Apellidos */}
                    <div>
                        <label className="block text-gobdocs-primary font-bold mb-2">Tu apellidos:</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Apellido" 
                                className="w-full border-2 border-gray-300 rounded-full py-3 px-6 text-gray-600 focus:outline-none focus:border-gobdocs-primary transition-colors"
                            />
                            <PenLine className="absolute right-6 top-1/2 -translate-y-1/2 text-gobdocs-primary cursor-pointer" size={20} />
                        </div>
                    </div>

                    {/* Input: Cédula (Sin lápiz, parece readonly en el diseño) */}
                    <div>
                        <label className="block text-gobdocs-primary font-bold mb-2">Tu Cedula:</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="000-000000-0" 
                                className="w-full border-2 border-gray-300 rounded-full py-3 px-6 text-gray-400 bg-gray-50 focus:outline-none"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Input: Teléfono */}
                    <div>
                        <label className="block text-gobdocs-primary font-bold mb-2">Tu número de telefono:</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="809-000-0000" 
                                className="w-full border-2 border-gray-300 rounded-full py-3 px-6 text-gray-600 focus:outline-none focus:border-gobdocs-primary transition-colors"
                            />
                            <PenLine className="absolute right-6 top-1/2 -translate-y-1/2 text-gobdocs-primary cursor-pointer" size={20} />
                        </div>
                    </div>

                    {/* Input: Email */}
                    <div>
                        <label className="block text-gobdocs-primary font-bold mb-2">Tu email</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                placeholder="example@email.com" 
                                className="w-full border-2 border-gray-300 rounded-full py-3 px-6 text-gray-600 focus:outline-none focus:border-gobdocs-primary transition-colors"
                            />
                            <PenLine className="absolute right-6 top-1/2 -translate-y-1/2 text-gobdocs-primary cursor-pointer" size={20} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};