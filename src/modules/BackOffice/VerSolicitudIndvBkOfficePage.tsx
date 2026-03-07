import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import { FileText, User, IdCard } from "lucide-react";

export const VerSolicitudBkOfficePage = () => {
  return (
    <BackofficeLayout>
      <div className="bg-[#f4f4f4] min-h-[80vh] flex items-center justify-center px-6 py-10">

        <div className="bg-white rounded-2xl shadow-xl w-[900px] p-10">

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-center text-gobdocs-primary mb-10">
            Visualizacion de solicitud
          </h1>

          <div className="grid grid-cols-2 gap-10">

            {/* LEFT SIDE */}
            <div>

              <h2 className="text-xl font-semibold mb-4">
                Solicitud #69
              </h2>

              <p className="text-gray-600 text-sm mb-6">
                Esta solicitud consiste en la emisión nueva de una licencia de conducir
              </p>

              <div className="space-y-4 text-sm">

                <div className="flex items-center gap-3">
                  <User size={18} className="text-gobdocs-primary" />
                  <span>Juan Perez</span>
                </div>

                <div className="flex items-center gap-3">
                  <IdCard size={18} className="text-gobdocs-primary" />
                  <span>Cédula: 402-0000000-0</span>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gobdocs-primary" />
                  <span>Documento: Licencia de conducir</span>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gobdocs-primary" />
                  <span>Aprobado por: Rodolfo Cuevas</span>
                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}
            <div>

              <h2 className="font-semibold mb-4">
                Documentos adjuntos
              </h2>

              {/* FILE CARD */}
              <div className="flex items-center justify-between border rounded-xl p-3 shadow-sm mb-8">

                <div className="flex items-center gap-3">

                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    PDF
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Cedula.pdf</p>
                    <p className="text-xs text-gray-400">38MB</p>
                  </div>

                </div>

                <button className="text-gray-400 hover:text-red-500 text-lg">
                  ×
                </button>

              </div>

              {/* COMMENTS */}
              <h2 className="font-semibold mb-2">
                Comentarios
              </h2>

              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 mb-8"
              />

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 justify-end">

                <button className="px-6 py-2 bg-[#1a2b5e] text-white rounded-lg hover:opacity-90">
                  Aprobar
                </button>

                <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:opacity-90">
                  Rechazar
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </BackofficeLayout>
  );
};