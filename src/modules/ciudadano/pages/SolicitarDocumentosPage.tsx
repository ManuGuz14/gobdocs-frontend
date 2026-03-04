import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';

export const SolicitarDocumentosPage = () => {
    const navigate = useNavigate();
    const carouselRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };
    // Dummy data for documents
    const documents = [
        { id: 1, name: 'Certificado de Nacimiento' },
        { id: 2, name: 'Acta de Matrimonio' },
        { id: 3, name: 'Certificado de Defunción' },
        { id: 4, name: 'Récord Policial' },
        { id: 5, name: 'Certificado de Título' },
        { id: 6, name: 'Acta de Divorcio' },
        { id: 7, name: 'Certificación de Inmueble' },
        { id: 8, name: 'Historial de Tránsito' },
        { id: 9, name: 'Certificado Médico' },
        { id: 10, name: 'Declaración Jurada' },
    ];

    const handleRequest = () => {
        navigate('/portal/solicitud');
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col w-full h-full min-h-[85vh]">
                {/* Header Hero Section */}
                <div className="bg-gobdocs-primary w-full py-16 flex flex-col items-center justify-center">
                    <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">
                        Elige los documentos a solicitar
                    </h1>
                    <div className="relative w-full max-w-2xl px-4">
                        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-3 rounded-full outline-none text-gray-700 shadow-sm bg-white font-medium"
                            placeholder="Search"
                        />
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="flex-1 w-full bg-white relative py-16 overflow-hidden">
                    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative">

                        {/* Left Arrow */}
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 lg:left-8 top-1/2 -translate-y-1/2 z-10 p-2 text-gobdocs-primary hover:bg-blue-50 rounded-full transition-colors hidden md:block"
                        >
                            <ChevronLeft size={36} />
                        </button>

                        {/* Carousel Container */}
                        <div
                            ref={carouselRef}
                            className="flex overflow-x-auto gap-8 snap-x snap-mandatory px-8 md:px-16 lg:px-24 hide-scrollbar justify-start py-4"
                        >
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="min-w-[280px] w-[280px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden flex-shrink-0 snap-center border border-gray-100 flex flex-col"
                                >
                                    {/* Card Image Placeholder */}
                                    <div className="bg-[#0f3a61] h-36 w-full flex items-center justify-center">
                                        <ImageIcon className="text-white w-10 h-10" />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex flex-col items-center flex-1 justify-between gap-6">
                                        <h3 className="text-[#0f3a61] font-bold text-lg text-center mt-2">
                                            {doc.name}
                                        </h3>
                                        <button
                                            onClick={handleRequest}
                                            className="w-full bg-white text-[#0f3a61] border-2 border-[#0f3a61] py-2 px-4 rounded-xl font-semibold hover:bg-[#0f3a61] hover:text-white transition-all duration-300"
                                        >
                                            Solicitar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 lg:right-8 top-1/2 -translate-y-1/2 z-10 p-2 text-gobdocs-primary hover:bg-blue-50 rounded-full transition-colors hidden md:block"
                        >
                            <ChevronRight size={36} />
                        </button>

                    </div>

                    {/* Bottom left decorative dots (simulating the design pattern) */}
                    <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #0f3a61 30%, transparent 30%), radial-gradient(circle, #e53935 30%, transparent 30%)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 10px 10px',
                            clipPath: 'polygon(0 100%, 0 0, 100% 100%)',
                            opacity: 0.8
                        }}>
                    </div>
                </div>
            </div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </DashboardLayout>
    );
};
