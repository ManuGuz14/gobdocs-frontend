import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const carouselRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<any[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);

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
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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

    const storedCart = JSON.parse(
      localStorage.getItem("solicitudCarrito") || "[]"
    );

    setCart(storedCart);

  }, []);

  const filteredDocuments = documents.filter((doc) =>
    doc?.Nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const submitCartSolicitud = async () => {
    const API_URL = import.meta.env.VITE_REACT_APP_BACKEND || "https://gobdocs-backend.up.railway.app";
    const token = localStorage.getItem("token");

    if (!cart.length) {
      alert("No hay solicitudes en el carrito");
      return;
    }

    const body = {
      solicitudes: cart.map((item: any) => ({
        Formulario_ID: item.Formulario_ID,
        respuestas: item.formData
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

      if (!res.ok) throw new Error("Error en backend");

      localStorage.removeItem("solicitudCarrito");
      setCart([]);
      setShowCartModal(false);
      navigate("/portal/pago-exitoso");
    } catch (error) {
      console.error("❌ Error creando solicitud:", error);
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

            <button
              onClick={() => scroll("left")}
              className="absolute left-0 lg:left-8 top-1/2 -translate-y-1/2 z-10 p-2 text-gobdocs-primary hover:bg-blue-50 rounded-full transition-colors hidden md:block"
            >
              <ChevronLeft size={36} />
            </button>

            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-8 snap-x snap-mandatory px-8 md:px-16 lg:px-24 hide-scrollbar justify-start py-4"
            >

              {loading ? (

                <p className="text-gray-500 text-lg w-full text-center mt-8">
                  Cargando documentos...
                </p>

              ) : filteredDocuments.map((doc) => (

                <div
                  key={doc.TipoDocumento_ID}
                  className="min-w-[280px] w-[280px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden flex-shrink-0 snap-center border border-gray-100 flex flex-col"
                >

                  <div className="bg-gray-100 h-36 w-full flex items-center justify-center overflow-hidden">
                    {doc.Nombre?.toLowerCase().includes("cédula") || doc.Nombre?.toLowerCase().includes("cedula") ? (
                      <img src={Cedulaimage} alt="Cédula" className="w-full h-full object-cover" />
                    ) : doc.Nombre?.toLowerCase().includes("acta") ? (
                      <img src={Actadenac} alt="Acta" className="w-full h-full object-cover" />
                    ) : (
                      <div className="bg-[#0f3a61] h-full w-full flex items-center justify-center">
                        <ImageIcon className="text-white w-10 h-10" />
                      </div>
                    )}
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

              ))}

            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 lg:right-8 top-1/2 -translate-y-1/2 z-10 p-2 text-gobdocs-primary hover:bg-blue-50 rounded-full transition-colors hidden md:block"
            >
              <ChevronRight size={36} />
            </button>

          </div>

        </div>

      </div>

      {/* CART FLOATING BUTTON */}

      {cart.length > 0 && (

        <button
          onClick={() => setShowCartModal(true)}
          className="fixed bottom-8 right-24 bg-white text-gobdocs-primary p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 border-2 border-blue-50"
        >

          <ShoppingCart size={28} />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {cart.length}
          </span>

        </button>

      )}

      {/* CART MODAL */}

      {showCartModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl p-8 w-[500px]">

            <h2 className="text-xl font-bold text-gobdocs-primary mb-6">
              Documentos en la solicitud
            </h2>

            <div className="space-y-3">

              {cart.map((_, index) => (

                <div
                  key={index}
                  className="border rounded-lg p-3 flex justify-between"
                >
                  Documento #{index + 1}
                </div>

              ))}

            </div>

            <div className="flex justify-end mt-6 gap-4">

              <button
                onClick={() => setShowCartModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cerrar
              </button>

              <button
                onClick={submitCartSolicitud}
                className="bg-gobdocs-primary text-white px-6 py-2 rounded-lg"
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