import { useEffect, useState } from "react";
import { AdminLayout } from "../../../../shared/layouts/AdminLayout";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

export const EditFormularioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const [tipoDocumentoId, setTipoDocumentoId] = useState("");
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [campos, setCampos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [formRes, tiposRes] = await Promise.all([
          fetch(`${API_URL}/formularios/${id}`, { headers }),
          fetch(`${API_URL}/document-type`, { headers }),
        ]);

        const formData = await formRes.json();
        const tiposData = await tiposRes.json();

        setTipoDocumentoId(
          formData.TipoDocumento_ID?.toString() || ""
        );

        setCampos(formData.Form_Definition?.campos || []);
        setTiposDocumento(tiposData);

      } catch (err) {
        console.error(err);
        alert("Error cargando formulario");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  /* ================= PATCH ================= */

  const handleSubmit = async () => {
  try {
    const res = await fetch(`${API_URL}/formularios/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        TipoDocumento_ID: Number(tipoDocumentoId),
        Form_Definition: {
          campos,
        },
      }),
    });

    const data = await res.json(); // 🔥 IMPORTANTE

    if (!res.ok) {
      console.error("Backend error:", data);
      alert(data.message || "Error actualizando formulario");
      return;
    }

    navigate("/admin/formularios");

  } catch (err) {
    console.error(err);
    alert("Error inesperado");
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

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="bg-gradient-to-b from-[#0f172a] to-[#334155] px-10 pt-10 pb-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white">
            Editar formulario
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Modifica los campos del formulario
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-5xl mx-auto -mt-14 px-6">
        <div className="bg-white rounded-2xl shadow-xl border p-8 space-y-6">

          {/* SELECT */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tipo de documento
            </label>

            <select
              className="w-full mt-1 border rounded-lg p-2"
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
                    label="Nombre (interno) del campo"
                    value={campo.name}
                    onChange={(e) =>
                      updateCampo(index, "name", e.target.value)
                    }
                  />

                  <Input
                    label="Nombre (visible) del campo"
                    value={campo.label}
                    onChange={(e) =>
                      updateCampo(index, "label", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">

                    {/* TIPO DE CAMPO */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                        Tipo de dato aceptado
                        </label>

                        <select
                        className="w-full mt-1 border p-2 rounded-lg"
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
                    </div>

                    {/* REQUIRED */}
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            className="accent-gobdocs-primary scale-105"
                            checked={campo.required}
                            onChange={(e) =>
                            updateCampo(index, "required", e.target.checked)
                            }
                        />
                        Requerido
                        </label>
                    </div>

                </div>

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

            <div className="flex gap-3">
              <Button
                onClick={() => setShowDiscardModal(true)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Descartar cambios
              </Button>

              <Button onClick={() => setShowSaveModal(true)}>
                Guardar cambios
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MODAL GUARDAR ================= */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirmar cambios
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              ¿Seguro que deseas guardar los cambios?
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  setShowSaveModal(false);
                  handleSubmit();
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
              >
                Sí, guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DESCARTAR ================= */}
      {showDiscardModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800">
              Descartar cambios
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Perderás todos los cambios realizados. ¿Deseas continuar?
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDiscardModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  setShowDiscardModal(false);
                  navigate("/admin/formularios");
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded"
              >
                Sí, descartar
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};