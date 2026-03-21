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

  /* ------------------ FETCH FORM ------------------ */

  useEffect(() => {

    const fetchForm = async () => {

      const API_URL =
        import.meta.env.VITE_REACT_APP_BACKEND ||
        "https://gobdocs-backend.up.railway.app";

      console.log("🔵 Fetching formulario para tipoDocumentoId:", tipoDocumentoId);

      const res = await fetch(
        `${API_URL}/formularios/tipo-documento/${tipoDocumentoId}`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await res.json();

      console.log("📥 Formulario recibido COMPLETO:", data);

      // 🔥 IMPORTANTE: guardar TODO el objeto
      setForm(data);

    };

    if (tipoDocumentoId) fetchForm();

  }, [tipoDocumentoId]);

  /* ------------------ HANDLE CHANGE ------------------ */

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => {
      const updated = {
        ...prev,
        [name]: value
      };

      console.log("🟢 formData actualizado:", updated);

      return updated;
    });
  };

  /* ------------------ SUBMIT SOLICITUD ------------------ */

  const submitSolicitud = async () => {

    const API_URL =
      import.meta.env.VITE_REACT_APP_BACKEND ||
      "http://localhost:3000";

    const token = localStorage.getItem("token");

    const carrito = JSON.parse(
      localStorage.getItem("solicitudCarrito") || "[]"
    );

    console.log("🟡 Enviando solicitud...");
    console.log("🛒 Carrito:", carrito);

    if (!carrito.length) {
      console.log("❌ Carrito vacío");
      alert("No hay solicitudes en el carrito");
      return;
    }

    const body = {
      solicitudes: carrito.map((item: any) => ({
        Formulario_ID: item.Formulario_ID,
        respuestas: item.formData
      }))
    };

    console.log("📦 BODY FINAL:", JSON.stringify(body));

    try {

      const res = await fetch(`${API_URL}/solicitudes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      console.log("📡 STATUS:", res.status);

      const data = await res.json();
      console.log("📥 RESPONSE:", data);

      if (!res.ok) {
        throw new Error("Error en backend");
      }

      localStorage.removeItem("solicitudCarrito");

      setPaymentSuccess(true);

    } catch (error) {
      console.error("❌ Error creando solicitud:", error);
      alert("Error creando la solicitud");
    }
  };

  /* ------------------ SUCCESS SCREEN ------------------ */

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

  /* ------------------ UI ------------------ */

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
              {form?.Form_Definition?.nombre}
            </h3>

            <div className="space-y-4">

              {form?.Form_Definition?.campos?.map((campo: any) => {

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

              <Button
                onClick={() => {

                  console.log("🟠 Click en Proceder");
                  console.log("FormData actual:", formData);
                  console.log("Formulario actual:", form);

                  if (!formData || Object.keys(formData).length === 0) {
                    alert("Completa el formulario antes de continuar");
                    return;
                  }

                  if (!form?.Formulario_ID) {
                    console.error("❌ Formulario_ID no existe");
                    alert("Error: no se encontró el ID del formulario");
                    return;
                  }

                  const currentCart = JSON.parse(
                    localStorage.getItem("solicitudCarrito") || "[]"
                  );

                  currentCart.push({
                    Formulario_ID: form.Formulario_ID, // 🔥 clave
                    formData
                  });

                  console.log("🛒 Nuevo carrito:", currentCart);

                  localStorage.setItem(
                    "solicitudCarrito",
                    JSON.stringify(currentCart)
                  );

                  setShowAddAnotherModal(true);
                }}
              >
                Proceder
              </Button>

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

      {/* MODAL */}
      {showAddAnotherModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">

            <h2 className="text-xl font-bold text-gobdocs-primary mb-4">
              ¿Desea agregar otro documento a la solicitud?
            </h2>

            <div className="flex gap-4 justify-center mt-6">

              <Button
                onClick={() => {
                  console.log("🟢 Usuario quiere agregar otro documento");
                  setShowAddAnotherModal(false);
                  navigate("/portal/solicitar");
                }}
              >
                Sí, agregar otro
              </Button>

              <button
                onClick={async () => {

                  console.log("🔴 Usuario terminó → enviando solicitud");

                  setShowAddAnotherModal(false);

                  await submitSolicitud();

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