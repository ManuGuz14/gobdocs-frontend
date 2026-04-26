import { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  FileText,
  Activity,
  RefreshCw,
  TrendingUp,
  Shield,
} from "lucide-react";

const REFRESH_INTERVAL = 30000;

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const fetchAll = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [solRes, instRes, docRes] = await Promise.allSettled([
          fetch(`${API_URL}/solicitudes/institucion`, { headers }),
          fetch(`${API_URL}/institution`, { headers }),
          fetch(`${API_URL}/document-type`, { headers }),
        ]);

        let solData: any[] = [];
        if (solRes.status === "fulfilled" && solRes.value.ok) {
          const data = await solRes.value.json();
          solData = Array.isArray(data) ? data : data.solicitudes || [];
          setSolicitudes(solData);
        }

        // Extraer usuarios únicos de las solicitudes (cada solicitud tiene .usuario)
        const userMap = new Map<string, any>();
        solData.forEach((s: any) => {
          if (s.usuario && (s.usuario.Usuario_ID || s.usuario.id)) {
            const uid = s.usuario.Usuario_ID || s.usuario.id;
            if (!userMap.has(uid)) {
              userMap.set(uid, {
                ...s.usuario,
                // Usar la fecha de la solicitud como referencia si no tiene fecha de creación
                createdAt: s.usuario.createdAt || s.usuario.Fecha_Creacion || s.Fecha_Solicitud,
              });
            }
          }
        });
        setUsuarios(Array.from(userMap.values()));

        if (instRes.status === "fulfilled" && instRes.value.ok) {
          const data = await instRes.value.json();
          setInstituciones(Array.isArray(data) ? data : []);
        }

        if (docRes.status === "fulfilled" && docRes.value.ok) {
          const data = await docRes.value.json();
          setTiposDocumento(Array.isArray(data) ? data : []);
        }

        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [API_URL, token]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const interval = setInterval(() => fetchAll(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  /* ==================== DATA PROCESSING ==================== */

  // KPIs
  const totalSolicitudes = solicitudes.length;
  const totalUsuarios = usuarios.length;
  const totalInstituciones = instituciones.length;
  const totalTiposDoc = tiposDocumento.length;

  // Solicitudes por estado
  const estadoCount: Record<string, number> = {};
  solicitudes.forEach((s) => {
    const estado = s.Estado || "PENDIENTE";
    estadoCount[estado] = (estadoCount[estado] || 0) + 1;
  });

  const PIE_COLORS: Record<string, string> = {
    PENDIENTE: "#f59e0b",
    APROBADA: "#10b981",
    RECHAZADA: "#ef4444",
    EN_PROCESO: "#3b82f6",
    PAGADA: "#8b5cf6",
    EMITIDA: "#06b6d4",
  };

  const pieData = Object.entries(estadoCount).map(([name, value]) => ({
    name,
    value,
    color: PIE_COLORS[name] || "#94a3b8",
  }));

  // Solicitudes por día (últimos 14 días)
  const last14Days: { label: string; date: string; solicitudes: number }[] = [];
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = diasSemana[d.getDay()];
    const dayNum = d.getDate();

    last14Days.push({
      label: i === 0 ? "Hoy" : `${dayName} ${dayNum}`,
      date: dateStr,
      solicitudes: 0,
    });
  }

  solicitudes.forEach((s) => {
    const fecha = s.Fecha_Emision || s.Fecha_Solicitud || s.createdAt;
    if (fecha) {
      const fechaStr = new Date(fecha).toISOString().split("T")[0];
      const found = last14Days.find((d) => d.date === fechaStr);
      if (found) found.solicitudes += 1;
    }
  });

  // Solicitudes por institución (data comes from tipoDocumento.institucion)
  const instCount: Record<string, number> = {};
  solicitudes.forEach((s) => {
    const instName =
      s.institucion?.Nombre ||
      s.tipoDocumento?.institucion?.Nombre ||
      s.Nombre_Documento ||
      `Inst #${s.Institucion_ID || "?"}`;
    instCount[instName] = (instCount[instName] || 0) + 1;
  });

  const barInstData = Object.entries(instCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ institucion: name, solicitudes: count }));

  // Usuarios recientes
  const recentUsers = [...usuarios]
    .filter((u) => u.createdAt || u.Fecha_Creacion)
    .sort((a, b) => {
      const da = new Date(a.createdAt || a.Fecha_Creacion).getTime();
      const db = new Date(b.createdAt || b.Fecha_Creacion).getTime();
      return db - da;
    })
    .slice(0, 5);

  /* ==================== CUSTOM TOOLTIP ==================== */

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border text-sm">
          <p className="font-semibold text-gray-700">{label}</p>
          <p className="text-gray-500">
            {payload[0].value} solicitud{payload[0].value !== 1 ? "es" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  /* ==================== RENDER ==================== */

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="bg-gradient-to-b from-[#0f172a] to-[#334155] px-10 pt-10 pb-24">

        {/* REFRESH BAR */}
        <div className="flex justify-between items-center max-w-7xl mx-auto mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Panel de Administración
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Vista general del sistema GobDocs RD
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs">
              {lastUpdated.toLocaleTimeString("es-DO")}
            </span>
            <button
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              className={`p-2 bg-white/10 rounded-full hover:bg-white/20 transition text-white ${
                refreshing ? "animate-spin" : ""
              }`}
              title="Actualizar datos"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-4 gap-5 max-w-7xl mx-auto">
          {[
            {
              label: "Solicitudes",
              value: totalSolicitudes,
              icon: <FileText size={22} />,
              color: "text-blue-300",
              bg: "from-blue-500/20 to-blue-600/10",
            },
            {
              label: "Usuarios",
              value: totalUsuarios,
              icon: <Users size={22} />,
              color: "text-green-300",
              bg: "from-green-500/20 to-green-600/10",
            },
            {
              label: "Instituciones",
              value: totalInstituciones,
              icon: <Building2 size={22} />,
              color: "text-purple-300",
              bg: "from-purple-500/20 to-purple-600/10",
            },
            {
              label: "Tipos de documento",
              value: totalTiposDoc,
              icon: <Activity size={22} />,
              color: "text-amber-300",
              bg: "from-amber-500/20 to-amber-600/10",
            },
          ].map((kpi, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${kpi.bg} backdrop-blur rounded-xl p-6 border border-white/10`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`${kpi.color}`}>{kpi.icon}</div>
                <TrendingUp size={14} className="text-white/20" />
              </div>
              <p className="text-3xl font-extrabold text-white">
                {loading ? "—" : kpi.value}
              </p>
              <p className="text-white/50 text-xs uppercase tracking-wide mt-1">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS */}
      <div className="max-w-7xl mx-auto -mt-10 relative z-10 px-6">
        <div className="bg-white rounded-2xl shadow-xl border p-8">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">

              {/* AREA CHART — últimos 14 días */}
              <div className="col-span-1">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                  Actividad (14 días)
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Solicitudes recibidas por día
                </p>

                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={last14Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 9 }}
                      stroke="#94a3b8"
                      interval={1}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                      stroke="#94a3b8"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="solicitudes"
                      stroke="#3b82f6"
                      fill="url(#blueGrad)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* BAR CHART — por institución */}
              <div className="col-span-1">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                  Top instituciones
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Solicitudes por institución
                </p>

                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barInstData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="institucion"
                      tick={{ fontSize: 9 }}
                      width={100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="solicitudes"
                      fill="#8b5cf6"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* PIE CHART — por estado */}
              <div className="col-span-1">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                  Estados de solicitudes
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Distribución general
                </p>

                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          `${value} solicitud${value !== 1 ? "es" : ""}`,
                          name,
                        ]}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px" }}
                        formatter={(value: string) => (
                          <span className="text-gray-600">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                    Sin datos
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 gap-8">

        {/* ÚLTIMOS USUARIOS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-800">Últimos usuarios registrados</h2>
            <button
              onClick={() => navigate("/admin/usuarios")}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Ver todos →
            </button>
          </div>

          {recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.map((user, i) => {
                const fecha = user.createdAt || user.Fecha_Creacion;
                return (
                  <div
                    key={user.Usuario_ID || i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {user.Nombre || user.nombre || "Usuario"}{" "}
                          {user.Apellido || user.apellido || ""}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {user.Email || user.email || ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        (user.Rol || user.rol || "").toLowerCase() === "operador"
                          ? "bg-purple-100 text-purple-700"
                          : (user.Rol || user.rol || "").toLowerCase() === "admin"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.Rol || user.rol || "ciudadano"}
                      </span>
                      {fecha && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(fecha).toLocaleDateString("es-DO", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">
              No hay datos de usuarios.
            </p>
          )}
        </div>

        {/* RESUMEN RÁPIDO */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Resumen del sistema</h2>

          <div className="space-y-4">
            {[
              {
                label: "Solicitudes pendientes",
                value: estadoCount["PENDIENTE"] || 0,
                icon: <Activity size={16} />,
                color: "text-amber-600 bg-amber-50",
              },
              {
                label: "Solicitudes aprobadas",
                value: estadoCount["APROBADA"] || 0,
                icon: <FileText size={16} />,
                color: "text-green-600 bg-green-50",
              },
              {
                label: "Solicitudes rechazadas",
                value: estadoCount["RECHAZADA"] || 0,
                icon: <FileText size={16} />,
                color: "text-red-600 bg-red-50",
              },
              {
                label: "Operadores registrados",
                value: usuarios.filter(
                  (u) =>
                    (u.Rol || u.rol || "").toLowerCase() === "operador"
                ).length,
                icon: <Shield size={16} />,
                color: "text-purple-600 bg-purple-50",
              },
              {
                label: "Ciudadanos registrados",
                value: usuarios.filter(
                  (u) =>
                    (u.Rol || u.rol || "").toLowerCase() !== "operador" &&
                    (u.Rol || u.rol || "").toLowerCase() !== "admin"
                ).length,
                icon: <Users size={16} />,
                color: "text-blue-600 bg-blue-50",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {loading ? "—" : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
