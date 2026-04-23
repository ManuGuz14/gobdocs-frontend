import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, ChevronDown, ArrowLeft } from "lucide-react";
import logo from "../../assets/GobDocsLogo.png";

interface BackofficeLayoutProps {
  children: React.ReactNode;
}

export const BackofficeLayout: React.FC<BackofficeLayoutProps> = ({ children }) => {

  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== "/backoffice";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-visible">

      {/* NAVBAR */}
      <nav className="bg-gobdocs-primary text-white py-10 px-10 w-full relative overflow-visible">

        <div className="w-full flex justify-between items-center">

          {/* LOGO */}
          <Link
            to="/landingbkoffice"
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
          </Link>

          <div className="flex items-center gap-8">

            {/* VISUALIZAR */}
            <div className="relative group h-full flex items-center">

              <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200 transition-colors py-2">
                <span className="font-medium">Visualizar</span>
                <ChevronDown size={16} />
              </div>

              <div className="absolute left-0 top-full pt-2 w-48 invisible opacity-0 translate-y-2
              group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300 z-50">

                <div className="bg-white rounded-xl shadow-xl py-2 border border-gray-100">

                  <Link
                    to="/backoffice/solicitudes"
                    className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50"
                  >
                    Solicitudes
                  </Link>

                  <Link
                    to="/backoffice/documentos"
                    className="block px-6 py-3 text-sm text-[#1a2b5e] hover:bg-blue-50"
                  >
                    Documentos emitidos
                  </Link>

                </div>
              </div>

            </div>

            {/* EMITIR */}
            <Link
              to="/backoffice/emitir"
              className="hidden md:flex items-center gap-1 hover:text-blue-200"
            >
              <span className="font-medium">Emitir</span>
              <ChevronDown size={16} />
            </Link>

            {/* USER */}
            <div className="relative group pl-4 border-l border-white/20 ml-4">

              <div className="bg-white/10 p-2 rounded-full hover:bg-white/20 cursor-pointer">
                <User size={20} />
              </div>

              {/* DROPDOWN FIXED */}
              <div className="absolute right-0 top-14 w-48 invisible opacity-0 scale-95
                group-hover:visible group-hover:opacity-100 group-hover:scale-100
                transition-all duration-200 origin-top-right z-50">

                <div className="bg-white rounded-xl shadow-xl py-2 border border-gray-100">

                  <Link
                    to="/backoffice/perfil"
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
            className="absolute left-40 top-2 z-20 flex items-center gap-2 text-white hover:text-gray-400"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        )}

        {children}

      </main>

      {/* FOOTER */}
      <footer className="bg-gobdocs-primary text-white py-6 px-8 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>GobDocs RD © 2026</span>
        </div>
      </footer>

    </div>
  );
};