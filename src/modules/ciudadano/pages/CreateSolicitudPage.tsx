import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../shared/layouts/DashboardLayout";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import Imagendefondo from "../../../assets/Solicitud/Geo-Background.png";

export const CreateSolicitudPage = () => {

  const { tipoDocumentoId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showAddAnotherModal, setShowAddAnotherModal] = useState(false);

  useEffect(() => {

    const fetchForm = async () => {

      const API_URL =
        import.meta.env.VITE_REACT_APP_BACKEND ||
        "https://gobdocs-backend.up.railway.app";

      const operadorToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNDY5YmI0ZC04OGNhLTQwYmEtOTQ1NC0yZGZkMzljMmU4OGQiLCJlbWFpbCI6InBlZHJvMUBob3RtYWlsLmNvbSIsInJvbCI6Ik9QRVJBRE9SIiwiaW5zdGl0dWNpb25JZCI6ImE4Zjk4ZDY1LTFjMWMtNDkwZS05Y2IxLTk4Mjk3NzdlNWI2MCIsImlhdCI6MTc3Mjg5NDE4NiwiZXhwIjoxNzcyODk3Nzg2fQ.KVUwszjZ7ZZjv-2-oS4W7xnDu3R1GJ-ImnYIeSQf0eM";

      const res = await fetch(
        `${API_URL}/formularios/tipo-documento/${tipoDocumentoId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${operadorToken}`
          }
        }
      );

      const data = await res.json();

      if (data?.Form_Definition) {
        setForm(data.Form_Definition);
      }

    };

    if (tipoDocumentoId) fetchForm();

  }, [tipoDocumentoId]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  /* ------------------ PAGO EXITOSO ------------------ */

  if (paymentSuccess) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[80vh]">

          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-lg">

            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-4xl">✓</span>
            </div>

            <h2 className="text-xl font-bold text-gobdocs-primary">
              Tu Pago ha sido realizado exitosamente
            </h2>

            <p className="text-gray-500 mt-2">
              Gracias por usar nuestros servicios
            </p>

            <div className="mt-6">
              <Button onClick={() => navigate("/portal")}>
                Volver al inicio
              </Button>
            </div>

          </div>

        </div>
      </DashboardLayout>
    );
  }

  return (

    <DashboardLayout>

      <div className="relative min-h-[85vh] flex items-center justify-center p-4 overflow-hidden">

        {/* Fondo */}
        <div className="absolute bottom-0 right-0 w-[1000px] opacity-40 pointer-events-none">
          <img
            src={Imagendefondo}
            alt="Fondo decorativo"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-12 gap-12 items-start">

          {/* IZQUIERDA */}
          <div className="lg:col-span-5 space-y-10 pt-10">

            <div>
              <h2 className="text-3xl font-bold text-gobdocs-primary mb-6">
                Requisitos
              </h2>

              <ul className="space-y-3 text-gray-600">
                <li>• Documento de identidad vigente</li>
                <li>• Formulario completado</li>
                <li>• Pago de impuestos al día</li>
                <li>• Documentos legalizados</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gobdocs-primary mb-6">
                Recomendaciones
              </h2>

              <ul className="space-y-3 text-gray-600">
                <li>• Escanear documentos a color</li>
                <li>• Verificar la legibilidad</li>
              </ul>
            </div>

          </div>

          {/* FORMULARIO */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-2xl p-10 border">

            <h3 className="text-xl font-bold text-gobdocs-primary mb-6">
              {form?.nombre}
            </h3>

            <div className="space-y-4">

              {form?.campos?.map((campo: any) => {

                if (campo.type === "text" || campo.type === "date") {
                  return (
                    <Input
                      key={campo.name}
                      placeholder={campo.label}
                      type={campo.type}
                      onChange={(e: any) =>
                        handleChange(campo.name, e.target.value)
                      }
                    />
                  );
                }

                if (campo.type === "select") {
                  return (
                    <select
                      key={campo.name}
                      className="w-full border rounded-lg p-3"
                      onChange={(e) =>
                        handleChange(campo.name, e.target.value)
                      }
                    >
                      <option>{campo.label}</option>

                      {campo.options?.map((opt: string) => (
                        <option key={opt}>{opt}</option>
                      ))}

                    </select>
                  );
                }

              })}

            </div>

            {/* BOTONES */}
            <div className="flex gap-4 mt-8">

              {/* PROCEDER */}
              <Button
                onClick={() => {

                  const currentCart = JSON.parse(
                    localStorage.getItem("solicitudCarrito") || "[]"
                  );

                  currentCart.push({
                    tipoDocumentoId,
                    formData
                  });

                  localStorage.setItem(
                    "solicitudCarrito",
                    JSON.stringify(currentCart)
                  );

                  setShowAddAnotherModal(true);

                }}
              >
                Proceder
              </Button>

              {/* CANCELAR */}
              <button
                onClick={() => navigate("/portal/solicitar")}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600"
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* MODAL AGREGAR OTRO DOCUMENTO */}

      {showAddAnotherModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">

            <h2 className="text-xl font-bold text-gobdocs-primary mb-4">
              ¿Desea agregar otro documento a la solicitud?
            </h2>

            <div className="flex gap-4 justify-center mt-6">

              {/* SI */}
              <Button
                onClick={() => {
                  setShowAddAnotherModal(false);
                  navigate("/portal/solicitar");
                }}
              >
                Sí, agregar otro
              </Button>

              {/* NO */}
              <button
                onClick={() => {
                  setShowAddAnotherModal(false);
                  setPaymentSuccess(true);
                }}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold"
              >
                No
              </button>

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>

  );
};