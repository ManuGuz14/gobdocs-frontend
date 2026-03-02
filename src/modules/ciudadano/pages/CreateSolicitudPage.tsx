import { Trash2, Download } from 'lucide-react';
import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import Imagendefondo from '../../../assets/Solicitud/Geo-Background.png'; 

export const CreateSolicitudPage = () => {
  return (
    <DashboardLayout>
      {/* CONTENEDOR PRINCIPAL: Relative para controlar a los hijos absolutos */}
      <div className="relative min-h-[85vh] flex items-center justify-center p-4 overflow-hidden">
        
        {/* --- CAPA 0: IMAGEN DE FONDO --- 
            Quitamos el z-index negativo. Al estar primero en el código, se pinta primero (al fondo).
            'pointer-events-none' asegura que no estorbe a los clics.
        */}
        <div className="absolute bottom-0 right-0 w-[1000px] opacity-40 pointer-events-none">
          <img
            src={Imagendefondo}
            alt="Fondo decorativo"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* --- CAPA 10: CONTENIDO --- 
            'relative z-10' asegura que esto flote ENCIMA de la imagen.
        */}
        <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: Textos (Fondo transparente, la imagen se verá aquí) */}
          <div className="lg:col-span-5 space-y-10 pt-10">
            
            {/* Requisitos */}
            <div>
              <h2 className="text-3xl font-bold text-gobdocs-primary mb-6">Requisitos</h2>
              <ul className="space-y-4 text-gray-600 text-lg">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Cédula de identidad vigente</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Formulario completado</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Pago de impuestos al día</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Documentos legalizados</span>
                </li>
              </ul>
            </div>

            {/* Recomendaciones */}
            <div>
              <h2 className="text-3xl font-bold text-gobdocs-primary mb-6">Recomendaciones</h2>
              <ul className="space-y-4 text-gray-600 text-lg">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Escanear documentos a color</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Verificar la legibilidad</span>
                </li>
              </ul>
            </div>
          </div>

          {/* COLUMNA DERECHA: Tarjeta (Fondo blanco, TAPARÁ la imagen detrás de ella) */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 relative">
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gobdocs-primary mb-6">Formulario de solicitud</h3>
                <Input label="" placeholder="Tipo de Solicitud" />
                <Input label="" placeholder="Nombres" />
                <Input label="" placeholder="Apellidos" />
                <Input label="" placeholder="Cédula / Pasaporte" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gobdocs-primary mb-6">Carga de documentos</h3>
                
                <div className="border-2 border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center h-48 cursor-pointer hover:border-gobdocs-primary hover:bg-blue-50 transition-all bg-white">
                   <div className="mb-3 text-gobdocs-primary">
                     <Download size={32} />
                   </div>
                   <span className="text-gobdocs-primary font-medium">Subir documentos</span>
                   <span className="text-xs text-gray-400 mt-1">Click para explorar</span>
                </div>

                <button className="mt-4 w-full bg-[#d94032] text-white py-3 px-4 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                   <Trash2 size={18} />
                   Eliminar carga
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-12 pt-6 border-t border-gray-100">
               <div className="w-full md:w-48">
                  <Button>Proceder</Button>
               </div>
               <div className="w-full md:w-48">
                  <button className="w-full bg-[#d94032] text-white py-3 px-4 rounded-lg font-bold hover:bg-opacity-90 shadow-md">
                    Cancelar
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};