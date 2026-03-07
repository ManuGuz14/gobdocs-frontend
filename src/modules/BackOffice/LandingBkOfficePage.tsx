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


    const lineData = [
    { time: "10:20", value: 5 },
    { time: "10:30", value: 12 },
    { time: "10:40", value: 24 },
    { time: "10:50", value: 30 },
    { time: "11:00", value: 26 },
    { time: "11:10", value: 21 },
    { time: "11:20", value: 15 },
    ];

    const barData = [
    { day: "Sat", docs: 4 },
    { day: "Sun", docs: 3 },
    { day: "Mon", docs: 6 },
    { day: "Tue", docs: 2 },
    { day: "Wed", docs: 3 },
    { day: "Thu", docs: 5 },
    { day: "Fri", docs: 8 },
    ];

    export const LandingBkOfficePage = () => {
            const navigate = useNavigate();
    return (
        <BackofficeLayout>

        {/* SECCION AZUL (solo estadisticas) */}
        <div className="bg-gradient-to-b from-gobdocs-primary to-gobdocs-secondaryblue px-10 pt-10 pb-20">

            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-8xl mx-auto">

            <h1 className="text-2xl font-bold text-center mb-6">
                Estadísticas
            </h1>

            <div className="grid grid-cols-2 gap-10">

                {/* LINE CHART */}
                <div>
                <h2 className="text-sm text-gray-500 mb-2">Hoy</h2>

                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={lineData}>
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
                <div className="flex justify-between mt-6 text-sm">

                    <div>
                    <p className="font-semibold">Tiempo de respuesta</p>
                    <p className="text-blue-600 font-bold">4 HOURS</p>
                    </div>

                    <div>
                    <p className="font-semibold">Tareas asignadas</p>
                    <p className="font-bold">20</p>
                    </div>

                    <div>
                    <p className="font-semibold">Solicitudes aceptadas</p>
                    <p className="text-red-500 font-bold">85%</p>
                    </div>

                </div>
                </div>

                {/* BAR CHART */}
                <div>
                <h2 className="text-sm text-gray-500 mb-2">
                    Documentos Emitidos
                </h2>

                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData}>
                    <XAxis dataKey="day" />
                    <Tooltip />
                    <Bar
                        dataKey="docs"
                        fill="#1a2b5e"
                        radius={[6, 6, 0, 0]}
                    />
                    </BarChart>
                </ResponsiveContainer>
                </div>

            </div>
            </div>
        </div>

        {/* SECCION BLANCA (ULTIMAS SOLICITUDES) */}
        <div className="px-10 py-12 bg-white">

            <div className="max-w-6xl mx-auto">

            <h2 className="text-xl font-semibold mb-6">
                Últimas solicitudes
            </h2>

            <div className="grid grid-cols-2 gap-6">

                {[1, 2].map((item) => (
                <div
                    key={item}
                    className="flex items-center justify-between border rounded-xl p-4 shadow-sm"
                >

                    <div className="flex items-center gap-4">

                    <div className="w-16 h-12 rounded bg-gradient-to-r from-purple-700 to-blue-500" />

                    <div>
                        <p className="font-semibold">Solicitud #{item}</p>
                    </div>

                    </div>

                    <div className="flex gap-2">

                    <button
                    onClick={() => navigate("/backoffice/solicitud/69")}
                    className="px-4 py-1 border rounded text-sm"
                    >
                        Ver
                    </button>
                    <button className="px-4 py-1 bg-blue-600 text-white rounded text-sm">
                        Aceptar
                    </button>

                    <button className="px-4 py-1 bg-red-500 text-white rounded text-sm">
                        Rechazar
                    </button>

                    </div>

                </div>
                ))}

            </div>

            </div>

        </div>

        </BackofficeLayout>
    );
    };