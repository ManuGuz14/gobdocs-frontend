import { BackofficeLayout } from "../../shared/layouts/BackOfficeLayout";
import { useNavigate } from "react-router-dom";

export const VerAllSolicitudBkOfficePage = () => {

  const navigate = useNavigate();

  const solicitudes = [
    { id: 69, descripcion: "Solicitud de licencia de conducir" },
    { id: 70, descripcion: "Solicitud de certificado de nacimiento" },
    { id: 71, descripcion: "Solicitud de récord policial" },
    { id: 72, descripcion: "Solicitud de certificado médico" },
  ];

  return (
    <BackofficeLayout>

      <div className="min-h-[85vh] bg-[#f4f4f4] flex flex-col items-center py-14 px-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-[#1a2b5e] mb-10">
          Administración de Solicitudes
        </h1>

        {/* CONTAINER */}
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-10 border">

          <div className="grid grid-cols-2 gap-10">

            {solicitudes.map((solicitud) => (

              <div
                key={solicitud.id}
                className="flex items-center gap-6 border rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >

                {/* IMAGE */}
                <div className="w-28 h-16 rounded-lg bg-gradient-to-r from-purple-700 to-blue-500" />

                {/* TEXT */}
                <div className="flex-1">

                  <p className="text-sm text-gray-500 mb-1">
                    Solicitud #{solicitud.id}
                  </p>

                  <p className="text-sm text-gray-600 mb-3">
                    {solicitud.descripcion}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/backoffice/solicitud/${solicitud.id}`)
                    }
                    className="px-6 py-1 border border-[#1a2b5e] text-[#1a2b5e] rounded-full text-sm hover:bg-[#1a2b5e] hover:text-white transition"
                  >
                    Ver
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