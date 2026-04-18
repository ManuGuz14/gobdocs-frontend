import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';
import { Button } from '../../../shared/ui/Button';
import { useEffect, useRef, useState } from 'react';

import tiguerepensando from '../../../assets/Landing/ManLookingAtDoc.png';
import tiguereholding from '../../../assets/Landing/ManWithFolder.png';

export const DashboardPage = () => {

  const section2Ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (section2Ref.current) {
      observer.observe(section2Ref.current);
    }

    return () => {
      if (section2Ref.current) {
        observer.unobserve(section2Ref.current);
      }
    };
  }, []);

  return (
    <DashboardLayout>

      {/* HERO */}
      <div className="bg-gradient-to-b from-gobdocs-primary to-gobdocs-secondaryblue -mx-6 md:-mx-8 px-6 md:px-16 pt-16 pb-0 text-gobdocs-bg relative overflow-hidden shadow-2xl mb-0 min-h-[500px] flex items-center">
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

        <div className="relative left-[7%] max-w-2xl pb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Solicita tus documentos <br />
            <span className="text-gobdocs-bg">más rápido que nunca</span>
          </h1>

          <p className="text-gobdocs-bg text-lg mb-10 leading-relaxed max-w-lg">
            Nuestra plataforma centraliza el proceso para que puedas gestionar tus solicitudes en línea.
          </p>

          <div className="w-64 shadow-lg shadow-blue-900/50">
            <Link to="/portal/solicitar">
              <Button style={{ backgroundColor: 'white', color: '#1a2b5e', borderRadius: '15px' }}>
                Solicita documentos aquí
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute right-[12%] bottom-0 h-[90%] w-[55%] hidden lg:block pointer-events-none">
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

      {/* SECCIÓN 2 */}
      <div
        ref={section2Ref}
        className="hidden lg:grid md:grid-cols-2 items-center bg-white -mx-6 md:-mx-8 min-h-[500px]"
      >

        {/* Imagen */}
        <div className="relative h-[500px] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[#1a2b5e]/10 z-10"></div>
          <img
            src={tiguereholding}
            alt="Consulta IA"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* 🔥 TEXTO CON FADE */}
        <div
          className={`p-12 md:p-16 transition-all duration-700 ease-out ${
            visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gobdocs-secondaryblue mb-6 leading-tight">
            Solicita tus documentos con nuestro <span className="text-gobdocs-secondaryblue">Chat IA</span>
          </h2>

          <p className="text-gobdocs-primary text-lg mb-10 leading-relaxed">
            Con nuestro chat inteligente, pedir documentos nunca fue tan fácil. Solo indícanos qué necesitas y el sistema te guiará paso a paso, resolviendo dudas, validando información y acelerando el trámite.
          </p>

          <div className="w-64">
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