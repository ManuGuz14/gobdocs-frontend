import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Lock } from 'lucide-react';

import { AuthLayout } from '../../shared/layouts/AuthLayout';
import LoginGradientVector from '../../assets/Login/LoginGradientVector.png';
import LoginGradientVector2 from '../../assets/Login/LoginGradientVector2.png';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // El token viene como query param: /reset-password?token=abc123
  const resetToken = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND || 'https://gobdocs-backend.up.railway.app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.warning('Por favor, completa ambos campos.');
      return;
    }

    if (password.length < 6) {
      toast.warning('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    if (!hasUpperCase || !hasSpecialChar) {
      toast.error('La contraseña debe contener al menos una letra mayúscula y un carácter especial.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if (!resetToken) {
      toast.error('Token de recuperación no válido. Solicita un nuevo enlace.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetToken,
          newPassword: password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        toast.success('¡Contraseña restablecida correctamente!');
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.detail || data.message || 'No se pudo restablecer la contraseña. El enlace puede haber expirado.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Restablecer Contraseña"
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
      {/* Encabezado */}
      <div className="relative flex items-center justify-center mb-8">
        <Link
          to="/auth/login"
          className="absolute left-0 p-2 text-gobdocs-primary hover:bg-blue-50 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <h2 className="text-2xl font-bold text-gobdocs-primary">
          Nueva contraseña
        </h2>
      </div>

      {!success ? (
        <>
          <p className="text-gray-500 text-sm text-center mb-8">
            Ingresa tu nueva contraseña. Asegúrate de que contenga al menos 6
            caracteres, una mayúscula y un carácter especial.
          </p>

          {!resetToken && (
            <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-center">
              <p className="text-amber-700 text-sm font-medium">
                ⚠️ No se detectó un token válido en el enlace.
                <br />
                <Link
                  to="/auth/olvide-contrasena"
                  className="underline text-amber-800 font-semibold"
                >
                  Solicita un nuevo enlace de recuperación
                </Link>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl md:max-w-4xl">
            <Input
              label="Nueva contraseña"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />

            <Input
              label="Confirmar contraseña"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            />

            {/* Password hints */}
            <div className="text-xs text-gray-400 space-y-1 pt-1">
              <p className={password.length >= 6 ? 'text-green-500' : ''}>
                {password.length >= 6 ? '✓' : '○'} Mínimo 6 caracteres
              </p>
              <p className={/[A-Z]/.test(password) ? 'text-green-500' : ''}>
                {/[A-Z]/.test(password) ? '✓' : '○'} Al menos una mayúscula
              </p>
              <p className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password) ? 'text-green-500' : ''}>
                {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password) ? '✓' : '○'} Al menos un carácter especial
              </p>
              <p className={password && confirmPassword && password === confirmPassword ? 'text-green-500' : ''}>
                {password && confirmPassword && password === confirmPassword ? '✓' : '○'} Las contraseñas coinciden
              </p>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading || !resetToken}>
                {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
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
            <Lock size={40} className="text-green-500" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gobdocs-primary mb-2">
              ¡Contraseña restablecida!
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar
              sesión con tu nueva contraseña.
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={() => navigate('/auth/login')}>
              Iniciar sesión
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
