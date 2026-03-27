import { useEffect, useState, useRef } from "react";
import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import { Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmitirPage = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [comentario, setComentario] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAllSolicitudes();
  }, []);

  const fetchAllSolicitudes = async () => {
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
        // Optionally filter by PENDIENTE, but let's show all for now
        setSolicitudes(dataArray);
      }
    } catch (error) {
      console.error("Error fetching all solicitudes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedId || !file) {
      alert("Por favor adjunta un documento (ej. blank.pdf) para emitir.");
      return;
    }

    try {
      setSubmitting(true);
      const API_URL =
        import.meta.env.VITE_REACT_APP_BACKEND ||
        "https://gobdocs-backend.up.railway.app";
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);
      if (comentario) {
        formData.append("comentario", comentario);
      }

      const res = await fetch(`${API_URL}/solicitudes/${selectedId}/documento`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Solicitud aprobada y documento emitido correctamente.");
        closeModal();
        fetchAllSolicitudes(); // Refresh list to reflect changes
      } else {
        const err = await res.json();
        alert(`Error: ${err.message || "No se pudo emitir"}`);
      }
    } catch (error) {
      console.error("Error en submit:", error);
      alert("Ocurrió un error inesperado al emitir.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedId(null);
    setFile(null);
    setComentario("");
  };

  return (
    <BackofficeLayout>
      <div className="relative min-h-[85vh] bg-white overflow-hidden flex flex-col items-center py-14 px-8">
        
        {/* Background Decorative Patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-10 -left-10 w-64 h-64 border-[40px] border-[#f4a59a] rounded-full opacity-80"></div>
          <div className="absolute top-40 -left-20 w-80 h-80 border-[50px] border-[#8e9ca8] rounded-full opacity-80"></div>
          <div className="absolute -bottom-10 left-32 w-72 h-72 border-[40px] border-[#f4a59a] rounded-full opacity-80"></div>
          <div className="absolute bottom-[-100px] -left-10 w-48 h-48 bg-[#8e9ca8] rounded-full opacity-80"></div>
          
          <div className="absolute bottom-10 -right-10 w-64 h-64 bg-[#1a2b5e] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] opacity-90 transform -rotate-12"></div>
        </div>

        {/* TITLE */}
        <h1 className="relative z-10 text-3xl font-bold text-[#1a2b5e] mb-10">
          Administración de Solicitudes
        </h1>

        {/* CONTAINER */}
        <div className="relative z-10 w-full max-w-6xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-12 border border-gray-100">
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2b5e]"></div>
            </div>
          ) : solicitudes.length > 0 ? (
            <div className="grid grid-cols-2 gap-8">
              {solicitudes.map((solicitud, index) => {
                const id =
                  solicitud.Numero_Solicitud ||
                  solicitud.Respuesta_ID ||
                  solicitud.id ||
                  index;

                const isAprobada = solicitud.Estado === "APROBADA";

                return (
                  <div
                    key={id}
                    className="flex flex-row items-center gap-6 border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white"
                  >
                    {/* IMAGE */}
                    <div className="w-32 h-20 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex shrink-0 shadow-inner" />

                    {/* TEXT */}
                    <div className="flex-1 overflow-hidden flex flex-col items-start relative">
                      {isAprobada && (
                        <span className="absolute top-0 right-0 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                          APROBADA
                        </span>
                      )}
                      
                      <p className="text-[#3b82f6] text-sm font-semibold mb-2">
                        Solicitud #{solicitud.Numero_Solicitud || index + 1}
                      </p>

                      <p className="text-xs text-gray-500 mb-5 line-clamp-2 leading-relaxed">
                        {solicitud.Descripcion || 
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"}
                      </p>

                      <div className="w-full flex justify-center">
                        <button
                          onClick={() => !isAprobada && navigate(`/backoffice/aprobar/${id}`)}
                          disabled={isAprobada}
                          className={`px-10 py-1 border rounded-full text-xs font-medium transition ${
                            isAprobada 
                              ? "border-green-500 text-green-600 bg-green-50 opacity-50 cursor-not-allowed" 
                              : "border-[#1a2b5e] text-[#1a2b5e] hover:bg-[#1a2b5e] hover:text-white"
                          }`}
                        >
                          {isAprobada ? "Emitida" : "Ver"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex flex-row items-center gap-6 border border-gray-100 rounded-xl p-6 shadow-sm bg-white">
                  <div className="w-32 h-20 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 shrink-0 shadow-inner" />
                  <div className="flex-1 flex flex-col items-start">
                    <p className="text-[#3b82f6] text-sm font-semibold mb-2">Solicitud #{item}</p>
                    <p className="text-xs text-gray-400 mb-5 leading-relaxed pr-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    <div className="w-full flex justify-center">
                      <button 
                        onClick={() => navigate(`/backoffice/aprobar/${item}`)}
                        className="px-10 py-1 border border-[#1a2b5e] text-[#1a2b5e] rounded-full text-xs font-medium hover:bg-[#1a2b5e] hover:text-white transition">
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EMITIR MODAL */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-[#1a2b5e] mb-2">Emitir Documento</h2>
            <p className="text-sm text-gray-500 mb-6">
              Sube el documento oficial para aprobar la solicitud #{selectedId}.
            </p>

            {/* File Upload Area */}
            <div 
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 mb-6 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="text-[#3b82f6] mb-3" size={32} />
              <p className="text-sm text-gray-700 font-medium text-center">
                {file ? file.name : "Haz clic o arrastra tu PDF aquí"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Solo archivos PDF o imágenes"}
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>

            {/* Comments Area */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Comentarios Adicionales (Opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Ej. Documento validado correctamente..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none resize-none h-24"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-[#1a2b5e] text-white rounded-lg font-medium hover:bg-[#1a2b5e]/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Aprobar y Emitir"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </BackofficeLayout>
  );
};
