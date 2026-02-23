import React, { useState, useRef, useEffect } from 'react';
import { X, MoreHorizontal, Send, Sparkles, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatWidgetProps {
  onClose: () => void;
}

const MAIN_OPTIONS = [
  'Solicitar documento',
  'Visualizar documento',
  'Visualizar solicitud',
];

const REQUEST_OPTIONS = [
  'Solicitar de la JCE',
  'Solicitar del Intrant',
  'Solicitar de la Procuraduría',
  'Solicitar de la DGII',
];

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const [selectedMainOption, setSelectedMainOption] = useState<string | null>(null);
  const [selectedRequestOption, setSelectedRequestOption] = useState<string | null>(null);

  // 👇 Ref para el auto-scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cada vez que cambia alguna selección, baja al final del chat
  useEffect(() => {
    scrollToBottom();
  }, [selectedMainOption, selectedRequestOption]);

  const handleMainOptionClick = (option: string) => {
    setSelectedMainOption(option);
    setSelectedRequestOption(null); // reset subopción cuando cambias la principal

    if (option === 'Visualizar documento') {
      navigate('/portal/documentos');
      onClose();
      return;
    }

    if (option === 'Visualizar solicitud') {
      navigate('/portal/solicitudes');
      onClose();
      return;
    }

    // Si es "Solicitar documento" no navegamos, solo mostramos el segundo menú
  };

  const handleRequestOptionClick = (option: string) => {
    setSelectedRequestOption(option);
    // Aquí en un futuro puedes hacer navigate a formularios específicos por institución
    // ej: navigate('/solicitudes/jce');
  };

  return (
    <div className="fixed bottom-24 right-4 md:right-8 w-full md:w-[450px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[60] border border-gray-200 animate-in fade-in slide-in-from-bottom-10 duration-300">
      
      {/* --- HEADER --- */}
      <div className="bg-gobdocs-primary text-white p-4 flex justify-between items-center shadow-md">
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        <span className="font-bold tracking-wide">CHAT</span>
        <button className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* --- BODY (Mensajes) --- */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-6">
        
        {/* MENSAJE BOT INICIAL */}
        <div className="flex gap-3 items-start">
          <div className="mt-1 text-gobdocs-primary">
            <Sparkles size={24} fill="#1a2b5e" />
          </div>
          <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl max-w-[85%] shadow-sm">
            <p className="text-sm">
              Hola usuario, selecciona una opción para asistirte
            </p>
          </div>
        </div>

        {/* LISTA DE OPCIONES PRINCIPALES */}
        <div className="pl-9 w-full max-w-[85%]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {MAIN_OPTIONS.map((op, index) => (
              <button 
                key={index}
                type="button"
                onClick={() => handleMainOptionClick(op)}
                className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-0 transition-colors
                  ${
                    selectedMainOption === op
                      ? 'bg-gobdocs-primary text-white'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        {/* MENSAJE DEL USUARIO CON LA OPCIÓN PRINCIPAL SELECCIONADA */}
        {selectedMainOption && (
          <div className="flex gap-3 items-end justify-end">
            <div className="bg-gobdocs-primary text-white p-3 rounded-l-2xl rounded-tr-2xl max-w-[80%] shadow-sm">
              <p className="text-sm">{selectedMainOption}</p>
            </div>
            <div className="mb-1 text-gobdocs-primary">
              <User size={24} />
            </div>
          </div>
        )}

        {/* SI ELIGE "SOLICITAR DOCUMENTO", SEGUNDO MENSAJE + LISTA DE INSTITUCIONES */}
        {selectedMainOption === 'Solicitar documento' && (
          <>
            {/* Mensaje bot secundario */}
            <div className="flex gap-3 items-start">
              <div className="mt-1 text-gobdocs-primary">
                <Sparkles size={24} fill="#1a2b5e" />
              </div>
              <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl max-w-[85%] shadow-sm">
                <p className="text-sm">
                  Perfecto, ¿desde cuál institución deseas solicitar tu documento?
                </p>
              </div>
            </div>

            {/* Lista de instituciones */}
            <div className="pl-9 w-full max-w-[85%]">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {REQUEST_OPTIONS.map((op, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRequestOptionClick(op)}
                    className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-0 transition-colors
                      ${
                        selectedRequestOption === op
                          ? 'bg-gobdocs-primary text-white'
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            {/* Mensaje del usuario con la institución seleccionada */}
            {selectedRequestOption && (
              <div className="flex gap-3 items-end justify-end">
                <div className="bg-gobdocs-primary text-white p-3 rounded-l-2xl rounded-tr-2xl max-w-[80%] shadow-sm">
                  <p className="text-sm">{selectedRequestOption}</p>
                </div>
                <div className="mb-1 text-gobdocs-primary">
                  <User size={24} />
                </div>
              </div>
            )}
          </>
        )}

        {/* 👇 Ancla para el scroll automático */}
        <div ref={messagesEndRef} />
      </div>

      {/* --- FOOTER (Input) --- */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Escribe algo aquí" 
            className="w-full border border-gray-300 rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:border-gobdocs-primary focus:ring-1 focus:ring-gobdocs-primary transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gobdocs-primary hover:bg-blue-50 rounded-full transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};