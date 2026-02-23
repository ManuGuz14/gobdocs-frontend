import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import LoginGradientVector from '../../../assets/Login/LoginGradientVector.png';
import LoginGradientVector2 from '../../../assets/Login/LoginGradientVector2.png';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

export const LoginPage = () => {
  const navigate = useNavigate();

  // 1. Estados para los inputs y carga
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. URL del Backend
  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND || 'https://gobdocs-backend.up.railway.app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDACIONES ---
    if (!email || !password) {
      toast.warning('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setIsLoading(true);

    // --- INTEGRACIÓN CON EL BACKEND ---
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Guardar el token de seguridad y los datos del usuario en el navegador
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // 4. Mensaje de éxito personalizado con el nombre del usuario (según tu Postman)
        toast.success(`¡Bienvenido de nuevo, ${data.user.nombre}!`);

        // Redirección al portal
        setTimeout(() => {
          navigate('/portal');
        }, 1500);

      } else {
        toast.error(data.detail || data.message || 'Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido a GobDocs RD"
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gobdocs-primary">Inicio de sesión</h2>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenido a GobDocs RD, tus documentos a un clic
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* 5. Conectamos los Inputs a nuestros estados */}
        <Input 
          label="Correo electrónico" 
          placeholder="ejemplo@correo.com" 
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        
        <Input 
          label="Contraseña" 
          placeholder="••••••••" 
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        <div className="flex justify-start mb-6">
          <a href="#" className="text-xs text-gray-500 hover:text-gobdocs-primary underline">
            He olvidado mi contraseña
          </a>
        </div>

        {/* 6. Deshabilitar el botón mientras carga */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
        </Button>

        <div className="mt-6 text-center">
            <Link to="/auth/register" className="text-sm text-gray-500 hover:text-gobdocs-primary underline">
                Crea una cuenta nueva aquí
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
};