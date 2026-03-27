import { useEffect, useState, useRef } from "react";
import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import { FileText, User, IdCard, Upload } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export const VerSolicitudBkOfficePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [comentario, setComentario] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_REACT_APP_BACKEND ||
          "https://gobdocs-backend.up.railway.app";
        const token = localStorage.getItem("token");

        // Assuming there isn't a direct GET /solicitudes/:id endpoint that we know of,
        // we fetch all for the institution and find the one.
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAprobar = async () => {
    if (!file) {
      alert(
        "Por favor adjunta un documento para emitir y aprobar la solicitud."
      );
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

      const res = await fetch(`${API_URL}/solicitudes/${id}/documento`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Solicitud aprobada y documento emitido correctamente.");
        navigate("/backoffice");
      } else {
        const err = await res.json();
        alert(`Error al aprobar: ${err.message || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error aprobando:", error);
      alert("Ocurrió un error al aprobar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <BackofficeLayout>
        <div className="bg-[#f4f4f4] min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gobdocs-primary"></div>
        </div>
      </BackofficeLayout>
    );
  }

  if (!solicitud) {
    return (
      <BackofficeLayout>
        <div className="bg-[#f4f4f4] min-h-[80vh] flex items-center justify-center flex-col gap-4">
          <p className="text-xl text-gray-500">Solicitud no encontrada.</p>
          <button
            onClick={() => navigate("/backoffice")}
            className="text-blue-600 underline"
          >
            Volver
          </button>
        </div>
      </BackofficeLayout>
    );
  }

  return (
    <BackofficeLayout>
      <div className="bg-[#f4f4f4] min-h-[80vh] flex items-center justify-center px-6 py-10">
        <div className="bg-white rounded-2xl shadow-xl w-[900px] p-10">
          <h1 className="text-3xl font-bold text-center text-gobdocs-primary mb-10">
            Revisión de Solicitud
          </h1>

          <div className="grid grid-cols-2 gap-10">
            {/* LEFT SIDE */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Solicitud #{solicitud.Numero_Solicitud || id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    solicitud.Estado === "APROBADA"
                      ? "bg-green-100 text-green-700"
                      : solicitud.Estado === "RECHAZADA"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {solicitud.Estado || "PENDIENTE"}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                Información del ciudadano y la solicitud.
              </p>

              <div className="space-y-4 text-sm bg-gray-50 p-6 rounded-xl border">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-gobdocs-primary" />
                  <span className="font-medium text-gray-700">
                    Nombre: {solicitud.usuario?.Nombre || "No disponible"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <IdCard size={18} className="text-gobdocs-primary" />
                  <span className="font-medium text-gray-700">
                    Cédula: {solicitud.usuario?.Cedula || "No disponible"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gobdocs-primary" />
                  <span className="font-medium text-gray-700">
                    Fecha Emisión:{" "}
                    {solicitud.Fecha_Emision
                      ? new Date(solicitud.Fecha_Emision).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <h2 className="font-semibold mb-4">Emisión de Documento</h2>

              {solicitud.Estado === "APROBADA" ? (
                <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-4 mb-4">
                  Esta solicitud ya ha sido aprobada.
                  <br />
                  <span className="text-sm">
                    Comentarios: {solicitud.Comentarios || "Ninguno"}
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-2">
                    Para aprobar, adjunta el documento final:
                  </p>

                  {/* FILE UPLOAD CARD */}
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 mb-6 cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-600 font-medium">
                      {file ? file.name : "Haz clic para subir documento"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {file
                        ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        : "PDF, JPG, PNG"}
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  {/* COMMENTS */}
                  <h2 className="font-semibold mb-2">Comentarios</h2>
                  <input
                    type="text"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Ej. Documento validado correctamente..."
                    className="w-full border rounded-lg px-3 py-2 mb-8"
                  />

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={handleAprobar}
                      disabled={submitting}
                      className="px-6 py-2 bg-[#1a2b5e] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                    >
                      {submitting ? "Procesando..." : "Aprobar y Emitir"}
                    </button>
                    <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                      Rechazar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackofficeLayout>
  );
};