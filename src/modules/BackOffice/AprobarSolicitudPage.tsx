import { useEffect, useState } from "react";
import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import { UserCircle2, IdCard, FileText, BadgeCheck } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ImageDeFondo from "../../assets/ImagendeFondo.png";

export const AprobarSolicitudPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_REACT_APP_BACKEND ||
          "https://gobdocs-backend.up.railway.app";
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/solicitudes/institucion`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const dataArray = Array.isArray(data) ? data : data.solicitudes || [];
          const found = dataArray.find(
            (s: any) =>
              String(s.Numero_Solicitud) === id ||
              String(s.Respuesta_ID) === id ||
              String(s.id) === id
          );
          setSolicitud(found || null);
        }
      } catch (error) {
        console.error("Error fetching solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSolicitud();
  }, [id]);

  const handleAprobar = async () => {
      alert("Para emitir y aprobar esta solicitud diríjase al proceso de validación final o integre el endpoint correspondiente.");
      // You can navigate or make the API call here if fully implementing.
      // Example: navigate(`/backoffice/solicitudes`);
  };

  const handleRechazar = async () => {
      alert("Solicitud rechazada");
  };

  if (loading) {
    return (
      <BackofficeLayout>
        <div className="min-h-[85vh] bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2b5e]"></div>
        </div>
      </BackofficeLayout>
    );
  }

  return (
    <BackofficeLayout>
      <div className="relative min-h-[85vh] bg-white overflow-hidden flex flex-col items-center justify-center p-8">
        
        {/* Abstract Background Left */}
        {/* We use an image if 'ImagendeFondo.png' exists, else fallback to a geometric CSS pattern */}
        <div className="absolute top-0 left-0 bottom-0 w-[45%] pointer-events-none z-0 overflow-hidden hidden md:block">
           <div className="w-full h-full bg-no-repeat bg-cover bg-left opacity-90" style={{backgroundImage: `url(${ImageDeFondo})`, backgroundSize: '150%'}} />
           {/* Fallback pattern just in case ImageDeFondo isn't the exact geometric pattern */}
           <div className="absolute inset-0 bg-[#1a2b5e]/5 mix-blend-multiply" />
        </div>

        {/* Abstract Blob Right */}
        <div className="absolute right-[2%] top-[10%] w-[350px] h-[450px] bg-[#1a2b5e] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] pointer-events-none z-0 hidden lg:block rotate-12 opacity-95"></div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
            {/* Header / Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1a2b5e] mb-12 z-10 text-center tracking-tight">
                Emitir Solicitud
            </h1>

            {/* Main Card */}
            <div className="bg-white rounded-[1.5rem] shadow-[0_15px_60px_-15px_rgba(0,0,0,0.15)] px-10 py-14 w-full flex flex-col lg:flex-row gap-16 relative border border-gray-50">

                {/* Left Side: Info */}
                <div className="flex-1 space-y-6 text-[#1a2b5e]">
                   <h2 className="text-3xl font-bold text-[#1a2b5e]">
                      Solicitud #{solicitud?.Numero_Solicitud || id?.padStart(4, "0") || "0069"}
                   </h2>
                   
                   <p className="text-lg text-[#1a2b5e]/80 leading-relaxed max-w-sm font-medium mt-4">
                      {solicitud?.Descripcion || "Esta solicitud consiste en la emision nueva de una licencia de conducir"}
                   </p>

                   <div className="space-y-5 mt-10">
                      <div className="flex items-center gap-4 text-lg">
                         <div className="text-[#1a2b5e]"><UserCircle2 size={32} strokeWidth={2.5} /></div>
                         <span className="font-medium text-[#1a2b5e]">{solicitud?.usuario?.Nombre || "Juan Perez"}</span>
                      </div>

                      <div className="flex items-center gap-4 text-lg">
                         <div className="text-[#1a2b5e]"><IdCard size={32} strokeWidth={2.5} /></div>
                         <span className="font-medium text-[#1a2b5e]">Cedula: {solicitud?.usuario?.Cedula || "402-0000000-0"}</span>
                      </div>

                      <div className="flex items-center gap-4 text-lg">
                         <div className="text-[#1a2b5e]"><FileText size={32} strokeWidth={2.5} /></div>
                         <span className="font-medium text-[#1a2b5e]">Documento: {solicitud?.Nombre_Documento || "Licencia de conducir"}</span>
                      </div>

                      <div className="flex items-center gap-4 text-lg">
                         <div className="text-[#1a2b5e]"><BadgeCheck size={32} strokeWidth={2.5} /></div>
                         <span className="font-medium text-[#1a2b5e]">Aprobado por: Rodolfo Cuevas</span>
                      </div>
                   </div>
                </div>

                {/* Right Side: Document inner card & Buttons */}
                <div className="flex-1 flex flex-col items-center justify-center pt-8 lg:pt-0">
                    
                    {/* Inner Card */}
                    <div className="w-full max-w-[28rem] bg-white border border-gray-100 rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:px-10 flex items-center justify-between mb-12">
                       <div className="flex flex-col text-sm text-[#1a2b5e]/70 font-medium tracking-wide">
                          <span>Documento X</span>
                          <span className="mt-1">#{id?.padStart(4, "0") || "0069"}</span>
                       </div>

                       <div className="flex items-center gap-4 border-l border-r border-gray-100 px-6 mx-2 min-w-[150px]">
                           <div className="flex flex-col items-center relative text-red-600">
                               <FileText size={44} strokeWidth={1.5} />
                               <span className="absolute -bottom-2 bg-red-600 text-white text-[10px] font-bold px-2 py-[2px] rounded border-2 border-white tracking-widest leading-none">PDF</span>
                           </div>

                           <div className="flex flex-col flex-1">
                               <span className="text-xs font-semibold text-[#1a2b5e] border-b border-[#1a2b5e] pb-1 w-full text-center tracking-wide">Cedula.pdf</span>
                               <span className="text-xs font-bold text-[#1a2b5e]/80 mt-1.5 text-center w-full">38MB</span>
                           </div>
                       </div>
                       
                       <div className="text-[#517fa4] relative flex-shrink-0">
                          {/* A nice multi-pointed star check badge. */}
                          <BadgeCheck size={32} strokeWidth={2} className="text-[#0f4082] fill-[#2k4d8b]/10" />
                          <div className="absolute inset-0 bg-[#0f4082] rounded-full scale-50 -z-10" />
                          <svg className="absolute inset-0 w-full h-full text-white scale-[0.6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                          </svg>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full max-w-[28rem] gap-5 justify-center">
                        <button 
                            className="bg-[#0b336e] text-white flex-1 py-3.5 rounded-xl font-semibold text-lg hover:bg-[#072551] transition shadow-lg shadow-[#0b336e]/20"
                            onClick={handleAprobar}
                        >
                            Emitir
                        </button>
                        <button 
                            className="bg-[#e74c3c] text-white flex-1 py-3.5 rounded-xl font-semibold text-lg hover:bg-[#c0392b] transition shadow-lg shadow-[#e74c3c]/20"
                            onClick={handleRechazar}
                        >
                            Rechazar
                        </button>
                    </div>

                </div>

            </div>
        </div>

      </div>
    </BackofficeLayout>
  );
};
