import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { DashboardLayout } from "../../../shared/layouts/DashboardLayout";

export const PaymentPage = () => {
  const { numeroSolicitud } = useParams();
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

  /* ------------------ CREAR PAYMENT INTENT ------------------ */

  useEffect(() => {
    const createIntent = async () => {
      if (!numeroSolicitud) return;

      try {
        const res = await fetch(
          `${API_URL}/payments/create-intent/${numeroSolicitud}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          throw new Error("Error creando PaymentIntent");
        }

        setClientSecret(data.client_secret);
        setMonto(data.monto); // 👈 mostrar total
      } catch (error) {
        console.error("❌ Error creando intent:", error);
        alert("Error iniciando el pago");
      } finally {
        setLoadingIntent(false);
      }
    };

    createIntent();
  }, [numeroSolicitud]);

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
        alert(result.error.message);
        setPaying(false);
        return;
      }

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

      navigate("/portal/pago-exitoso");
    } catch (error) {
      console.error(error);
      alert("Error procesando el pago");
    } finally {
      setPaying(false);
    }
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
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
        {/* BOTÓN VOLVER */}
        <button
          onClick={() => {
            const confirmed = window.confirm(
              "¿Estás seguro de que deseas cancelar el pago? Podrás volver a pagar desde tus solicitudes."
            );
            if (confirmed) {
              navigate("/portal/solicitudes");
            }
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gobdocs-primary mb-4 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <h1 className="text-2xl font-bold mb-6">Completar Pago</h1>

        {/* 💰 MONTO */}
        <div className="mb-6 p-4 bg-gray-100 rounded-xl">
          <p className="text-sm text-gray-500">Total a pagar</p>
          <p className="text-2xl font-bold text-gobdocs-primary">
            RD$ {monto}
          </p>
        </div>

        {/* 💳 CARD NUMBER */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Número de tarjeta
          </label>
          <div className="border rounded-lg p-3">
            <CardNumberElement />
          </div>
        </div>

        {/* 📅 + CVV */}
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

        {/* 🔘 BOTONES */}
        <button
          onClick={handlePayment}
          disabled={!stripe || paying}
          className="w-full bg-gobdocs-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-900 transition disabled:opacity-50"
        >
          {paying ? "Procesando..." : "Pagar ahora"}
        </button>

        <button
          onClick={() => {
            const confirmed = window.confirm(
              "¿Estás seguro de que deseas cancelar el pago?"
            );
            if (confirmed) {
              navigate("/portal/solicitudes");
            }
          }}
          disabled={paying}
          className="w-full mt-3 bg-white text-red-500 border-2 border-red-400 py-3 rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
        >
          Cancelar pago
        </button>
      </div>
    </DashboardLayout>
  );
};