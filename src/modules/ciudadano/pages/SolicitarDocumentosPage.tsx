import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ShoppingCart
} from "lucide-react";

import { DashboardLayout } from "../../../shared/layouts/DashboardLayout";
import Cedulaimage from "../../../assets/Docs/Cedulaimage.png";
import Actadenac from "../../../assets/Docs/Actadenac.png";

export const SolicitarDocumentosPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<any[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);

  // 🔥 NUEVO: total del carrito
  const [total, setTotal] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  /* ------------------- FETCH DOCUMENT TYPES ------------------- */

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_REACT_APP_BACKEND ||
          "https://gobdocs-backend.up.railway.app";

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/document-type`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        const data = await response.json();

        if (Array.isArray(data)) setDocuments(data);
        else if (data.data) setDocuments(data.data);
      } catch (error) {
        console.error("Error fetching document types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  /* ------------------- LOAD CART ------------------- */

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("gobdocs_cart") || "[]");
    setCart(storedCart);
  }, [location.key]);

  /* ------------------- 🔥 CALCULAR TOTAL ------------------- */

  useEffect(() => {
    let totalCalculado = 0;

    cart.forEach((item) => {
      if (item.tarifas) {
        totalCalculado += item.tarifas.reduce(
          (acc: number, t: any) =>
            acc + Number(t.Costo_Por_Servicio || 0),
          0
        );
      }
    });

    setTotal(totalCalculado);
  }, [cart]);

  const filteredDocuments = documents.filter((doc) =>
    doc?.Nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const clearCart = () => {
    localStorage.removeItem("gobdocs_cart");
    setCart([]);
    setShowCartModal(false);
  };

  const submitCartSolicitud = async () => {
    const API_URL =
      import.meta.env.VITE_REACT_APP_BACKEND ||
      "https://gobdocs-backend.up.railway.app";
    const token = localStorage.getItem("token");

    if (!cart.length) {
      alert("No hay solicitudes en el carrito");
      return;
    }

    const body = {
      solicitudes: cart.map((item: any) => ({
        Formulario_ID: item.Formulario_ID,
        respuestas: item.respuestas,
        detalles: item.detalles || []
      }))
    };

    try {
      const res = await fetch(`${API_URL}/solicitudes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      const numeroSolicitud = Array.isArray(data)
        ? data[0]?.Numero_Solicitud
        : data?.Numero_Solicitud;

      localStorage.removeItem("gobdocs_cart");
      setCart([]);
      setShowCartModal(false);

      navigate(`/portal/pago/${numeroSolicitud}`);
    } catch (error) {
      console.error(error);
      alert("Error creando la solicitud");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full h-full min-h-[85vh]">

        {/* HEADER */}
        <div className="bg-gobdocs-primary w-full py-16 flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">
            Elige los documentos a solicitar
          </h1>

          <div className="relative w-full max-w-2xl px-4">
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full outline-none text-gray-700 shadow-sm bg-white font-medium"
              placeholder="Buscar documento"
            />
          </div>
        </div>

        {/* DOCUMENT CAROUSEL */}
        <div className="flex-1 w-full bg-white relative py-16 overflow-hidden">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative">

            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-8 snap-x snap-mandatory px-8 md:px-16 lg:px-24 hide-scrollbar justify-start py-4"
            >
              {loading ? (
                <p className="text-gray-500 text-lg w-full text-center mt-8">
                  Cargando documentos...
                </p>
              ) : (
                filteredDocuments.map((doc) => (
                  <div
                    key={doc.TipoDocumento_ID}
                    className="min-w-[280px] w-[280px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden flex-shrink-0 snap-center border border-gray-100 flex flex-col"
                  >
                    <div className="bg-gray-100 h-36 w-full flex items-center justify-center overflow-hidden">
                      <ImageIcon className="text-white w-10 h-10" />
                    </div>

                    <div className="p-6 flex flex-col items-center flex-1 justify-between gap-6">
                      <h3 className="text-[#0f3a61] font-bold text-lg text-center mt-2">
                        {doc.Nombre}
                      </h3>

                      <button
                        onClick={() =>
                          navigate(`/portal/crear-solicitud/${doc.TipoDocumento_ID}`)
                        }
                        className="w-full bg-white text-[#0f3a61] border-2 border-[#0f3a61] py-2 px-4 rounded-xl font-semibold hover:bg-[#0f3a61] hover:text-white transition-all duration-300"
                      >
                        Solicitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CART FLOATING */}
      <div className="fixed bottom-8 right-24 z-50 flex flex-col items-center gap-3">
        <button
          onClick={() => setShowCartModal(true)}
          className="relative bg-white text-gobdocs-primary p-4 rounded-full shadow-2xl hover:scale-110 transition-all border-2 border-blue-50"
        >
          <ShoppingCart size={28} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[24px] text-center">
            {cart.length}
          </span>
        </button>

        <button
          onClick={clearCart}
          className="bg-white text-gobdocs-primary border border-gray-200 px-4 py-2 rounded-xl shadow-md text-sm font-semibold hover:bg-gray-50 transition"
        >
          Limpiar carrito
        </button>
      </div>

      {/* MODAL */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[500px]">

            <h2 className="text-xl font-bold text-gobdocs-primary mb-6">
              Documentos en la solicitud
            </h2>

            <div className="space-y-3">
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    Documento #{index + 1}
                  </div>
                ))
              ) : (
                <div className="border rounded-lg p-4 text-center text-gray-500">
                  El carrito está vacío
                </div>
              )}
            </div>

            {/* 🔥 TOTAL AGREGADO */}
            <div className="mt-6 text-lg font-bold text-gobdocs-primary">
              Total a pagar: RD$ {total}
            </div>

            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Limpiar carrito
              </button>

              <button
                onClick={() => setShowCartModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cerrar
              </button>

              <button
                onClick={submitCartSolicitud}
                disabled={!cart.length}
                className="bg-gobdocs-primary text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                Terminar solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};