import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../shared/layouts/DashboardLayout";
import { Button } from "../../../shared/ui/Button";

export const PagoExitosoPage = () => {

  const navigate = useNavigate();

  return (

    <DashboardLayout>

      <div className="flex justify-center items-center min-h-[80vh]">

        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-lg">

          {/* ICONO */}
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl">✓</span>
          </div>

          <h2 className="text-xl font-bold text-gobdocs-primary">
            Tu Pago ha sido realizado exitosamente
          </h2>

          <p className="text-gray-500 mt-2">
            Gracias por usar nuestros servicios
          </p>

          <div className="flex justify-center gap-4 mt-8">

            <Button
              onClick={() => navigate("/portal/documentos")}
            >
              Ver mis documentos
            </Button>

            <button
              onClick={() => navigate("/portal")}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Volver al inicio
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );
};