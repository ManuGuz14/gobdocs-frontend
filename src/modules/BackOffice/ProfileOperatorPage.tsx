import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeft, Shield, Building2, Mail, CreditCard, BadgeCheck } from "lucide-react";
import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import Imagendefondo from "../../assets/Perfil/Geo-Background-Profile.png";

export const ProfileOperatorPage = () => {
  const navigate = useNavigate();

  // Datos del usuario logueado
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const [institutionName, setInstitutionName] = useState<string>("");

  // Intentar obtener el nombre de la institución
  useEffect(() => {
    const fetchInstitution = async () => {
      const instId = user?.institucionId || user?.institucion_id || user?.Institucion_ID;
      if (!instId) return;

      try {
        const res = await fetch(`${API_URL}/institution`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        const institutions = Array.isArray(data) ? data : data.data || [];

        const found = institutions.find(
          (inst: any) => inst.Institucion_ID === Number(instId)
        );

        if (found) setInstitutionName(found.Nombre);
      } catch (error) {
        console.error("Error fetching institution:", error);
      }
    };

    fetchInstitution();
  }, []);

  const rolDisplay = (() => {
    const rol = (user?.rol || user?.Rol || "").toLowerCase();
    if (rol === "operador") return "Operador";
    if (rol === "admin" || rol === "administrador") return "Administrador";
    return rol.charAt(0).toUpperCase() + rol.slice(1) || "Operador";
  })();

  const instId = user?.institucionId || user?.institucion_id || user?.Institucion_ID || "";

  return (
    <BackofficeLayout>
      {/* Contenedor Principal */}
      <div className="relative min-h-[85vh] flex items-center justify-center p-4">

        {/* FONDO GEOMÉTRICO */}
        <div className="absolute bottom-0 right-0 w-[500px] opacity-30 pointer-events-none">
          <img
            src={Imagendefondo}
            alt="Fondo decorativo"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* CONTENIDO */}
        <div className="relative z-10 w-full max-w-4xl">

          {/* Título */}
          <h1 className="text-3xl font-bold text-gobdocs-primary mb-6 ml-2">
            Mi perfil — Operador
          </h1>

          {/* TARJETA */}
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-gray-100 relative">

            {/* Botón volver */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-8 left-8 text-gobdocs-primary hover:scale-110 transition-transform"
            >
              <ArrowLeft size={32} strokeWidth={1.5} />
            </button>

            {/* ICONO DE USUARIO */}
            <div className="flex justify-center mb-10">
              <div className="w-32 h-32 border-2 border-gobdocs-primary/30 rounded-2xl flex items-center justify-center text-gobdocs-primary bg-gradient-to-br from-blue-50 to-white shadow-sm relative">
                <User size={80} strokeWidth={1.5} />

                {/* Badge de operador */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gobdocs-primary text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Shield size={12} />
                  {rolDisplay}
                </div>
              </div>
            </div>

            {/* NOMBRE COMPLETO */}
            <h2 className="text-center text-xl font-semibold text-gobdocs-primary mb-8">
              {user?.nombre || "Nombre"} {user?.apellido || "Apellido"}
            </h2>

            {/* FORMULARIO / INFO */}
            <div className="space-y-5 max-w-2xl mx-auto">

              {/* Nombre */}
              <div>
                <label className="flex items-center gap-2 text-gobdocs-primary font-bold mb-2">
                  <BadgeCheck size={16} />
                  Nombre
                </label>
                <input
                  type="text"
                  value={user?.nombre || ""}
                  className="w-full border-2 border-gray-200 rounded-full py-3 px-6 text-gray-600 bg-gray-50 focus:outline-none"
                  readOnly
                />
              </div>

              {/* Apellido */}
              <div>
                <label className="flex items-center gap-2 text-gobdocs-primary font-bold mb-2">
                  <BadgeCheck size={16} />
                  Apellido
                </label>
                <input
                  type="text"
                  value={user?.apellido || ""}
                  className="w-full border-2 border-gray-200 rounded-full py-3 px-6 text-gray-600 bg-gray-50 focus:outline-none"
                  readOnly
                />
              </div>

              {/* Cédula */}
              <div>
                <label className="flex items-center gap-2 text-gobdocs-primary font-bold mb-2">
                  <CreditCard size={16} />
                  Cédula
                </label>
                <input
                  type="text"
                  value={user?.cedula || ""}
                  className="w-full border-2 border-gray-200 rounded-full py-3 px-6 text-gray-400 bg-gray-50 focus:outline-none"
                  readOnly
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-gobdocs-primary font-bold mb-2">
                  <Mail size={16} />
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="w-full border-2 border-gray-200 rounded-full py-3 px-6 text-gray-600 bg-gray-50 focus:outline-none"
                  readOnly
                />
              </div>

              {/* Rol */}
              <div>
                <label className="flex items-center gap-2 text-gobdocs-primary font-bold mb-2">
                  <Shield size={16} />
                  Rol
                </label>
                <input
                  type="text"
                  value={rolDisplay}
                  className="w-full border-2 border-gobdocs-primary/20 rounded-full py-3 px-6 text-gobdocs-primary font-semibold bg-blue-50 focus:outline-none"
                  readOnly
                />
              </div>

              {/* Institución */}
              <div>
                <label className="flex items-center gap-2 text-gobdocs-primary font-bold mb-2">
                  <Building2 size={16} />
                  Institución
                </label>
                <input
                  type="text"
                  value={
                    institutionName
                      ? `${institutionName} (ID: ${instId})`
                      : instId
                        ? `Institución #${instId}`
                        : "No asignada"
                  }
                  className="w-full border-2 border-gobdocs-primary/20 rounded-full py-3 px-6 text-gobdocs-primary font-semibold bg-blue-50 focus:outline-none"
                  readOnly
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </BackofficeLayout>
  );
};
