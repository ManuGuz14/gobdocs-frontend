import React from 'react';
import { X, MoreHorizontal, Send, Sparkles, User } from 'lucide-react';

interface ChatWidgetProps {
  onClose: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  return (
    <div className="fixed bottom-24 right-4 md:right-8 w-full md:w-[450px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[60] border border-gray-200 animate-in fade-in slide-in-from-bottom-10 duration-300">
      
      {/* --- HEADER --- */}
      <div className="bg-gobdocs-primary text-white p-4 flex justify-between items-center shadow-md">
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <X size={20} />
        </button>
        <span className="font-bold tracking-wide">CHAT</span>
        <button className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* --- BODY (Mensajes) --- */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-6">
        
        {/* MENSAJE BOT (Izquierda) */}
        <div className="flex gap-3 items-start">
          <div className="mt-1 text-gobdocs-primary">
            <Sparkles size={24} fill="#1a2b5e" /> {/* Icono de estrellita */}
          </div>
          <div className="bg-gobdocs-primary text-white p-4 rounded-r-2xl rounded-bl-2xl max-w-[85%] shadow-sm">
            <p className="text-sm">
              Hola usuario, selecciona una opcion para asistirte
            </p>
          </div>
        </div>

        {/* LISTA DE OPCIONES (Izquierda) */}
        <div className="pl-9 w-full max-w-[85%]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {['Opcion 1', 'Opcion 1', 'Opcion 1', 'Opcion 1', 'Opcion 1'].map((op, index) => (
              <button 
                key={index}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        {/* MENSAJE USUARIO (Derecha) */}
        <div className="flex gap-3 items-end justify-end">
           <div className="bg-gobdocs-primary text-white p-3 rounded-l-2xl rounded-tr-2xl max-w-[80%] shadow-sm">
            <p className="text-sm">Opcion 1</p>
          </div>
          <div className="mb-1 text-gobdocs-primary">
            <User size={24} />
          </div>
        </div>

      </div>

      {/* --- FOOTER (Input) --- */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Escribe algo aqui" 
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