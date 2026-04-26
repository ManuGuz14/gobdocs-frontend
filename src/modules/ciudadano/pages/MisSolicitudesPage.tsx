import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';
import { Search, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MisSolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [canceling, setCanceling] = useState(false);

  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
          "https://gobdocs-backend.up.railway.app";
  const token = localStorage.getItem("token");

  const fetchMisSolicitudes = async () => {
    try {
      const res = await fetch(`${API_URL}/solicitudes/mis-solicitudes`, {
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
      console.error("Error fetching mis solicitudes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMisSolicitudes();
  }, []);

  // 🔥 abrir modal
  const openCancelModal = (id: number) => {
    setSelectedId(id);
    setShowCancelModal(true);
  };

  // 🔥 confirmar cancelación
  const handleConfirmCancel = async () => {
    if (!selectedId) return;

    try {
      setCanceling(true);

      const res = await fetch(`${API_URL}/solicitudes/${selectedId}/cancelar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      setShowCancelModal(false);
      setSelectedId(null);

      // refresh
      fetchMisSolicitudes();
    } catch (err) {
      console.error(err);
      alert("Error cancelando solicitud");
    } finally {
      setCanceling(false);
    }
  };

  const filteredSolicitudes = solicitudes.filter((item) => {
    const searchString = `${item.Numero_Solicitud || ''} ${item.Estado || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
    <DashboardLayout>
      <div className="min-h-[80vh] flex flex-col">

        {/* HEADER */}
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
              placeholder="Buscar por número o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg transition-all"
            />
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="max-w-4xl mx-auto w-full -mt-12 relative z-10 px-4">
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 mx-auto border-b-2 border-gobdocs-primary mb-4"></div>
              <p className="text-gray-500">Cargando tus solicitudes...</p>
            </div>
          ) : filteredSolicitudes.length > 0 ? (
            <div className="space-y-4">
              {filteredSolicitudes.map((item, index) => {
                const id =
                  item.Numero_Solicitud ||
                  item.Respuesta_ID ||
                  item.id ||
                  index;

                const fecha = item.Fecha_Emision
                  ? new Date(item.Fecha_Emision).toLocaleDateString()
                  : "Fecha no disponible";

                const estado = (item.Estado || "").toUpperCase();

                const puedePagar = estado === "PENDIENTE";
                const puedeCancelar = estado === "PENDIENTE";

                return (
                  <div
                    key={id}
                    onClick={() => navigate(`/portal/mi-solicitud/${id}`)}
                    className="cursor-pointer bg-white border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:shadow-md transition"
                  >
                    <div>
                      <h3 className="font-bold text-lg text-gobdocs-primary">
                        Solicitud #{item.Numero_Solicitud || index + 1}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Fecha: {fecha}
                      </p>

                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-3 uppercase tracking-wider ${
                          estado === "APROBADA"
                            ? "bg-green-100 text-green-700"
                            : estado === "RECHAZADA"
                            ? "bg-red-100 text-red-700"
                            : estado === "CANCELADA"
                            ? "bg-gray-200 text-gray-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {estado || "PENDIENTE"}
                      </span>
                    </div>

                    <div
                      className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(`/portal/mi-solicitud/${id}`)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg font-medium hover:bg-blue-100 transition"
                      >
                        Ver detalles
                      </button>

                      {puedePagar && (
                        <button
                          onClick={() => navigate(`/portal/pago/${id}`)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                        >
                          Pagar ahora
                        </button>
                      )}

                      {puedeCancelar && (
                        <button
                          onClick={() => openCancelModal(id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-lg">
                {searchTerm
                  ? "No se encontraron solicitudes con esa búsqueda."
                  : "No tienes solicitudes registradas aún."}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>

    {/* 🔥 MODAL CONFIRMACIÓN */}
    {showCancelModal && (
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">

          <button
            onClick={() => setShowCancelModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={32} className="text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ¿Cancelar solicitud?
            </h3>

            <p className="text-gray-500 text-sm mb-8">
              Esta acción cancelará tu solicitud pendiente. Podrás crear una nueva si lo deseas.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Volver
              </button>

              <button
                onClick={handleConfirmCancel}
                disabled={canceling}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {canceling ? "Cancelando..." : "Sí, cancelar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};