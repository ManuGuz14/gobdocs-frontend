import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  DollarSign,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  FileText,
  Building2,
} from "lucide-react";

interface Tarifa {
  nombre: string;
  descripcion: string;
  costo: string;
}

const emptyTarifa = (): Tarifa => ({
  nombre: "",
  descripcion: "",
  costo: "",
});

export const AsignarTarifasPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Puede venir de la creación de un documento: ?tipoDocumentoId=1&docNombre=Acta
  const preselectedDocId = searchParams.get("tipoDocumentoId") || "";
  const preselectedDocName = searchParams.get("docNombre") || "";

  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const [selectedDocType, setSelectedDocType] = useState(preselectedDocId);
  const [tarifas, setTarifas] = useState<Tarifa[]>([emptyTarifa()]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  // Cargar tipos de documento
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await fetch(`${API_URL}/document-type`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTiposDocumento(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching document types:", error);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchTipos();
  }, []);

  // Funciones de manejo de tarifas
  const addTarifa = () => {
    setTarifas([...tarifas, emptyTarifa()]);
  };

  const removeTarifa = (index: number) => {
    if (tarifas.length === 1) {
      toast.warning("Debe haber al menos una tarifa.");
      return;
    }
    setTarifas(tarifas.filter((_, i) => i !== index));
  };

  const updateTarifa = (index: number, field: keyof Tarifa, value: string) => {
    const updated = [...tarifas];
    updated[index] = { ...updated[index], [field]: value };
    setTarifas(updated);
  };

  // Calcular total
  const total = tarifas.reduce((sum, t) => {
    const c = parseFloat(t.costo);
    return sum + (isNaN(c) ? 0 : c);
  }, 0);

  // Submit
  const handleSubmit = async () => {
    if (!selectedDocType) {
      toast.warning("Selecciona un tipo de documento.");
      return;
    }

    // Validar que todas las tarifas tengan nombre y costo
    for (let i = 0; i < tarifas.length; i++) {
      if (!tarifas[i].nombre.trim()) {
        toast.warning(`Tarifa ${i + 1}: El nombre es obligatorio.`);
        return;
      }
      if (!tarifas[i].costo || parseFloat(tarifas[i].costo) <= 0) {
        toast.warning(`Tarifa ${i + 1}: El costo debe ser mayor a 0.`);
        return;
      }
    }

    setIsLoading(true);

    try {
      const body = {
        tarifas: tarifas.map((t) => ({
          nombre: t.nombre.trim(),
          descripcion: t.descripcion.trim() || undefined,
          costo: parseFloat(t.costo),
          tipoDocumentoId: isNaN(Number(selectedDocType)) ? selectedDocType : Number(selectedDocType),
        })),
      };

      console.log("========== ASIGNAR TARIFAS ==========");
      console.log("URL:", `${API_URL}/tarifarios/bulk`);
      console.log("Token:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
      console.log("Body enviado:", JSON.stringify(body, null, 2));
      console.log("selectedDocType:", selectedDocType, "tipo:", typeof selectedDocType);

      const res = await fetch(`${API_URL}/tarifarios/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));

      const rawText = await res.text();
      console.log("Response raw text:", rawText);

      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("No se pudo parsear la respuesta como JSON");
      }

      console.log("Response parsed data:", data);
      console.log("======================================");

      if (res.ok) {
        toast.success("¡Tarifas asignadas exitosamente!");
        setSuccess(true);
      } else {
        toast.error(
          data.message || data.detail || `Error ${res.status} al asignar las tarifas.`
        );
      }
    } catch (error) {
      console.error("❌ Error asignando tarifas:", error);
      toast.error("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Nombre del doc seleccionado
  const docName =
    preselectedDocName ||
    tiposDocumento.find(
      (d) => String(d.TipoDocumento_ID || d.id) === selectedDocType
    )?.Nombre ||
    "";

  return (
    <AdminLayout>
      <div className="min-h-[85vh] bg-[#f4f4f4]">

        {/* HEADER */}
        <div className="bg-gradient-to-b from-[#0f172a] to-[#334155] px-10 pt-10 pb-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Asignar Tarifas
          </h1>
          <p className="text-white/50 text-sm">
            Define los costos asociados a un tipo de documento
          </p>
        </div>

        <div className="max-w-3xl mx-auto -mt-10 relative z-10 px-6">
          <div className="bg-white rounded-2xl shadow-xl border p-8">

            {!success ? (
              <>
                {/* ICONO */}
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <DollarSign size={28} className="text-amber-600" />
                  </div>
                </div>

                {/* TIPO DE DOCUMENTO */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de documento <span className="text-red-500">*</span>
                  </label>

                  {preselectedDocId ? (
                    // Viene preseleccionado desde la creación
                    <div className="flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3">
                      <FileText size={16} className="text-blue-500" />
                      <span className="text-sm font-medium text-blue-800">
                        {preselectedDocName || `Documento #${preselectedDocId}`}
                      </span>
                    </div>
                  ) : loadingDocs ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm py-3">
                      <Loader2 size={16} className="animate-spin" />
                      Cargando tipos de documento...
                    </div>
                  ) : (
                    <div className="relative">
                      <FileText
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <select
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pl-11 pr-6 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition cursor-pointer appearance-none"
                      >
                        <option value="">— Selecciona un tipo de documento —</option>
                        {tiposDocumento.map((doc) => (
                          <option
                            key={doc.TipoDocumento_ID || doc.id}
                            value={doc.TipoDocumento_ID || doc.id}
                          >
                            {doc.Nombre || doc.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 my-6"></div>

                {/* TARIFAS */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold text-gray-700">
                      Tarifas ({tarifas.length})
                    </h2>
                    <button
                      type="button"
                      onClick={addTarifa}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      <Plus size={14} />
                      Agregar tarifa
                    </button>
                  </div>

                  <div className="space-y-4">
                    {tarifas.map((tarifa, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl border-2 border-gray-200 p-5 relative group"
                      >
                        {/* BADGE */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                            Tarifa {index + 1}
                          </span>
                          {tarifas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTarifa(index)}
                              className="text-gray-300 hover:text-red-500 transition"
                              title="Eliminar tarifa"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* NOMBRE + COSTO */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Nombre <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={tarifa.nombre}
                              onChange={(e) =>
                                updateTarifa(index, "nombre", e.target.value)
                              }
                              placeholder="Ej: Emisión de cédula"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Costo (RD$) <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                              <DollarSign
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={tarifa.costo}
                                onChange={(e) =>
                                  updateTarifa(index, "costo", e.target.value)
                                }
                                placeholder="0.00"
                                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Descripción
                          </label>
                          <input
                            type="text"
                            value={tarifa.descripcion}
                            onChange={(e) =>
                              updateTarifa(index, "descripcion", e.target.value)
                            }
                            placeholder="Descripción breve del cargo"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOTAL */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6 flex justify-between items-center">
                  <span className="text-sm font-medium text-amber-800">
                    Total del documento
                  </span>
                  <span className="text-2xl font-bold text-amber-700">
                    RD$ {total.toFixed(2)}
                  </span>
                </div>

                {/* SUBMIT */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0f172a] to-[#334155] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Guardando tarifas...
                    </>
                  ) : (
                    <>
                      <DollarSign size={18} />
                      Asignar tarifas
                    </>
                  )}
                </button>
              </>
            ) : (
              /* ÉXITO */
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-green-500" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ¡Tarifas asignadas!
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Se asignaron <strong>{tarifas.length} tarifa{tarifas.length > 1 ? "s" : ""}</strong> al documento{" "}
                  <strong>{docName}</strong>.
                </p>
                <p className="text-amber-600 font-bold text-lg mb-6">
                  Total: RD$ {total.toFixed(2)}
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate("/admin/tipos-documento")}
                    className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Crear otro documento
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
