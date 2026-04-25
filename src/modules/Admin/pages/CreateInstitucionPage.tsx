import React, { useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Building2, Loader2, CheckCircle } from "lucide-react";

export const CreateInstitucionPage = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState<any>(null);

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.warning("El nombre de la institución es obligatorio.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/institution/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || undefined,
          direccion: direccion.trim() || undefined,
          telefono: telefono.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();
      console.log("Response status:", res.status, "Data:", data);

      if (res.ok) {
        toast.success("¡Institución creada exitosamente!");
        setCreated(data);
      } else {
        if (res.status === 409) {
          toast.error(`La institución "${nombre}" ya existe en el sistema.`);
        } else {
          toast.error(
            data.message || data.detail || "Error al crear la institución."
          );
        }
      }
    } catch (error) {
      console.error("Error creando institución:", error);
      toast.error("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setNombre("");
    setDescripcion("");
    setDireccion("");
    setTelefono("");
    setEmail("");
    setCreated(null);
  };

  return (
    <AdminLayout>
      <div className="min-h-[85vh] bg-[#f4f4f4]">

        {/* HEADER */}
        <div className="bg-gradient-to-b from-[#0f172a] to-[#334155] px-10 pt-10 pb-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Crear Institución
          </h1>
          <p className="text-white/50 text-sm">
            Registra una nueva institución gubernamental en la plataforma
          </p>
        </div>

        <div className="max-w-2xl mx-auto -mt-10 relative z-10 px-6">
          <div className="bg-white rounded-2xl shadow-xl border p-8">

            {!created ? (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* ICONO */}
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Building2 size={28} className="text-purple-600" />
                  </div>
                </div>

                {/* NOMBRE * */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la institución <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Ministerio de Educación"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition"
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
                    placeholder="Breve descripción de la institución..."
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition resize-none"
                  />
                </div>

                {/* DIRECCION */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ej: Av. Máximo Gómez #2, Santo Domingo"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition"
                  />
                </div>

                {/* TELEFONO + EMAIL */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="809-555-0000"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contacto@institucion.gob.do"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
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
                      <Building2 size={18} />
                      Crear institución
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
                  ¡Institución creada!
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  La institución <strong>{nombre}</strong> ha sido registrada exitosamente.
                </p>

                {(created.Institucion_ID || created.id) && (
                  <p className="text-xs text-gray-400 mb-6">
                    ID: {created.Institucion_ID || created.id}
                  </p>
                )}

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Crear otra
                  </button>
                  <button
                    onClick={() => navigate("/admin")}
                    className="px-6 py-2.5 bg-[#0f172a] text-white rounded-xl font-medium hover:opacity-90 transition"
                  >
                    Volver al panel
                  </button>
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
