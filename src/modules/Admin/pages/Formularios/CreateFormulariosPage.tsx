import { useEffect, useState } from "react";
import { AdminLayout } from "../../../../shared/layouts/AdminLayout";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

export const CreateFormularioPage = () => {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const [tipoDocumentoId, setTipoDocumentoId] = useState("");
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [campos, setCampos] = useState<any[]>([]);

  /* ================= FETCH TIPOS DOCUMENTO ================= */
  useEffect(() => {
    fetch(`${API_URL}/document-type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setTiposDocumento)
      .catch(console.error);
  }, []);

  /* ================= CAMPOS ================= */

  const addCampo = () => {
    setCampos([
      ...campos,
      {
        name: "",
        label: "",
        type: "text",
        required: false,
      },
    ]);
  };

  const updateCampo = (index: number, field: string, value: any) => {
    const updated = [...campos];
    updated[index][field] = value;
    setCampos(updated);
  };

  const removeCampo = (index: number) => {
    setCampos(campos.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!tipoDocumentoId) {
      alert("Selecciona un tipo de documento");
      return;
    }

    if (campos.length === 0) {
      alert("Agrega al menos un campo");
      return;
    }

    const payload = {
      TipoDocumento_ID: Number(tipoDocumentoId),
      nombre: "Formulario dinámico", // 🔥 puedes hacerlo input luego
      descripcion: "Formulario generado desde admin",
      Estructura: {
        campos,
      },
    };

    console.log("🚀 PAYLOAD ENVIADO:", payload);

    try {
      const res = await fetch(`${API_URL}/formularios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("📩 RESPONSE BACKEND:", data);

      if (!res.ok) {
        alert(data.message || "Error creando formulario");
        return;
      }

      alert("Formulario creado 🔥");
      navigate("/admin/formularios");

    } catch (err) {
      console.error(err);
      alert("Error inesperado");
    }
  };

  return (
    <AdminLayout>

      {/* HEADER DARK */}
      <div className="bg-gradient-to-b from-[#0f172a] to-[#334155] px-10 pt-10 pb-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white">
            Crear formulario
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Define los campos dinámicos para el documento
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="max-w-5xl mx-auto -mt-14 px-6">
        <div className="bg-white rounded-2xl shadow-xl border p-8 space-y-6">

          {/* SELECT DOCUMENTO */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tipo de documento
            </label>

            <select
              className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tipoDocumentoId}
              onChange={(e) => setTipoDocumentoId(e.target.value)}
            >
              <option value="">Seleccionar documento</option>

              {tiposDocumento.map((doc) => (
                <option key={doc.TipoDocumento_ID} value={doc.TipoDocumento_ID}>
                  {doc.Nombre}
                </option>
              ))}
            </select>
          </div>

          {/* CAMPOS */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">
              Campos del formulario
            </h2>

            {campos.map((campo, index) => (
              <div
                key={index}
                className="p-4 border rounded-xl bg-gray-50 space-y-3"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Name (interno)"
                    value={campo.name}
                    onChange={(e) =>
                      updateCampo(index, "name", e.target.value)
                    }
                  />

                  <Input
                    label="Label (visible)"
                    value={campo.label}
                    onChange={(e) =>
                      updateCampo(index, "label", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="border p-2 rounded-lg"
                    value={campo.type}
                    onChange={(e) =>
                      updateCampo(index, "type", e.target.value)
                    }
                  >
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                    <option value="date">Fecha</option>
                    <option value="select">Select</option>
                  </select>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={campo.required}
                      onChange={(e) =>
                        updateCampo(index, "required", e.target.checked)
                      }
                    />
                    Requerido
                  </label>
                </div>

                {/* DELETE CAMPO */}
                <div className="flex justify-end">
                  <button
                    onClick={() => removeCampo(index)}
                    className="text-red-600 hover:bg-red-100 p-2 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between">
            <Button onClick={addCampo} className="flex gap-2 items-center">
              <Plus size={16} />
              Agregar campo
            </Button>

            <Button onClick={handleSubmit}>
              Guardar formulario
            </Button>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};