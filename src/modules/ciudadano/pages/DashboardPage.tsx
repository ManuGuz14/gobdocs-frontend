import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../shared/layouts/DashboardLayout';
import { Button } from '../../../shared/ui/Button';
import { useEffect, useRef, useState } from 'react';

import tiguerepensando from '../../../assets/Landing/ManLookingAtDoc.png';
import tiguereholding from '../../../assets/Landing/ManWithFolder.png';

export const DashboardPage = () => {

  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  const createObserver = (key: string, ref: React.RefObject<HTMLDivElement>) => {
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [key]: true }));
          }
        },
        { threshold: 0.2 }
      );

      if (ref.current) observer.observe(ref.current);

      return () => {
        if (ref.current) observer.unobserve(ref.current);
      };
    }, []);
  };

  const beneficiosRef = useRef<HTMLDivElement>(null);
  const iaRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  createObserver('beneficios', beneficiosRef);
  createObserver('ia', iaRef);
  createObserver('steps', stepsRef);
  createObserver('cta', ctaRef);

  return (
    <DashboardLayout>

      {/* HERO */}
      <div className="relative -mx-6 md:-mx-8 px-6 md:px-16 pt-24 pb-20 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1c3f] via-[#1a2b5e] to-[#243a7a]"></div>
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-400/20 blur-[120px] rounded-full"></div>

        <div className="relative z-10 flex items-center min-h-[600px]">

          <div className="max-w-2xl">
            <p className="text-white/60 mb-4 tracking-wide text-sm uppercase">
              Plataforma digital • República Dominicana
            </p>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Tus documentos, <br />
              <span className="text-white/70">sin complicaciones</span>
            </h1>

            <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-xl">
              Gestiona solicitudes oficiales en minutos. Sin filas, sin papeleo,
              sin perder tiempo.
            </p>

            <div className="flex gap-4">
              <Link to="/portal/solicitar">
                <Button style={{ backgroundColor: 'white', color: '#1a2b5e', borderRadius: '999px', padding: '14px 28px' }}>
                  Empezar ahora
                </Button>
              </Link>

              <Link to="/portal/documentos">
                <Button style={{ borderRadius: '999px', padding: '14px 28px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
                  Ver documentos
                </Button>
              </Link>
            </div>
          </div>

          {/* 🔥 IMAGEN FULL SIZE CORREGIDA */}
          <div className="hidden lg:flex absolute right-0 bottom-0 h-full w-[75%] items-end justify-end">
            <img
              src={tiguerepensando}
              alt=""
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* BENEFICIOS */}
      <div
        ref={beneficiosRef}
        className={`bg-white py-24 px-6 md:px-16 transition-all duration-700 ${visibleSections.beneficios ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <h2 className="text-4xl font-bold text-center text-gobdocs-primary mb-16">
          Diseñado para simplificar todo
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            { title: 'Rápido', desc: 'Procesos optimizados para resultados en minutos.' },
            { title: 'Seguro', desc: 'Protección de datos con estándares modernos.' },
            { title: 'Digital', desc: 'Todo el proceso ocurre en línea.' }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-3xl border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <h3 className="text-xl font-semibold text-gobdocs-secondaryblue mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* IA */}
      <div
        ref={iaRef}
        className={`grid md:grid-cols-2 items-center bg-[#f9fafc] py-20 px-6 md:px-16 transition-all duration-700 ${visibleSections.ia ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-xl">
          <img src={tiguereholding} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="p-10">
          <h2 className="text-4xl font-bold text-gobdocs-primary mb-6">
            Asistencia inteligente
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Nuestro sistema te guía automáticamente para completar tu solicitud correctamente.
          </p>

          <Button
            onClick={() => window.dispatchEvent(new Event('open-chat'))}
            style={{ borderRadius: '999px', padding: '12px 26px' }}
          >
            Probar ahora
          </Button>
        </div>
      </div>

      {/* STEPS */}
      <div
        ref={stepsRef}
        className={`bg-white py-24 px-6 md:px-16 text-center transition-all duration-700 ${visibleSections.steps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <h2 className="text-4xl font-bold text-gobdocs-primary mb-16">
          Cómo funciona
        </h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            'Selecciona el documento',
            'Completa la solicitud',
            'Recibe tu documento'
          ].map((step, i) => (
            <div key={i}>
              <div className="text-5xl font-bold text-gobdocs-secondaryblue mb-4">
                {`0${i + 1}`}
              </div>
              <p className="text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        ref={ctaRef}
        className={`bg-[#0f1c3f] text-white text-center py-24 px-6 transition-all duration-700 ${visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Empieza hoy mismo
        </h2>

        <p className="text-white/60 mb-10">
          Todo lo que necesitas, en un solo lugar.
        </p>

        <Link to="/portal/solicitar">
          <Button style={{ backgroundColor: 'white', color: '#1a2b5e', borderRadius: '999px', padding: '14px 32px' }}>
            Solicitar documentos
          </Button>
        </Link>
      </div>

    </DashboardLayout>
  );
};