import React, { useState, useRef, useEffect } from 'react';
import { X, MoreHorizontal, Send, Sparkles, User } from 'lucide-react';
import { LoadingScreen } from './LoadingScreen';

interface ChatWidgetProps {
  onClose: () => void;
}

const MAIN_OPTIONS = [
  'Solicitar documento',
  'Visualizar documento',
  'Visualizar solicitud',
];

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {

  const API_URL =
    import.meta.env.VITE_REACT_APP_BACKEND ||
    "https://gobdocs-backend.up.railway.app";

  const token = localStorage.getItem("token");

  const [selectedMainOption, setSelectedMainOption] = useState<string | null>(null);
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);

  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<any | null>(null);

  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);

  const [formFields, setFormFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [formularioId, setFormularioId] = useState<string | null>(null);

  const [tarifas, setTarifas] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [showConfirm, setShowConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [
    selectedMainOption,
    selectedInstitution,
    selectedDocument,
    formData,
    showConfirm
  ]);

  // 🔥 FETCH INSTITUTIONS
  useEffect(() => {
    if (selectedMainOption === 'Solicitar documento') {
      fetch(`${API_URL}/institution`)
        .then(res => res.json())
        .then(data => setInstitutions(data))
        .catch(() => setInstitutions([]));
    }
  }, [selectedMainOption]);

  const handleMainOptionClick = (option: string) => {
    setSelectedMainOption(option);

    if (option === 'Visualizar documento') {
      setLoadingTarget('/portal/documentos');
      return;
    }

    if (option === 'Visualizar solicitud') {
      setLoadingTarget('/portal/solicitudes');
      return;
    }
  };

  // 🔥 SELECT INSTITUTION
  const handleInstitutionSelect = async (inst: any) => {
    setSelectedInstitution(inst);

    const res = await fetch(`${API_URL}/document-type`);
    const data = await res.json();

    const filtered = data.filter(
      (d: any) => d.Institucion_ID === inst.Institucion_ID
    );

    setDocuments(filtered);
  };

  // 🔥 SELECT DOCUMENT
  const handleDocumentSelect = async (doc: any) => {
    setSelectedDocument(doc);

    // FORM
    const formRes = await fetch(
      `${API_URL}/formularios/tipo-documento/${doc.TipoDocumento_ID}`
    );
    const formJson = await formRes.json();

    setFormFields(formJson.Form_Definition?.campos || []);
    setFormularioId(formJson.Formulario_ID);

    // TARIFAS
    const tarifasRes = await fetch(
      `${API_URL}/tarifarios/tipo-documento/${doc.TipoDocumento_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tarifasJson = await tarifasRes.json();

    setTarifas(tarifasJson || []);

    const totalCalculado = (tarifasJson || []).reduce(
      (acc: number, t: any) => acc + Number(t.Costo_Por_Servicio),
      0
    );

    setTotal(totalCalculado);
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔥 CREATE SOLICITUD
  const handleConfirm = async () => {
    const res = await fetch(`${API_URL}/solicitudes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        solicitudes: [
          {
            Formulario_ID: formularioId,
            respuestas: formData,
            detalles: tarifas.map((t) => ({
              tarifarioId: t.Tarifario_Codigo,
              cantidad: 1,
            })),
          },
        ],
      }),
    });

    const data = await res.json();

    const numeroSolicitud = data?.[0]?.Numero_Solicitud;

    setLoadingTarget(`/portal/pago/${numeroSolicitud}`);
  };

  if (loadingTarget) {
    return (
      <LoadingScreen
        targetRoute={loadingTarget}
        onComplete={() => {
          setLoadingTarget(null);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed bottom-24 right-4 md:right-8 w-full md:w-[450px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[60] border border-gray-200 animate-in fade-in slide-in-from-bottom-10 duration-300">

      {/* HEADER */}
      <div className="bg-gobdocs-primary text-white p-4 flex justify-between items-center shadow-md">
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full">
          <X size={20} />
        </button>
        <span className="font-bold tracking-wide">CHAT</span>
        <button className="hover:bg-white/20 p-1 rounded-full">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-6">

        {/* BOT */}
        <div className="flex gap-3 items-start">
          <div className="mt-1 text-gobdocs-primary">
            <Sparkles size={24} fill="#1a2b5e" />
          </div>
          <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl max-w-[85%] shadow-sm">
            Hola usuario, selecciona una opción para asistirte
          </div>
        </div>

        {/* MAIN OPTIONS */}
        <div className="pl-9 w-full max-w-[85%]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {MAIN_OPTIONS.map((op, index) => (
              <button
                key={index}
                onClick={() => handleMainOptionClick(op)}
                className="w-full text-left px-4 py-3 text-sm border-b last:border-0"
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        {/* USER MAIN */}
        {selectedMainOption && (
          <div className="flex justify-end">
            <div className="bg-gobdocs-primary text-white p-3 rounded-l-2xl rounded-tr-2xl">
              {selectedMainOption}
            </div>
          </div>
        )}

        {/* INSTITUTIONS */}
        {selectedMainOption === 'Solicitar documento' && !selectedInstitution && (
          <>
            <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl">
              Selecciona una institución
            </div>

            <div className="pl-9">
              {institutions.map((inst) => (
                <button
                  key={inst.Institucion_ID}
                  onClick={() => handleInstitutionSelect(inst)}
                  className="block w-full text-left p-3 border-b"
                >
                  {inst.Nombre}
                </button>
              ))}
            </div>
          </>
        )}

        {/* DOCUMENTS */}
        {selectedInstitution && !selectedDocument && (
          <>
            <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl">
              Selecciona el documento
            </div>

            <div className="pl-9">
              {documents.map((doc) => (
                <button
                  key={doc.TipoDocumento_ID}
                  onClick={() => handleDocumentSelect(doc)}
                  className="block w-full text-left p-3 border-b"
                >
                  {doc.Nombre}
                </button>
              ))}
            </div>
          </>
        )}

        {/* FORM */}
        {selectedDocument && (
          <>
            <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl">
              Completa la información
            </div>

            <div className="pl-9 space-y-3">
              {formFields.map((field: any, i: number) => (
                <input
                  key={i}
                  placeholder={field.label}
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                />
              ))}
            </div>

            {/* 💰 MONTO */}
            {total > 0 && (
              <div className="flex gap-3 items-start">
                <div className="mt-1 text-gobdocs-primary">
                  <Sparkles size={24} fill="#1a2b5e" />
                </div>
                <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl max-w-[85%] shadow-sm">
                  El costo total es: <strong>RD$ {total}</strong>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowConfirm(true)}
              className="bg-gobdocs-primary text-white p-3 rounded-xl mt-3"
            >
              Confirmar solicitud
            </button>
          </>
        )}

        {/* CONFIRM */}
        {showConfirm && (
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white p-3 rounded-xl"
          >
            Ir a pagar
          </button>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Escribe algo aquí"
            className="w-full border border-gray-300 rounded-full py-3 px-5 pr-12 text-sm"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2">
            <Send size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};