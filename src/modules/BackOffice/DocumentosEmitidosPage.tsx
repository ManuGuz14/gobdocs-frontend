import { useEffect, useState } from "react";
import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import { useNavigate } from "react-router-dom";
import { Search, FileCheck, Calendar, User, Download } from "lucide-react";

export const DocumentosEmitidosPage = () => {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("APROBADA");

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
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
        console.error("Error fetching solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  // Filtrar solo las aprobadas/emitidas
  const aprobadas = solicitudes.filter((s) => {
    const estado = (s.Estado || "").toUpperCase();

    // Filtro por estado
    if (filterEstado === "APROBADA" && estado !== "APROBADA") return false;
    if (filterEstado === "TODAS" && estado !== "APROBADA" && estado !== "EMITIDA") return false;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const numSol = String(s.Numero_Solicitud || "").toLowerCase();
      const ciudadano = (s.usuario?.Nombre || s.usuario?.nombre || "").toLowerCase();
      const apellido = (s.usuario?.Apellido || s.usuario?.apellido || "").toLowerCase();
      const tipoDoc = (
        s.formulario?.tipoDocumento?.Nombre ||
        s.formulario?.Nombre ||
        ""
      ).toLowerCase();

      if (
        !numSol.includes(term) &&
        !ciudadano.includes(term) &&
        !apellido.includes(term) &&
        !tipoDoc.includes(term)
      ) {
        return false;
      }
    }

    return true;
  });

  // Ordenar por fecha más reciente
  const sorted = [...aprobadas].sort((a, b) => {
    const dateA = new Date(a.Fecha_Ultima_Actualizacion || a.Fecha_Emision || 0).getTime();
    const dateB = new Date(b.Fecha_Ultima_Actualizacion || b.Fecha_Emision || 0).getTime();
    return dateB - dateA;
  });

  return (
    <BackofficeLayout>
      <div className="min-h-[85vh] bg-[#f4f4f4] flex flex-col">

        {/* HEADER */}
        <div className="bg-gradient-to-b from-gobdocs-primary to-gobdocs-secondaryblue px-10 pt-12 pb-24 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Documentos Emitidos
          </h1>
          <p className="text-white/60 text-sm mb-8">
            Solicitudes aprobadas y documentos generados por tu institución
          </p>

          {/* SEARCH + FILTER */}
          <div className="max-w-3xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Buscar por número, ciudadano o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white rounded-full py-3.5 pl-12 pr-6 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg text-sm"
              />
            </div>

            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="bg-white rounded-full py-3.5 px-6 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg text-sm font-medium cursor-pointer"
            >
              <option value="APROBADA">Aprobadas</option>
              <option value="TODAS">Aprobadas + Emitidas</option>
            </select>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="max-w-6xl mx-auto w-full -mt-10 relative z-10 px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gobdocs-primary">
                {solicitudes.filter((s) => (s.Estado || "").toUpperCase() === "APROBADA").length}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Aprobadas</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-3xl font-extrabold text-green-600">
                {solicitudes.filter((s) => {
                  const docs = s.documentos || [];
                  return docs.length > 0;
                }).length}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Con documentos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-blue-500">
                {solicitudes.length}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total solicitudes</p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="max-w-6xl mx-auto w-full px-6 py-8">
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 mx-auto border-b-2 border-gobdocs-primary mb-4"></div>
              <p className="text-gray-500">Cargando documentos emitidos...</p>
            </div>
          ) : sorted.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Ciudadano</div>
                <div className="col-span-3">Documento</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-1">Estado</div>
                <div className="col-span-2 text-right">Acciones</div>
              </div>

              {/* Rows */}
              {sorted.map((item, index) => {
                const id =
                  item.Numero_Solicitud ||
                  item.Respuesta_ID ||
                  item.id ||
                  index;

                const ciudadano =
                  item.usuario?.Nombre ||
                  item.usuario?.nombre ||
                  "Ciudadano";

                const apellido =
                  item.usuario?.Apellido ||
                  item.usuario?.apellido ||
                  "";

                const tipoDoc =
                  item.formulario?.tipoDocumento?.Nombre ||
                  item.formulario?.Nombre ||
                  "Documento";

                const fecha = item.Fecha_Ultima_Actualizacion || item.Fecha_Emision
                  ? new Date(item.Fecha_Ultima_Actualizacion || item.Fecha_Emision).toLocaleDateString("es-DO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—";

                const tieneDocs = (item.documentos || []).length > 0;

                return (
                  <div
                    key={id}
                    className="grid grid-cols-12 gap-4 px-6 py-5 border-b last:border-0 items-center hover:bg-blue-50/30 transition-colors"
                  >
                    {/* # */}
                    <div className="col-span-1 text-sm font-bold text-gobdocs-primary">
                      {item.Numero_Solicitud || index + 1}
                    </div>

                    {/* Ciudadano */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-9 h-9 bg-gobdocs-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-gobdocs-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {ciudadano} {apellido}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {item.usuario?.email || item.usuario?.Email || ""}
                        </p>
                      </div>
                    </div>

                    {/* Documento */}
                    <div className="col-span-3 flex items-center gap-2">
                      <FileCheck size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{tipoDoc}</span>
                    </div>

                    {/* Fecha */}
                    <div className="col-span-2 flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} className="flex-shrink-0" />
                      {fecha}
                    </div>

                    {/* Estado */}
                    <div className="col-span-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        tieneDocs
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {tieneDocs ? "Emitido" : "Aprobada"}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div className="col-span-2 flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/backoffice/solicitud/${id}`)}
                        className="px-4 py-1.5 border border-gobdocs-primary text-gobdocs-primary rounded-lg text-xs font-medium hover:bg-gobdocs-primary hover:text-white transition"
                      >
                        Ver detalle
                      </button>

                      {tieneDocs && (
                        <button
                          onClick={() => navigate(`/backoffice/solicitud/${id}`)}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition flex items-center gap-1"
                        >
                          <Download size={12} />
                          Doc
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <FileCheck size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 text-lg">
                {searchTerm
                  ? "No se encontraron documentos con esa búsqueda."
                  : "No hay documentos emitidos aún."}
              </p>
            </div>
          )}
        </div>
      </div>
    </BackofficeLayout>
  );
};
