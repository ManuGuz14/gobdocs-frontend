import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between bg-white overflow-hidden">
      
      {/* Decoración: Puntos Naranjas (Esquina superior derecha) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(#d94032_1px,transparent_1px)] [background-size:16px_16px] opacity-60 translate-x-1/3 -translate-y-1/3 rounded-full" />
      
      {/* Decoración: Puntos Azules (Esquina inferior izquierda) */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(#1a2b5e_1px,transparent_1px)] [background-size:20px_20px] opacity-60 -translate-x-1/3 translate-y-1/3 rounded-full" />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-4">
        
        {/* Título Principal fuera de la tarjeta */}
        <h1 className="text-3xl md:text-4xl font-bold text-gobdocs-primary mb-8 text-center">
          {title}
        </h1>

        {/* Tarjeta Blanca (Card) */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
          {children}
        </div>
      </div>

      {/* Footer Institucional */}
      <footer className="bg-gobdocs-primary text-white py-4 px-8 text-xs flex justify-between items-center z-10">
        <span>GobDocs RD @ 2026</span>
        <div className="flex gap-6">
            <span>administracion@gobdocs.com</span>
            <span>809-785-9999</span>
        </div>
      </footer>
    </div>
  );
};