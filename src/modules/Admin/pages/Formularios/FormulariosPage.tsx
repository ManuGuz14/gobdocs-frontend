import { useEffect, useState } from "react";
import { AdminLayout } from "../../../../shared/layouts/AdminLayout";
import { Input } from "../../../../shared/ui/Input";
import { Button } from "../../../../shared/ui/Button";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, FileText } from "lucide-react";


type TipoDocumento = {
  TipoDocumento_ID: number;
  Nombre: string;
};

export const FormulariosPage = () => {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const [formularios, setFormularios] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/formularios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setFormularios)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/document-type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setTiposDocumento)
      .catch(console.error);
  }, []);

  const getNombreDocumento = (id: number) => {
    const doc = tiposDocumento.find(d => d.TipoDocumento_ID === id);
    return doc?.Nombre || "Documento";
  };

  const filtered = formularios.filter((f) =>
    f.Formulario_ID.toLowerCase().includes(search.toLowerCase())
  );

  const totalCampos = formularios.reduce(
    (acc, f) => acc + (f.Form_Definition?.campos?.length || 0),
    0
  );

  return (
    <AdminLayout>

      {/* HEADER DARK */}
      <div className="bg-gradient-to-b from-[#0f172a] to-[#334155] px-10 pt-10 pb-24">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Formularios
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Gestiona los formularios dinámicos del sistema
            </p>
          </div>

          <Button
            onClick={() => navigate("/admin/formularios/create")}
            className="flex items-center gap-2 text-white"
          >
            <Plus size={18} />
            Nuevo formulario
          </Button>
        </div>

        {/* KPI MINI */}
        <div className="grid grid-cols-2 gap-5 max-w-7xl mx-auto mt-8">
          <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
            <p className="text-white/50 text-xs uppercase">
              Total formularios
            </p>
            <p className="text-2xl font-bold text-white">
              {loading ? "—" : formularios.length}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
            <p className="text-white/50 text-xs uppercase">
              Total campos
            </p>
            <p className="text-2xl font-bold text-white">
              {loading ? "—" : totalCampos}
            </p>
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="max-w-7xl mx-auto -mt-14 px-6">
        <div className="bg-white rounded-2xl shadow-xl border p-6">

          {/* SEARCH */}
          <div className="flex justify-between items-center mb-6">
            <Input
              label="Buscar formulario"
              placeholder="Buscar por ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left p-3">Formulario</th>
                  <th className="text-left p-3">Campos</th>
                  <th className="text-right p-3">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center p-6">
                      Cargando...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center p-6 text-gray-400">
                      No hay formularios
                    </td>
                  </tr>
                ) : (
                  filtered.map((f) => (
                    <tr
                      key={f.Formulario_ID}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              Formulario de {getNombreDocumento(f.TipoDocumento_ID)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {f.Formulario_ID}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                          {f.Form_Definition?.campos?.length || 0} campos
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              navigate(`/admin/formularios/${f.Formulario_ID}`)
                            }
                            className="p-2 hover:bg-gray-200 rounded"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/admin/formularios/edit/${f.Formulario_ID}`)
                            }
                            className="p-2 hover:bg-gray-200 rounded"
                          >
                            <Pencil size={16} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};