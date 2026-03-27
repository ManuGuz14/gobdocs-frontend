import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import { useNavigate } from "react-router-dom";

export const LandingBkOfficePage = () => {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_REACT_APP_BACKEND ||
          "https://gobdocs-backend.up.railway.app";
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/solicitudes/institucion`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Adjust depending on whether the response is an array or wrapped in an object
          const dataArray = Array.isArray(data) ? data : data.solicitudes || [];
          setSolicitudes(dataArray);
        }
      } catch (error) {
        console.error("Error fetching solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  // 2. Line Chart Data (Requests by hour of day)
  const lineDataMap: Record<string, number> = {};
  
  // Pre-fill some standard hours so the chart has a nice baseline
  for (let i = 8; i <= 18; i++) {
    lineDataMap[`${i.toString().padStart(2, "0")}:00`] = 0;
  }

  solicitudes.forEach((s) => {
    if (s.Fecha_Emision) {
      const hour = new Date(s.Fecha_Emision).getHours();
      const time = `${hour.toString().padStart(2, "0")}:00`;
      lineDataMap[time] = (lineDataMap[time] || 0) + 1;
    }
  });

  const computedLineData = Object.keys(lineDataMap)
    .sort()
    .map((k) => ({ time: k, value: lineDataMap[k] }));

  // 3. Bar Chart Data (History of requests by Day of Week)
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const barDataMap: Record<string, number> = {
    Dom: 0, Lun: 0, Mar: 0, Mié: 0, Jue: 0, Vie: 0, Sáb: 0,
  };

  solicitudes.forEach((s) => {
    if (s.Fecha_Emision) {
      const dayIndex = new Date(s.Fecha_Emision).getDay();
      const day = diasSemana[dayIndex];
      if (barDataMap[day] !== undefined) {
        barDataMap[day] += 1;
      }
    }
  });

  const computedBarData = diasSemana.map((day) => ({
    day,
    docs: barDataMap[day],
  }));

  const pendientesCount = solicitudes.filter(
    (s) => s.Estado !== "APROBADA" && s.Estado !== "RECHAZADA"
  ).length;

  // 4. Últimas solicitudes
  const ultimasSolicitudes = [...solicitudes]
    .filter((s) => s.Fecha_Emision)
    .sort(
      (a, b) =>
        new Date(b.Fecha_Emision).getTime() -
        new Date(a.Fecha_Emision).getTime()
    )
    .slice(0, 4);

  return (
    <BackofficeLayout>
      {/* SECCION AZUL (solo estadisticas) */}
      <div className="bg-gradient-to-b from-gobdocs-primary to-gobdocs-secondaryblue px-10 pt-10 pb-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-8xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Estadísticas</h1>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gobdocs-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-10">
              {/* LINE CHART */}
              <div>
                <h2 className="text-sm text-gray-500 mb-2">Hoy</h2>

                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={computedLineData}>
                    <XAxis dataKey="time" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1a2b5e"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* KPIs */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                  <p className="text-gray-500 text-sm uppercase tracking-wide">Total de Solicitudes</p>
                  <p className="text-4xl font-extrabold text-[#1a2b5e] mt-2">{solicitudes.length}</p>
                </div>
              </div>

              {/* BAR CHART */}
              <div>
                <h2 className="text-sm text-gray-500 mb-2">
                  Total Solicitudes por Día
                </h2>

                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={computedBarData}>
                    <XAxis dataKey="day" />
                    <Tooltip />
                    <Bar dataKey="docs" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* KPIs */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                  <p className="text-gray-500 text-sm uppercase tracking-wide">Solicitudes actuales</p>
                  <p className="text-4xl font-extrabold text-blue-500 mt-2">{pendientesCount}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECCION BLANCA (ULTIMAS SOLICITUDES) */}
      <div className="px-10 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Últimas solicitudes</h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {ultimasSolicitudes.length > 0 ? (
                ultimasSolicitudes.map((item, index) => {
                  const id = item.Numero_Solicitud || item.Respuesta_ID || item.id || index;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded bg-gradient-to-r from-purple-700 to-blue-500 flex shrink-0" />
                        <div className="overflow-hidden">
                          <p className="font-semibold truncate">
                            Solicitud #{item.Numero_Solicitud || index + 1}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {item.usuario?.Nombre || "Ciudadano"} - {item.Estado}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/backoffice/solicitud/${id}`)}
                          className="px-4 py-1 border rounded text-sm hover:bg-gray-50 transition"
                        >
                          Ver
                        </button>
                        {item.Estado !== "APROBADA" && (
                          <button 
                            onClick={() => navigate(`/backoffice/solicitud/${id}`)}
                            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                          >
                            Aceptar
                          </button>
                        )}
                        {item.Estado === "APROBADA" && item.Estado !== "RECHAZADA" && (
                          <button className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition opacity-50 cursor-not-allowed" disabled>
                            Rechazar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 col-span-2 text-center py-4 bg-gray-50 rounded-lg border border-dashed">
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