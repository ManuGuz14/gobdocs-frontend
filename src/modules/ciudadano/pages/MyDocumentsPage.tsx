import { useRef } from 'react'; // <--- 1. Importamos useRef
import { Search, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';

export const MyDocumentsPage = () => {
  // Aumentamos a 8 documentos para que haya suficiente contenido para mover
  const documents = Array(8).fill({ title: 'Documento X.PDF' });

  // 2. Referencia al contenedor que tiene el scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 3. Función para mover el scroll
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300; // (Ancho de tarjeta 256px + Gap 24px aprox)
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-[80vh] flex flex-col">
        
        {/* --- HEADER AZUL --- */}
        <div className="bg-gradient-to-b from-gobdocs-primary to-gobdocs-secondaryblue -mx-6 md:-mx-8 px-6 md:px-8 pt-12 pb-24 text-center relative shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Elige los documentos a visualizar
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

        {/* --- CARROUSEL DE TARJETAS --- */}
        <div className="flex-1 max-w-7xl mx-auto w-full mt-12 px-4 pb-20">
            
            <div className="flex items-center justify-center gap-4 md:gap-8">
                
                {/* BOTÓN IZQUIERDA (Con evento onClick) */}
                <button 
                    onClick={() => scroll('left')}
                    className="hidden md:flex p-3 text-[#1a2b5e] hover:bg-blue-50 rounded-full transition-colors border border-gray-200 shadow-sm active:scale-95"
                >
                    <ChevronLeft size={32} />
                </button>

                {/* CONTENEDOR (Con ref={scrollContainerRef}) */}
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 scrollbar-hide w-full justify-start md:justify-start scroll-smooth"
                >
                    
                    {documents.map((doc, index) => (
                        <div key={index} className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden cursor-pointer">
                            
                            <div className="h-40 bg-[#1a2b5e] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
                                <ImageIcon className="text-white opacity-80 group-hover:scale-110 transition-transform duration-500" size={48} />
                            </div>

                            <div className="p-6 text-center">
                                <h3 className="font-bold text-[#1a2b5e] text-lg mb-4">
                                    {doc.title} {index + 1} {/* Agregué el número para que veas que se mueven */}
                                </h3>
                                
                                <button className="w-full border-2 border-[#1a2b5e] text-[#1a2b5e] py-2 px-4 rounded-full font-medium hover:bg-[#1a2b5e] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm">
                                    Visualizar
                                </button>
                            </div>
                        </div>
                    ))}

                </div>

                {/* BOTÓN DERECHA (Con evento onClick) */}
                <button 
                    onClick={() => scroll('right')}
                    className="hidden md:flex p-3 text-[#1a2b5e] hover:bg-blue-50 rounded-full transition-colors border border-gray-200 shadow-sm active:scale-95"
                >
                    <ChevronRight size={32} />
                </button>
            </div>

        </div>

        {/* Decoración */}
        <div className="fixed bottom-0 left-0 pointer-events-none hidden md:block">
            <div className="relative w-40 h-40">
                 <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[100px] border-l-[#1a2b5e] border-t-[100px] border-t-transparent opacity-10"></div>
                 <div className="absolute bottom-0 left-20 w-4 h-4 rounded-full bg-[#d94032]"></div>
                 <div className="absolute bottom-12 left-8 w-3 h-3 rounded-full bg-[#1a2b5e]"></div>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
};