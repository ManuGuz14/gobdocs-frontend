import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { toast } from "react-toastify";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  X,
  Loader2,
} from "lucide-react";

export const BulkUploadPage = () => {
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [selectedInstitucion, setSelectedInstitucion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingInst, setLoadingInst] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Descargar plantilla
  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios/operadores/template`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "plantilla_operadores.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Plantilla descargada correctamente.");
      } else {
        toast.error("Error al descargar la plantilla.");
      }
    } catch (error) {
      console.error("Error descargando plantilla:", error);
      toast.error("Error de conexión al descargar la plantilla.");
    }
  };

  // Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!validTypes.includes(f.type) && !f.name.endsWith(".xlsx") && !f.name.endsWith(".xls") && !f.name.endsWith(".csv")) {
      toast.error("Solo se permiten archivos Excel (.xlsx, .xls) o CSV.");
      return;
    }

    setFile(f);
    setResult(null);
  };

  // Upload
  const handleUpload = async () => {
    if (!selectedInstitucion) {
      toast.warning("Selecciona una institución.");
      return;
    }

    if (!file) {
      toast.warning("Selecciona un archivo para subir.");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${API_URL}/usuarios/operadores/bulk/${selectedInstitucion}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        toast.success("Archivo procesado correctamente.");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(data.message || data.detail || "Error al procesar el archivo.");
        setResult({ error: true, message: data.message || data.detail || "Error desconocido" });
      }
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Error de conexión al subir el archivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-[85vh] bg-[#f4f4f4]">

        {/* HEADER */}
        <div className="bg-gradient-to-b from-[#0f172a] to-[#334155] px-10 pt-10 pb-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Carga Masiva de Operadores
          </h1>
          <p className="text-white/50 text-sm">
            Sube un archivo Excel para registrar múltiples operadores a una institución
          </p>
        </div>

        <div className="max-w-4xl mx-auto -mt-10 relative z-10 px-6">
          <div className="bg-white rounded-2xl shadow-xl border p-8">

            {/* STEP 1: DESCARGAR PLANTILLA */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                  1
                </div>
                <h2 className="font-semibold text-gray-800">
                  Descargar plantilla
                </h2>
              </div>

              <p className="text-sm text-gray-500 mb-4 ml-11">
                Descarga la plantilla de Excel, llena los datos de los operadores y luego súbela en el paso 3.
              </p>

              <div className="ml-11">
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm hover:bg-blue-100 transition border border-blue-200"
                >
                  <Download size={16} />
                  Descargar plantilla Excel
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* STEP 2: SELECCIONAR INSTITUCIÓN */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm">
                  2
                </div>
                <h2 className="font-semibold text-gray-800">
                  Seleccionar institución
                </h2>
              </div>

              <div className="ml-11">
                {loadingInst ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
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
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pl-11 pr-6 text-sm text-gray-700 focus:outline-none focus:border-purple-400 transition cursor-pointer appearance-none"
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
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* STEP 3: SUBIR ARCHIVO */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-sm">
                  3
                </div>
                <h2 className="font-semibold text-gray-800">
                  Subir archivo
                </h2>
              </div>

              <div className="ml-11">
                <div
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition cursor-pointer ${
                    dragActive
                      ? "border-green-400 bg-green-50"
                      : file
                      ? "border-green-400 bg-green-50/50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <>
                      <FileSpreadsheet size={32} className="text-green-500 mb-3" />
                      <p className="text-sm font-medium text-gray-800">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setResult(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="mt-3 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <X size={14} /> Quitar archivo
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload size={32} className="text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 font-medium">
                        Arrastra tu archivo aquí o haz clic para seleccionar
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Formatos: .xlsx, .xls, .csv
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="ml-11">
              <button
                onClick={handleUpload}
                disabled={uploading || !file || !selectedInstitucion}
                className="w-full py-3.5 bg-gradient-to-r from-[#0f172a] to-[#334155] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Procesando archivo...
                  </>
                ) : (
                  <>
                    <Users size={18} />
                    Registrar operadores
                  </>
                )}
              </button>
            </div>

            {/* RESULTS */}
            {result && (
              <div className="mt-8 ml-11">
                {result.error ? (
                  <div className="p-5 bg-red-50 border-2 border-red-200 rounded-xl">
                    <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                      <AlertCircle size={18} />
                      Error al procesar
                    </div>
                    <p className="text-sm text-red-600">
                      {result.message}
                    </p>
                  </div>
                ) : (
                  <div className="p-5 bg-green-50 border-2 border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                      <CheckCircle size={18} />
                      Procesamiento exitoso
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3 text-center border">
                        <p className="text-2xl font-bold text-green-600">
                          {result.creados ?? result.created ?? result.total ?? "—"}
                        </p>
                        <p className="text-[11px] text-gray-500 uppercase">
                          Creados
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center border">
                        <p className="text-2xl font-bold text-amber-600">
                          {result.duplicados ?? result.skipped ?? 0}
                        </p>
                        <p className="text-[11px] text-gray-500 uppercase">
                          Duplicados
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center border">
                        <p className="text-2xl font-bold text-red-600">
                          {result.errores ?? result.errors ?? 0}
                        </p>
                        <p className="text-[11px] text-gray-500 uppercase">
                          Errores
                        </p>
                      </div>
                    </div>

                    {/* Errores detallados si los hay */}
                    {(result.detalles || result.details || result.errorDetails) && (
                      <div className="mt-3 max-h-40 overflow-y-auto bg-white rounded-lg border p-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          Detalles:
                        </p>
                        {(result.detalles || result.details || result.errorDetails || []).map(
                          (d: any, i: number) => (
                            <p
                              key={i}
                              className="text-xs text-gray-500 py-1 border-b last:border-0"
                            >
                              Fila {d.fila || d.row || i + 1}: {d.mensaje || d.message || d.error || JSON.stringify(d)}
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SPACER */}
        <div className="h-10"></div>
      </div>
    </AdminLayout>
  );
};
