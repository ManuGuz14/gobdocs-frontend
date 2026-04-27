import React, { useState, useRef, useEffect } from 'react';
import { X, MoreHorizontal, Send, Sparkles, User, HelpCircle, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { LoadingScreen } from './LoadingScreen';
import { formatCedula } from '../utils/formatCedula';

interface ChatWidgetProps {
  onClose: () => void;
}

const MAIN_OPTIONS = [
  'Solicitar documento',
  'Visualizar documento',
  'Visualizar solicitud',
  'Preguntas frecuentes',
];

const FAQ_DATA = [
  {
    question: '¿Cómo solicito un documento?',
    answer: 'Puedes solicitar un documento desde la sección "Solicitar documentos" en el menú lateral, o directamente desde este chat seleccionando "Solicitar documento". Solo elige la institución, el tipo de documento, completa el formulario y procede al pago.',
  },
  {
    question: '¿Cuánto tiempo tarda mi solicitud?',
    answer: 'El tiempo de procesamiento varía según el tipo de documento. Generalmente las solicitudes se procesan entre 3 a 5 días hábiles. Puedes verificar el estado de tu solicitud en "Mis Solicitudes" en cualquier momento.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos pagos con tarjeta de crédito y débito (Visa, Mastercard) a través de nuestra plataforma segura de pagos con Stripe.',
  },
  {
    question: '¿Puedo cancelar una solicitud?',
    answer: 'Una vez realizada la solicitud y completado el pago, no es posible cancelarla directamente desde la plataforma. Te recomendamos contactar a la institución correspondiente para gestionar la cancelación.',
  },
  {
    question: '¿Dónde veo mis documentos emitidos?',
    answer: 'Puedes ver y descargar todos tus documentos emitidos desde la sección "Mis Documentos" en el menú lateral del portal.',
  },
  {
    question: '¿Qué hago si olvidé mi contraseña?',
    answer: 'En la pantalla de inicio de sesión encontrarás el enlace "He olvidado mi contraseña". Sigue las instrucciones para restablecer tu contraseña de forma segura.',
  },
  {
    question: '¿Puedo solicitar el mismo documento dos veces?',
    answer: 'No puedes tener dos solicitudes vigentes del mismo tipo de documento. Debes esperar a que tu solicitud actual sea procesada (aprobada o rechazada) antes de crear una nueva.',
  },
  {
    question: '¿Es segura la plataforma?',
    answer: 'Sí, GobDocs RD utiliza encriptación de datos y procesamiento de pagos seguro con Stripe. Tu información personal está protegida con los más altos estándares de seguridad.',
  },
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
  const [activeSolicitudIds, setActiveSolicitudIds] = useState<Set<number>>(new Set());

  // FAQ state
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

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
    showConfirm,
    selectedFaq
  ]);

  // 🔥 FETCH INSTITUTIONS + SOLICITUDES ACTIVAS
  useEffect(() => {
    if (selectedMainOption === 'Solicitar documento') {
      fetch(`${API_URL}/institution`)
        .then(res => res.json())
        .then(data => setInstitutions(data))
        .catch(() => setInstitutions([]));

      // Fetch solicitudes activas para detectar duplicados
      if (token) {
        fetch(`${API_URL}/solicitudes/mis-solicitudes`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            const solicitudes = Array.isArray(data) ? data : data.solicitudes || [];
            const estadosFinalizados = ['RECHAZADA', 'CANCELADA'];
            const ids = new Set<number>();

            for (const sol of solicitudes) {
              const estado = (sol.Estado || '').toUpperCase();
              if (estadosFinalizados.includes(estado)) continue;

              const tipoDocId =
                sol.TipoDocumento_ID ||
                sol.formulario?.TipoDocumento_ID ||
                sol.formulario?.tipoDocumento?.TipoDocumento_ID ||
                null;

              if (tipoDocId) ids.add(Number(tipoDocId));
            }

            setActiveSolicitudIds(ids);
          })
          .catch(() => {});
      }
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
    const isCedulaField = name.toLowerCase().includes("cedula") || name.toLowerCase().includes("cédula");
    setFormData((prev: any) => ({
      ...prev,
      [name]: isCedulaField ? formatCedula(value) : value,
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
              {documents.map((doc) => {
                const yaSolicitado = activeSolicitudIds.has(Number(doc.TipoDocumento_ID));

                return (
                  <button
                    key={doc.TipoDocumento_ID}
                    onClick={() => {
                      if (yaSolicitado) {
                        toast.info('Ya tienes una solicitud vigente para este documento. Revisa "Mis Solicitudes".');
                        return;
                      }
                      handleDocumentSelect(doc);
                    }}
                    className={`block w-full text-left p-3 border-b ${
                      yaSolicitado ? 'opacity-50 bg-amber-50' : ''
                    }`}
                  >
                    {doc.Nombre}
                    {yaSolicitado && (
                      <span className="ml-2 text-xs text-amber-600 font-semibold">⚠️ Ya solicitado</span>
                    )}
                  </button>
                );
              })}
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
              {formFields.map((field: any, i: number) => {
                const isCedulaField = (field.name || "").toLowerCase().includes("cedula") || (field.label || "").toLowerCase().includes("cédula");
                return (
                  <input
                    key={i}
                    placeholder={isCedulaField ? "000-0000000-0" : field.label}
                    className="w-full border p-2 rounded"
                    maxLength={isCedulaField ? 13 : undefined}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                  />
                );
              })}
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
              onClick={() => {
                const missing: string[] = [];
                for (const field of formFields) {
                  const value = formData[field.name];
                  if (!value || (typeof value === 'string' && value.trim() === '')) {
                    missing.push(field.label || field.name);
                  }
                }
                if (missing.length > 0) {
                  toast.warning(`Completa los siguientes campos: ${missing.join(', ')}`);
                  return;
                }
                setShowConfirm(true);
              }}
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

        {/* FAQ */}
        {selectedMainOption === 'Preguntas frecuentes' && (
          <>
            {/* Bot message */}
            <div className="flex gap-3 items-start">
              <div className="mt-1 text-gobdocs-primary">
                <Sparkles size={24} fill="#1a2b5e" />
              </div>
              <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl max-w-[85%] shadow-sm">
                Estas son las preguntas más frecuentes. Selecciona una para ver la respuesta.
              </div>
            </div>

            {/* FAQ List */}
            <div className="pl-9 w-full max-w-[90%]">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {FAQ_DATA.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                    className={`w-full text-left px-4 py-3 text-sm border-b last:border-0 flex items-center gap-2 transition-colors ${
                      selectedFaq === index
                        ? 'bg-blue-50 text-gobdocs-primary font-semibold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <HelpCircle size={14} className="flex-shrink-0 text-gobdocs-primary" />
                    <span className="flex-1">{faq.question}</span>
                    <ChevronRight
                      size={14}
                      className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                        selectedFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Selected FAQ Answer */}
            {selectedFaq !== null && (
              <>
                {/* User question bubble */}
                <div className="flex justify-end">
                  <div className="bg-gobdocs-primary text-white p-3 rounded-l-2xl rounded-tr-2xl max-w-[85%] text-sm">
                    {FAQ_DATA[selectedFaq].question}
                  </div>
                </div>

                {/* Bot answer bubble */}
                <div className="flex gap-3 items-start">
                  <div className="mt-1 text-gobdocs-primary">
                    <Sparkles size={24} fill="#1a2b5e" />
                  </div>
                  <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl max-w-[85%] shadow-sm text-sm leading-relaxed">
                    {FAQ_DATA[selectedFaq].answer}
                  </div>
                </div>
              </>
            )}
          </>
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