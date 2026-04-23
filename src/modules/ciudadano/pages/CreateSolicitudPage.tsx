import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../shared/layouts/DashboardLayout";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

type Tarifa = {
  Tarifario_Codigo: number;
  Nombre: string;
  Descripcion: string;
  Costo_Por_Servicio: number | string;
};

export const CreateSolicitudPage = () => {
  const { tipoDocumentoId } = useParams();
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const [form, setForm] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [detalles, setDetalles] = useState<
    { tarifarioId: number; cantidad: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ------------------ FETCH FORM + TARIFAS ------------------ */

  useEffect(() => {
    const fetchData = async () => {
      if (!tipoDocumentoId) return;

      setLoading(true);

      try {
        const formRes = await fetch(
          `${API_URL}/formularios/tipo-documento/${tipoDocumentoId}`
        );

        const formJson = await formRes.json();
        setForm(formJson);

        const tarifasRes = await fetch(
          `${API_URL}/tarifarios/tipo-documento/${tipoDocumentoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const tarifasJson = await tarifasRes.json();

        if (!Array.isArray(tarifasJson) || tarifasJson.length === 0) {
          setTarifas([]);
          setDetalles([]);
        } else {
          setTarifas(tarifasJson);

          const detallesIniciales = tarifasJson.map((t: Tarifa) => ({
            tarifarioId: t.Tarifario_Codigo,
            cantidad: 1,
          }));

          setDetalles(detallesIniciales);
        }
      } catch (error) {
        console.error(error);
        alert("Error cargando formulario o tarifas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tipoDocumentoId]);

  /* ------------------ HANDLE CHANGE ------------------ */

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ------------------ 🛒 ADD TO CART ------------------ */

  const handleAddToCart = () => {
    if (!form?.Formulario_ID) return;

    if (!formData || Object.keys(formData).length === 0) {
      alert("Completa el formulario");
      return;
    }

    if (!detalles.length) {
      alert("Este documento no tiene tarifas configuradas.");
      return;
    }

    const existingCart = JSON.parse(
      localStorage.getItem("gobdocs_cart") || "[]"
    );

    const newItem = {
      Formulario_ID: form.Formulario_ID,
      respuestas: formData,
      detalles: detalles,
      tarifas: tarifas,
      nombre: form?.Nombre || `Documento ${tipoDocumentoId}`,
      TipoDocumento_ID: tipoDocumentoId,
    };

    const updatedCart = [...existingCart, newItem];

    localStorage.setItem("gobdocs_cart", JSON.stringify(updatedCart));

    navigate("/portal/solicitar", {
      state: { refreshCart: true },
    });
  };

  /* ------------------ 💳 GO TO PAYMENT ------------------ */

  const handleGoToPayment = async () => {
    if (!form?.Formulario_ID) {
      alert("Formulario inválido");
      return;
    }

    if (!formData || Object.keys(formData).length === 0) {
      alert("Completa el formulario");
      return;
    }

    if (!detalles.length) {
      alert("Este documento no tiene tarifas configuradas.");
      return;
    }

    const existingCart = JSON.parse(
      localStorage.getItem("gobdocs_cart") || "[]"
    );

    const solicitudes = [
      ...existingCart,
      {
        Formulario_ID: form.Formulario_ID,
        respuestas: formData,
        detalles: detalles,
      },
    ];

    try {
      setSubmitting(true);

      const res = await fetch(`${API_URL}/solicitudes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          solicitudes,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      const numeroSolicitud = Array.isArray(data)
        ? data[0]?.Numero_Solicitud
        : data?.Numero_Solicitud;

      localStorage.removeItem("gobdocs_cart");

      navigate(`/portal/pago/${numeroSolicitud}`);
    } catch (error) {
      console.error(error);
      alert("Error creando la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------ UI ------------------ */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <p>Cargando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Crear Solicitud
        </h1>

        <div className="space-y-4">
          {form?.Form_Definition?.campos?.map((campo: any) => {
            if (campo.type === "select") {
              return (
                <select
                  key={campo.name}
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    handleChange(campo.name, e.target.value)
                  }
                >
                  <option value="">Seleccione</option>
                  {campo.options?.map((opt: string) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              );
            }

            return (
              <Input
                key={campo.name}
                label={campo.label}
                type={campo.type}
                onChange={(e: any) =>
                  handleChange(campo.name, e.target.value)
                }
              />
            );
          })}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Tarifas</h2>

          {tarifas.length > 0 ? (
            tarifas.map((t) => (
              <div
                key={t.Tarifario_Codigo}
                className="flex justify-between border p-3 rounded mb-2"
              >
                <div>
                  <p className="font-medium">{t.Nombre}</p>
                  <p className="text-sm text-gray-500">
                    {t.Descripcion}
                  </p>
                </div>
                <p className="font-bold">
                  RD$ {t.Costo_Por_Servicio}
                </p>
              </div>
            ))
          ) : (
            <p className="text-red-500">
              ⚠️ Este documento no tiene tarifas configuradas
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <Button
            onClick={handleAddToCart}
            className="w-full p-2 rounded-xl bg-gray-200 text-gray-800"
          >
            Agregar otro documento
          </Button>

          <Button
            onClick={handleGoToPayment}
            disabled={submitting}
            className="w-full p-2 rounded-xl bg-gobdocs-primary text-white hover:bg-gobdocs-secondaryblue transition"
          >
            {submitting ? "Procesando..." : "Ir a pagar"}
          </Button>
        </div>
      </div>

      {/* 🔥 LOADER FULLSCREEN */}
      {submitting && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4">
            
            <div className="w-12 h-12 border-4 border-gobdocs-primary border-t-transparent rounded-full animate-spin"></div>

            <p className="text-gobdocs-primary font-semibold">
              Procesando solicitud...
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};