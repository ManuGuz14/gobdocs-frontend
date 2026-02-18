import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

export const RegisterPage = () => {
  return (
    // Pasamos title vacío para que no salga el texto grande afuera, ya que tu diseño lo tiene adentro
    <AuthLayout title="">
      
      {/* Encabezado de la Tarjeta (Flecha + Título) */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Botón de regreso (absoluto a la izquierda) */}
        <Link 
          to="/auth/login" 
          className="absolute left-0 p-2 text-gobdocs-primary hover:bg-blue-50 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        
        {/* Título Centrado */}
        <h2 className="text-2xl font-bold text-gobdocs-primary">
          Crea tu cuenta
        </h2>
      </div>

      {/* Formulario */}
      <form className="space-y-2">
        <Input 
          label="Nombres" 
          placeholder="Ej. Juan" 
        />
        
        <Input 
          label="Apellidos" 
          placeholder="Ej. Pérez" 
        />
        
        <Input 
          label="Cédula" 
          placeholder="001-0000000-0" 
        />
        
        <Input 
          label="Correo electrónico" 
          type="email" 
          placeholder="juan@ejemplo.com" 
        />
        
        <Input 
          label="Contraseña" 
          type="password" 
          placeholder="••••••••" 
        />

        {/* Espacio adicional antes del botón */}
        <div className="pt-4">
          <Button type="submit">
            Crear Cuenta
          </Button>
        </div>
      </form>

    </AuthLayout>
  );
};