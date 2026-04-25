import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FileText,
  Building2,
  Loader2,
  CheckCircle,
  Plus,
  DollarSign,
} from "lucide-react";

export const CreateDocumentTypePage = () => {
  const navigate = useNavigate();

  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [loadingInst, setLoadingInst] = useState(true);

  const [selectedInstitucion, setSelectedInstitucion] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState<any>(null);

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  // Cargar instituciones
  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const res = await fetch(`${API_URL}/institution`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setInstituciones(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching instituciones:", error);
      } finally {
        setLoadingInst(false);
      }
    };

    fetchInstituciones();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInstitucion) {
      toast.warning("Selecciona una institución.");
      return;
    }

    if (!nombre.trim()) {
      toast.warning("El nombre del tipo de documento es obligatorio.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/document-type/institution/${selectedInstitucion}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: nombre.trim(),
            descripcion: descripcion.trim() || undefined,
          }),
        }
      );

      const data = await res.json();
      console.log("Response status:", res.status, "Data:", data);

      if (res.ok) {
        toast.success("¡Tipo de documento creado exitosamente!");
        setCreated(data);
      } else {
        toast.error(
          data.message || data.detail || "Error al crear el tipo de documento."
        );
      }
    } catch (error) {
      console.error("Error creando tipo de documento:", error);
      toast.error("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setNombre("");
    setDescripcion("");
    setCreated(null);
    // Mantener la institución seleccionada para crear más rápido
  };

  // Nombre de la institución seleccionada
  const instName =
    instituciones.find(
      (i) =>
        String(i.Institucion_ID || i.id) === selectedInstitucion
    )?.Nombre || "";

  return (
    <AdminLayout>
      <div className="min-h-[85vh] bg-[#f4f4f4]">

        {/* HEADER */}
        <div className="bg-gradient-to-b from-[#0f172a] to-[#334155] px-10 pt-10 pb-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Crear Tipo de Documento
          </h1>
          <p className="text-white/50 text-sm">
            Registra un nuevo tipo de documento para una institución
          </p>
        </div>

        <div className="max-w-2xl mx-auto -mt-10 relative z-10 px-6">
          <div className="bg-white rounded-2xl shadow-xl border p-8">

            {!created ? (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* ICONO */}
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <FileText size={28} className="text-blue-600" />
                  </div>
                </div>

                {/* INSTITUCIÓN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institución <span className="text-red-500">*</span>
                  </label>
                  {loadingInst ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm py-3">
                      <Loader2 size={16} className="animate-spin" />
                      Cargando instituciones...
                    </div>
                  ) : (
                    <div className="relative">
                      <Building2
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <select
                        value={selectedInstitucion}
                        onChange={(e) => setSelectedInstitucion(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pl-11 pr-6 text-sm text-gray-700 focus:outline-none focus:border-blue-400 transition cursor-pointer appearance-none"
                        required
                      >
                        <option value="">— Selecciona una institución —</option>
                        {instituciones.map((inst) => (
                          <option
                            key={inst.Institucion_ID || inst.id}
                            value={inst.Institucion_ID || inst.id}
                          >
                            {inst.Nombre || inst.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* NOMBRE * */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Acta de Nacimiento, Certificado de Buena Conducta"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition"
                    required
                  />
                </div>

                {/* DESCRIPCION */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ej: Certificado de nacimiento emitido por la JCE"
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition resize-none"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0f172a] to-[#334155] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Crear tipo de documento
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ÉXITO */
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-green-500" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ¡Tipo de documento creado!
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  <strong>{nombre}</strong> ha sido registrado para la institución{" "}
                  <strong>{instName}</strong>.
                </p>

                <div className="flex flex-col gap-3 items-center">
                  <button
                    onClick={() => {
                      const docId = created?.TipoDocumento_ID || created?.id || "";
                      navigate(`/admin/tarifas?tipoDocumentoId=${docId}&docNombre=${encodeURIComponent(nombre)}`);
                    }}
                    className="w-full max-w-xs py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition flex items-center justify-center gap-2"
                  >
                    <DollarSign size={16} />
                    Asignar tarifas
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                    >
                      Crear otro
                    </button>
                    <button
                      onClick={() => navigate("/admin")}
                      className="px-6 py-2.5 bg-[#0f172a] text-white rounded-xl font-medium hover:opacity-90 transition"
                    >
                      Volver al panel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-10"></div>
      </div>
    </AdminLayout>
  );
};
