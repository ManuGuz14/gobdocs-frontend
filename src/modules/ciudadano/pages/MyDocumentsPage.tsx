import { useRef, useEffect, useState } from 'react';
import { Search, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';

export const MyDocumentsPage = () => {

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_REACT_APP_BACKEND ||
          "https://gobdocs-backend.up.railway.app";

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/solicitudes/mis-solicitudes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const solicitudes = Array.isArray(data) ? data : data.solicitudes || [];

          // 🔥 EXTRAER DOCUMENTOS DE TODAS LAS SOLICITUDES
          const docs = solicitudes.flatMap((sol: any) =>
            (sol.documentos || []).map((doc: any) => ({
              ...doc,
              solicitudId: sol.Numero_Solicitud,
            }))
          );

          setDocuments(docs);
        }
      } catch (error) {
        console.error("Error fetching documentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-[80vh] flex flex-col">

        {/* HEADER */}
        <div className="bg-gradient-to-b from-gobdocs-primary to-gobdocs-secondaryblue -mx-6 md:-mx-8 px-6 md:px-8 pt-12 pb-24 text-center relative shadow-xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Tus documentos emitidos
          </h1>

          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar documento..."
              className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg transition-all"
            />
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 max-w-7xl mx-auto w-full mt-12 px-4 pb-20">

          {loading ? (
            <div className="text-center mt-10">Cargando documentos...</div>
          ) : documents.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              No tienes documentos aún.
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 md:gap-8">

              {/* LEFT */}
              <button onClick={() => scroll('left')} className="hidden md:flex p-3 border rounded-full">
                <ChevronLeft size={32} />
              </button>

              {/* CAROUSEL */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 scrollbar-hide w-full"
              >
                {documents.map((doc, index) => (
                  <div key={index} className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">

                    <div className="h-40 bg-[#1a2b5e] flex items-center justify-center">
                      <ImageIcon className="text-white" size={48} />
                    </div>

                    <div className="p-6 text-center">
                      <h3 className="font-bold text-[#1a2b5e] text-lg mb-2">
                        {doc.Nombre_Archivo}
                      </h3>

                      <p className="text-xs text-gray-400 mb-4">
                        Solicitud #{doc.solicitudId}
                      </p>

                      <a
                        href={`${import.meta.env.VITE_REACT_APP_BACKEND}/${doc.Url_Archivo}`}
                        target="_blank"
                        className="w-full border-2 border-[#1a2b5e] text-[#1a2b5e] py-2 px-4 rounded-full font-medium hover:bg-[#1a2b5e] hover:text-white transition text-sm inline-block"
                      >
                        Ver PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT */}
              <button onClick={() => scroll('right')} className="hidden md:flex p-3 border rounded-full">
                <ChevronRight size={32} />
              </button>

            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};