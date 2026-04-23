import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../shared/layouts/DashboardLayout";

export const SolicitudDetailPage = () => {
  const { id } = useParams();

  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_REACT_APP_BACKEND ||
          "https://gobdocs-backend.up.railway.app";

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/solicitudes/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setSolicitud(data);
        }
      } catch (error) {
        console.error("Error fetching solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSolicitud();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-[#1a2b5e] rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!solicitud) {
    return <div className="p-10">No encontrada</div>;
  }

  const respuestas = solicitud.respuesta?.Respuestas || {};
  const campos = solicitud.formulario?.Form_Definition?.campos || [];

  // 🔥 labels dinámicos desde backend
  const labelsMap: any = {};
  campos.forEach((c: any) => {
    labelsMap[c.name] = c.label;
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow p-8 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[#1a2b5e]">
              Solicitud #{solicitud.Numero_Solicitud}
            </h1>
            <p className="text-sm text-gray-500">
              {solicitud.formulario?.tipoDocumento?.Nombre}
            </p>
            <p className="text-xs text-gray-400">
              {solicitud.institucion?.Nombre}
            </p>
          </div>

          <span className={`px-4 py-1 rounded-full text-xs font-semibold ${
            solicitud.Estado === "APROBADA"
              ? "bg-green-100 text-green-700"
              : solicitud.Estado === "RECHAZADA"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {solicitud.Estado}
          </span>
        </div>

        {/* FECHAS */}
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
          <p><b>Emitida:</b> {new Date(solicitud.Fecha_Emision).toLocaleDateString()}</p>
          <p><b>Cierre:</b> {new Date(solicitud.Fecha_Cierre).toLocaleDateString()}</p>
          <p><b>Actualización:</b> {new Date(solicitud.Fecha_Ultima_Actualizacion).toLocaleDateString()}</p>
        </div>

        {/* COMENTARIOS */}
        {solicitud.Comentarios && (
          <div>
            <h2 className="font-semibold text-[#1a2b5e] mb-2">
              Comentarios
            </h2>
            <p className="bg-gray-50 p-4 rounded-lg text-gray-700">
              {solicitud.Comentarios}
            </p>
          </div>
        )}

        {/* RESPUESTAS */}
        <div>
          <h2 className="font-semibold text-[#1a2b5e] mb-4">
            Información enviada
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(respuestas).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-xs text-gray-500 uppercase">
                  {labelsMap[key] || key}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {value as string}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DOCUMENTOS 🔥 */}
        {solicitud.documentos?.length > 0 && (
          <div>
            <h2 className="font-semibold text-[#1a2b5e] mb-4">
              Documentos generados
            </h2>

            <div className="space-y-3">
              {solicitud.documentos.map((doc: any) => (
                <div
                  key={doc.Numero_Documento}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {doc.Nombre_Archivo}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.Fecha_Emision).toLocaleDateString()}
                    </p>
                  </div>

                  <a
                    href={`${import.meta.env.VITE_REACT_APP_BACKEND}/${doc.Url_Archivo}`}
                    target="_blank"
                    className="px-4 py-2 text-sm bg-gobdocs-primary text-white rounded-lg hover:opacity-90"
                  >
                    Descargar
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};