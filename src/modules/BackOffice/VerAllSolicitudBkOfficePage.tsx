import { useEffect, useState } from "react";
import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import { useNavigate } from "react-router-dom";

export const VerAllSolicitudBkOfficePage = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          setSolicitudes(dataArray);
        }
      } catch (error) {
        console.error("Error fetching all solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSolicitudes();
  }, []);

  return (
    <BackofficeLayout>
      <div className="min-h-[85vh] bg-[#f4f4f4] flex flex-col items-center py-14 px-8">
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-[#1a2b5e] mb-10">
          Administración de Solicitudes
        </h1>

        {/* CONTAINER */}
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-10 border">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gobdocs-primary"></div>
            </div>
          ) : solicitudes.length > 0 ? (
            <div className="grid grid-cols-2 gap-10">
              {solicitudes.map((solicitud, index) => {
                const id =
                  solicitud.Numero_Solicitud ||
                  solicitud.Respuesta_ID ||
                  solicitud.id ||
                  index;

                return (
                  <div
                    key={id}
                    className="flex items-center gap-6 border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                  >
                    {/* IMAGE */}
                    <div className="w-28 h-16 rounded-lg bg-gradient-to-r from-purple-700 to-blue-500 flex shrink-0" />

                    {/* TEXT */}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm text-gray-500 mb-1">
                        Solicitud #{solicitud.Numero_Solicitud || index + 1}
                      </p>

                      <p className="text-sm font-semibold text-gray-800 mb-1 truncate">
                        {solicitud.usuario?.Nombre || "Ciudadano"}
                      </p>
                      <p className="text-xs text-gray-500 mb-3 truncate border px-2 py-0.5 rounded inline-block">
                        Estado: {solicitud.Estado || "PENDIENTE"}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <button
                          onClick={() => navigate(`/backoffice/solicitud/${id}`)}
                          className="px-6 py-1 border border-[#1a2b5e] text-[#1a2b5e] rounded-full text-sm hover:bg-[#1a2b5e] hover:text-white transition"
                        >
                          Ver Detalle
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No hay solicitudes disponibles para la institución.
            </div>
          )}
        </div>
      </div>
    </BackofficeLayout>
  );
};