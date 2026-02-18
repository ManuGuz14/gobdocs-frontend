import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';
import { Button } from '../../../shared/ui/Button';
import tiguerepensando from '../../../assets/TiguerePensando.png';
import tiguereholding from '../../../assets/TiguereHolding.png';

export const DashboardPage = () => {
  return (
    <DashboardLayout>
      
      {/* SECCIÓN 1: HERO (Banner Principal - AZUL) */}
      <div className="bg-[#1a2b5e] -mx-6 md:-mx-8 px-6 md:px-16 pt-16 pb-0 text-white relative overflow-hidden shadow-2xl mb-0 min-h-[500px] flex items-center">
        
        {/* Decoración Fondo */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

        <div className="relative z-10 max-w-2xl pb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Solicita tus documentos <br/>
            <span className="text-blue-300">más rápido que nunca</span>
          </h1>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-lg">
            Nuestra plataforma centraliza el proceso para que puedas gestionar tus solicitudes en línea.
          </p>
          
          <div className="w-64 shadow-lg shadow-blue-900/50">
            <Link to="/portal/solicitud">
                <Button style={{ backgroundColor: 'white', color: '#1a2b5e', borderRadius: '15px' }}>
                Solicita documentos aquí
                </Button>
            </Link>
          </div>
        </div>

        {/* IMAGEN DEL HOMBRE (TIGUERE PENSANDO) */}
        <div className="absolute right-0 bottom-0 h-[90%] w-[55%] hidden lg:block pointer-events-none">
            <img 
                src={tiguerepensando}
                alt="Ejecutivo"
                className="w-full h-full object-contain object-right-bottom" 
                style={{ 
                    maskImage: 'linear-gradient(to right, transparent 5%, black 40%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 5%, black 40%)' 
                }}
            />
        </div>
      </div>

      {/* SECCIÓN 2: CHAT IA (Banner Secundario - BLANCO) */}
      <div className="grid md:grid-cols-2 gap-0 items-center bg-white -mx-6 md:-mx-8 min-h-[500px]">
        
        {/* Imagen Izquierda */}
        <div className="relative h-[500px] group overflow-hidden">
            <div className="absolute inset-0 bg-[#1a2b5e]/10 group-hover:bg-transparent transition-colors z-10"></div>
            <img 
                src={tiguereholding}
                alt="Consulta IA"
                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
            />
        </div>
        
        {/* Texto Derecha */}
        <div className="p-12 md:p-16">
           <h2 className="text-3xl md:text-5xl font-bold text-[#1a2b5e] mb-6 leading-tight">
             Solicita tus documentos con nuestro <span className="text-blue-600">Chat IA</span>
           </h2>
           <p className="text-gray-600 text-lg mb-10 leading-relaxed">
             Con nuestro chat inteligente, pedir documentos nunca fue tan fácil. Solo indícanos qué necesitas y el sistema te guiará paso a paso, resolviendo dudas, validando información y acelerando el trámite.
           </p>
           
           <div className="w-64">
             {/* CAMBIO: Link que envuelve el botón para ir a /portal/documentos */}
             <Link to="/portal/documentos">
               <Button style={{ borderRadius: '15px' }}>
                 Ver tus documentos aqui
               </Button>
             </Link>
           </div>
        </div>
      </div>

    </DashboardLayout>
  );
};