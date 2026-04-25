import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, X } from "lucide-react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { DashboardLayout } from "../../../shared/layouts/DashboardLayout";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export const PaymentPage = () => {
  const { numeroSolicitud } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isMultiple = searchParams.get("multiple") === "true" ||
  location.pathname.includes("multiple");


  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [monto, setMonto] = useState<number>(0);
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [paying, setPaying] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);

  /* ------------------ CREAR PAYMENT INTENT ------------------ */

  useEffect(() => {
    const createIntent = async () => {
      try {
        let res;
        let data;

        if (isMultiple) {
          const storedIds = JSON.parse(
            localStorage.getItem("gobdocs_payment_solicitud_ids") || "[]"
          );

          if (!storedIds.length) {
            toast.error("No hay solicitudes para pagar");
            navigate("/portal/solicitar");
            return;
          }

          res = await fetch(`${API_URL}/payments/create-intent-from-solicitudes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              solicitudIds: storedIds,
            }),
          });
        } else {
          if (!numeroSolicitud) return;

          res = await fetch(
            `${API_URL}/payments/create-intent/${numeroSolicitud}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        data = await res.json();

        if (!res.ok) throw new Error();

        setClientSecret(data.client_secret);
        setMonto(data.monto);

      } catch (error) {
        console.error("❌ Error creando intent:", error);
        toast.error("Error iniciando el pago");
      } finally {
        setLoadingIntent(false);
      }
    };

    createIntent();
  }, [numeroSolicitud, isMultiple]);

  /* ------------------ HANDLE PAGO ------------------ */

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setPaying(true);

    try {
      const cardNumber = elements.getElement(CardNumberElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber!,
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setPaying(false);
        return;
      }

      if (isMultiple) {
        const storedIds = JSON.parse(
          localStorage.getItem("gobdocs_payment_solicitud_ids") || "[]"
        );

        await fetch(`${API_URL}/payments/confirm-multiple`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentIntentId: result.paymentIntent.id,
            solicitudIds: storedIds,
          }),
        });

        // 🔥 limpiar storage
        localStorage.removeItem("gobdocs_payment_solicitud_ids");
        localStorage.removeItem("gobdocs_cart");

      } else {
        await fetch(`${API_URL}/payments/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentIntentId: result.paymentIntent.id,
            solicitudId: Number(numeroSolicitud),
          }),
        });
      }

      toast.success("Pago realizado correctamente 🎉");
      navigate("/portal/pago-exitoso");

    } catch (error) {
      console.error(error);
      toast.error("Error procesando el pago");
    } finally {
      setPaying(false);
    }
  };

  /* ------------------ CANCELAR ------------------ */

  const handleCancelPayment = () => {
    toast.info("Pago cancelado. Puedes retomarlo luego desde tus solicitudes.");
    navigate("/portal/solicitudes");
  };

  /* ------------------ UI ------------------ */

  if (loadingIntent) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <p>Preparando pago...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout>
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">

          <button
            onClick={() => setShowCancelModal(true)}
            className="flex items-center gap-2 text-gray-500 hover:text-gobdocs-primary mb-4 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Volver
          </button>

          <h1 className="text-2xl font-bold mb-6">Completar Pago</h1>

          <div className="mb-6 p-4 bg-gray-100 rounded-xl">
            <p className="text-sm text-gray-500">Total a pagar</p>
            <p className="text-2xl font-bold text-gobdocs-primary">
              RD$ {monto}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Número de tarjeta
            </label>
            <div className="border rounded-lg p-3">
              <CardNumberElement />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de expiración
              </label>
              <div className="border rounded-lg p-3">
                <CardExpiryElement />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                CVV
              </label>
              <div className="border rounded-lg p-3">
                <CardCvcElement />
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!stripe || paying}
            className="w-full bg-gobdocs-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-900 transition disabled:opacity-50"
          >
            {paying ? "Procesando..." : "Pagar ahora"}
          </button>

          <button
            onClick={() => setShowCancelModal(true)}
            disabled={paying}
            className="w-full mt-3 bg-white text-red-500 border-2 border-red-400 py-3 rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
          >
            Cancelar pago
          </button>
        </div>
      </DashboardLayout>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">

            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={32} className="text-red-500" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ¿Cancelar pago?
              </h3>

              <p className="text-gray-500 text-sm mb-8">
                Si sales ahora, podrás retomar el pago más tarde desde tus solicitudes.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Volver
                </button>

                <button
                  onClick={handleCancelPayment}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Sí, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};