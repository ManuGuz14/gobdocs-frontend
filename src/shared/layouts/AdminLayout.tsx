import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ArrowLeft, Shield } from "lucide-react";
import logo from "../../assets/GobDocsLogo.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== "/admin";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-visible">

      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white py-8 px-10 w-full relative overflow-visible">
        <div className="w-full flex justify-between items-center">

          {/* LOGO */}
          <Link
            to="/admin"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <img
              src={logo}
              alt="GobDocs Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="font-bold text-lg tracking-wide">
              GobDocs RD
            </span>
            <span className="ml-2 px-2 py-0.5 bg-amber-500 text-[10px] font-bold uppercase rounded-full tracking-wider">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-8">

            {/* GESTIÓN */}
            <div className="relative group h-full flex items-center">
              <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200 transition-colors py-2">
                <span className="font-medium">Gestión</span>
                <ChevronDown size={16} />
              </div>

              <div className="absolute left-0 top-full pt-2 w-52 invisible opacity-0 translate-y-2
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300 z-50">
                <div className="bg-white rounded-xl shadow-xl py-2 border border-gray-100">

                  {/* ❌ USUARIOS ELIMINADO */}

                  <Link
                    to="/admin/instituciones"
                    className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50"
                  >
                    Instituciones
                  </Link>
                  <Link
                    to="/admin/tipos-documento"
                    className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50"
                  >
                    Tipos de documento
                  </Link>
                  <Link
                    to="/admin/formularios"
                    className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50"
                  >
                    Formularios
                  </Link>
                  <Link
                    to="/admin/tarifas"
                    className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50"
                  >
                    Asignar tarifas
                  </Link>

                  <div className="border-t my-1"></div>

                  <Link
                    to="/admin/carga-masiva"
                    className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50"
                  >
                    Carga masiva
                  </Link>
                </div>
              </div>
            </div>

            {/* ❌ REPORTES ELIMINADO */}

            {/* USER */}
            <div className="relative group pl-4 border-l border-white/20 ml-4">
              <div className="bg-white/10 p-2 rounded-full hover:bg-white/20 cursor-pointer transition-colors">
                <Shield size={20} />
              </div>

              <div className="absolute right-0 top-14 w-48 invisible opacity-0 scale-95
                group-hover:visible group-hover:opacity-100 group-hover:scale-100
                transition-all duration-200 origin-top-right z-50">
                <div className="bg-white rounded-xl shadow-xl py-2 border border-gray-100">
                  <Link
                    to="/admin/perfil"
                    className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50"
                  >
                    Mi perfil
                  </Link>
                  <div className="border-t my-1"></div>
                  <Link
                    to="/auth/login"
                    className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50"
                  >
                    Cerrar sesión
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 w-full relative">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="absolute left-40 top-2 z-20 flex items-center gap-2 text-white hover:text-gray-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        )}

        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white py-6 px-8 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>GobDocs RD © 2026 — Panel Administrativo</span>
        </div>
      </footer>

    </div>
  );
};