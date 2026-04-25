import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

import { AuthLayout } from '../../shared/layouts/AuthLayout';
import LoginGradientVector from '../../assets/Login/LoginGradientVector.png';
import LoginGradientVector2 from '../../assets/Login/LoginGradientVector2.png';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';

export const OlvideContrasenaPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND || 'https://gobdocs-backend.up.railway.app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.warning('Por favor, ingresa tu correo electrónico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEnviado(true);
        toast.success('¡Correo enviado! Revisa tu bandeja de entrada.');
      } else {
        // Mostrar éxito de todas formas por seguridad (no revelar si el email existe)
        setEnviado(true);
        toast.success('Si el correo está registrado, recibirás un enlace de recuperación.');
      }
    } catch (error) {
      // Mostrar éxito de todas formas por seguridad
      setEnviado(true);
      toast.success('Si el correo está registrado, recibirás un enlace de recuperación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      decoration={
        <>
          <img
            src={LoginGradientVector}
            alt="Login gradient"
            className="absolute left-[85%] -translate-x-1/2 top-[3rem] w-70 opacity-95 pointer-events-none -z-10"
          />
          <img
            src={LoginGradientVector2}
            alt="Login gradient 2"
            className="absolute left-[20%] -translate-x-1/2 top-[20rem] w-70 opacity-95 pointer-events-none -z-10"
          />
        </>
      }
    >
      {/* Encabezado con flecha de regreso */}
      <div className="relative flex items-center justify-center mb-8">
        <Link
          to="/auth/login"
          className="absolute left-0 p-2 text-gobdocs-primary hover:bg-blue-50 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <h2 className="text-2xl font-bold text-gobdocs-primary">
          Recuperar contraseña
        </h2>
      </div>

      {!enviado ? (
        <>
          <p className="text-gray-500 text-sm text-center mb-8">
            Ingresa el correo electrónico asociado a tu cuenta y te enviaremos
            un enlace para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl md:max-w-4xl">
            <Input
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />

            <div className="pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Recuperar contraseña'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/auth/login" className="text-sm text-gray-500 hover:text-gobdocs-primary underline">
              Volver a iniciar sesión
            </Link>
          </div>
        </>
      ) : (
        /* Estado de éxito */
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">✉️</span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gobdocs-primary mb-2">
              ¡Correo enviado!
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Si el correo <strong>{email}</strong> está registrado en nuestra plataforma,
              recibirás un enlace para restablecer tu contraseña. Revisa también tu carpeta de spam.
            </p>
          </div>

          <div className="pt-4">
            <Link to="/auth/login">
              <Button>
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
