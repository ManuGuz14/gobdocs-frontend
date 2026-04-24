import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
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
} from "recharts";

import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

const REFRESH_INTERVAL = 30000; // 30 segundos

export const LandingBkOfficePage = () => {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const fetchSolicitudes = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    try {
      const res = await fetch(`${API_URL}/solicitudes/institucion`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const dataArray = Array.isArray(data) ? data : data.solicitudes || [];
        setSolicitudes(dataArray);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching solicitudes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API_URL, token]);

  // Carga inicial
  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  // Auto-refresh cada 30s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSolicitudes(true);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchSolicitudes]);

  /* ==================== PROCESAMIENTO DE DATOS ==================== */

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // "2026-04-23"

  // --- LINE CHART: Solicitudes de HOY por hora ---
  const lineDataMap: Record<string, number> = {};

  // Pre-fill horas laborales
  for (let i = 0; i <= 23; i++) {
    lineDataMap[`${i.toString().padStart(2, "0")}:00`] = 0;
  }

  solicitudes.forEach((s) => {
    if (s.Fecha_Emision) {
      const fecha = new Date(s.Fecha_Emision);
      const fechaStr = fecha.toISOString().split("T")[0];

      // Solo contar solicitudes de HOY
      if (fechaStr === todayStr) {
        const hour = fecha.getHours();
        const time = `${hour.toString().padStart(2, "0")}:00`;
        lineDataMap[time] = (lineDataMap[time] || 0) + 1;
      }
    }
  });

  // Filtrar solo horas con datos o del rango horario actual
  const currentHour = today.getHours();
  const computedLineData = Object.keys(lineDataMap)
    .sort()
    .filter((k) => {
      const h = parseInt(k.split(":")[0]);
      return h <= currentHour + 1 && h >= 6; // Mostrar desde las 6am hasta hora actual + 1
    })
    .map((k) => ({ hora: k, solicitudes: lineDataMap[k] }));

  const solicitudesHoy = solicitudes.filter((s) => {
    if (!s.Fecha_Emision) return false;
    return new Date(s.Fecha_Emision).toISOString().split("T")[0] === todayStr;
  }).length;

  // --- BAR CHART: Solicitudes por día (últimos 7 días) ---
  const last7Days: { label: string; date: string; solicitudes: number }[] = [];
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = diasSemana[d.getDay()];
    const dayNum = d.getDate();

    last7Days.push({
      label: i === 0 ? "Hoy" : `${dayName} ${dayNum}`,
      date: dateStr,
      solicitudes: 0,
    });
  }

  solicitudes.forEach((s) => {
    if (s.Fecha_Emision) {
      const fechaStr = new Date(s.Fecha_Emision).toISOString().split("T")[0];
      const found = last7Days.find((d) => d.date === fechaStr);
      if (found) found.solicitudes += 1;
    }
  });

  // --- PIE CHART: Distribución por estado ---
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

  // --- KPIs ---
  const pendientesCount = solicitudes.filter(
    (s) => s.Estado !== "APROBADA" && s.Estado !== "RECHAZADA"
  ).length;

  const aprobadasCount = solicitudes.filter(
    (s) => s.Estado === "APROBADA"
  ).length;

  const rechazadasCount = solicitudes.filter(
    (s) => s.Estado === "RECHAZADA"
  ).length;

  // --- ÚLTIMAS SOLICITUDES ---
  const ultimasSolicitudes = [...solicitudes]
    .filter((s) => s.Fecha_Emision)
    .sort(
      (a, b) =>
        new Date(b.Fecha_Emision).getTime() -
        new Date(a.Fecha_Emision).getTime()
    )
    .slice(0, 6);

  /* ==================== CUSTOM TOOLTIP ==================== */

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border text-sm">
          <p className="font-semibold text-gobdocs-primary">{label}</p>
          <p className="text-gray-600">
            {payload[0].value} solicitud{payload[0].value !== 1 ? "es" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <BackofficeLayout>
      {/* HEADER CON STATS */}
      <div className="bg-gradient-to-b from-gobdocs-primary to-gobdocs-secondaryblue px-10 pt-10 pb-20">

        {/* REFRESH BAR */}
        <div className="flex justify-between items-center max-w-7xl mx-auto mb-6">
          <h1 className="text-2xl font-bold text-white">Panel de Control</h1>

          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs">
              Actualizado: {lastUpdated.toLocaleTimeString("es-DO")}
            </span>
            <button
              onClick={() => fetchSolicitudes(true)}
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
        <div className="grid grid-cols-4 gap-4 max-w-7xl mx-auto mb-8">
          {[
            {
              label: "Total solicitudes",
              value: solicitudes.length,
              color: "text-white",
              bg: "bg-white/10",
            },
            {
              label: "Hoy",
              value: solicitudesHoy,
              color: "text-cyan-300",
              bg: "bg-white/10",
            },
            {
              label: "Aprobadas",
              value: aprobadasCount,
              color: "text-green-300",
              bg: "bg-white/10",
            },
            {
              label: "Pendientes",
              value: pendientesCount,
              color: "text-amber-300",
              bg: "bg-white/10",
            },
          ].map((kpi, i) => (
            <div
              key={i}
              className={`${kpi.bg} backdrop-blur rounded-xl p-5 text-center border border-white/10`}
            >
              <p className={`text-3xl font-extrabold ${kpi.color}`}>
                {loading ? "—" : kpi.value}
              </p>
              <p className="text-white/60 text-xs uppercase tracking-wide mt-1">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gobdocs-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">

              {/* LINE CHART — Solicitudes de hoy por hora */}
              <div className="col-span-1">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                  Solicitudes de hoy
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Distribución por hora — {today.toLocaleDateString("es-DO", { weekday: "long", day: "numeric", month: "long" })}
                </p>

                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={computedLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="hora"
                      tick={{ fontSize: 11 }}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                      stroke="#94a3b8"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="solicitudes"
                      stroke="#1a2b5e"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#1a2b5e" }}
                      activeDot={{ r: 6, fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* BAR CHART — Últimos 7 días */}
              <div className="col-span-1">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                  Últimos 7 días
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Solicitudes recibidas por día
                </p>

                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={last7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10 }}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                      stroke="#94a3b8"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="solicitudes"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* PIE CHART — Distribución por estado */}
              <div className="col-span-1">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                  Distribución por estado
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Todas las solicitudes
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

      {/* ÚLTIMAS SOLICITUDES */}
      <div className="px-10 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Últimas solicitudes</h2>
            <button
              onClick={() => navigate("/backoffice/solicitudes")}
              className="text-sm text-gobdocs-primary hover:underline font-medium"
            >
              Ver todas →
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {ultimasSolicitudes.length > 0 ? (
                ultimasSolicitudes.map((item, index) => {
                  const id =
                    item.Numero_Solicitud ||
                    item.Respuesta_ID ||
                    item.id ||
                    index;

                  const fecha = item.Fecha_Emision
                    ? new Date(item.Fecha_Emision).toLocaleDateString("es-DO", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";

                  const estadoColor =
                    item.Estado === "APROBADA"
                      ? "bg-green-100 text-green-700"
                      : item.Estado === "RECHAZADA"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700";

                  return (
                    <div
                      key={id}
                      onClick={() => navigate(`/backoffice/solicitud/${id}`)}
                      className="cursor-pointer border rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-bold text-gobdocs-primary">
                          #{item.Numero_Solicitud || index + 1}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${estadoColor}`}
                        >
                          {item.Estado || "PENDIENTE"}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.usuario?.Nombre || item.usuario?.nombre || "Ciudadano"}{" "}
                        {item.usuario?.Apellido || item.usuario?.apellido || ""}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">{fecha}</p>

                      <div className="mt-4 flex justify-end">
                        <span className="text-xs text-gobdocs-primary font-medium group-hover:underline">
                          Ver detalle →
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 col-span-3 text-center py-4 bg-gray-50 rounded-lg border border-dashed">
                  No hay solicitudes en la institución.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </BackofficeLayout>
  );
};