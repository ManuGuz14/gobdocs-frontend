import { useEffect, useState } from "react";
import { AdminLayout } from "../../../../shared/layouts/AdminLayout";
import { useParams } from "react-router-dom";

export const ViewFormularioPage = () => {
  const { id } = useParams();

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const [formulario, setFormulario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetch(`${API_URL}/formularios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setFormulario)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= RENDER CAMPO ================= */

  const renderCampo = (campo: any, index: number) => {
    switch (campo.type) {
      case "text":
        return (
          <input
            type="text"
            className="w-full border p-2 rounded-lg"
            placeholder={campo.label}
            disabled
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="w-full border p-2 rounded-lg"
            placeholder={campo.label}
            disabled
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full border p-2 rounded-lg"
            disabled
          />
        );

      case "select":
        return (
          <select className="w-full border p-2 rounded-lg" disabled>
            <option>Seleccionar opción</option>
          </select>
        );

      default:
        return null;
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center">Cargando...</div>
      </AdminLayout>
    );
  }

  const campos = formulario?.Form_Definition?.campos || [];

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="bg-gradient-to-b from-[#0f172a] to-[#334155] px-10 pt-10 pb-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white">
            Vista del formulario
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Previsualización del formulario dinámico
          </p>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="max-w-5xl mx-auto -mt-14 px-6">
        <div className="bg-white rounded-2xl shadow-xl border p-8 space-y-6">

          {campos.length === 0 ? (
            <p className="text-gray-400 text-center">
              Este formulario no tiene campos
            </p>
          ) : (
            campos.map((campo: any, index: number) => (
              <div key={index} className="space-y-1">

                {/* LABEL */}
                <label className="text-sm font-medium text-gray-700">
                  {campo.label}
                  {campo.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {/* INPUT */}
                {renderCampo(campo, index)}

              </div>
            ))
          )}

        </div>
      </div>

    </AdminLayout>
  );
};