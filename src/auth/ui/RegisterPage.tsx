import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 

// Importamos el AuthLayout, las imágenes y tus componentes de UI
import { AuthLayout } from '../../shared/layouts/AuthLayout';
import LoginGradientVector from '../../assets/Login/LoginGradientVector.png';
import LoginGradientVector2 from '../../assets/Login/LoginGradientVector2.png';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. Estados para los campos del formulario de Ciudadano
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Variable de entorno para tu backend
  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND || 'https://gobdocs-backend.up.railway.app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDACIONES FRONTEND ---
    if (!nombre || !apellido || !cedula || !email || !password || !confirmPassword) {
      toast.warning('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden. Inténtalo de nuevo.');
      return;
    }

    if (password.length < 6) {
      toast.warning('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    // --- INTEGRACIÓN CON EL BACKEND ---
    try {
      const response = await fetch(`${API_URL}/usuarios/registro-ciudadano`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          cedula: cedula,
          email: email,
          password: password,
        }),
      });

      // Parseamos la respuesta
      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('El servidor no devolvió un formato válido.');
      }

      if (response.ok) {
        toast.success('¡Registro exitoso! Por favor, inicia sesión.');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        toast.error(data.detail || data.message || 'Ocurrió un error al crear la cuenta.');
      }

    } catch (error) {
      console.error('Error en registro:', error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crear Cuenta en GobDocs RD"
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
        <h2 className="text-2xl font-semibold text-gobdocs-primary">Crear Cuenta</h2>
        <p className="text-gray-500 text-sm mt-1">
          Únete a GobDocs RD para gestionar tus documentos
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* Usamos un grid para poner Nombre y Apellido en la misma línea y ahorrar espacio */}
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Nombre" 
            placeholder="Juan" 
            type="text"
            value={nombre}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
          />
          <Input 
            label="Apellido" 
            placeholder="Pérez" 
            type="text"
            value={apellido}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApellido(e.target.value)}
          />
        </div>

        <Input 
          label="Cédula" 
          placeholder="001-1234567-8" 
          type="text"
          value={cedula}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCedula(e.target.value)}
        />

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

        <Input 
          label="Confirmar Contraseña" 
          placeholder="••••••••" 
          type="password"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
        />

        <div className="mt-8">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </div>

        <div className="mt-6 text-center">
            <Link to="/auth/login" className="text-sm text-gray-500 hover:text-gobdocs-primary underline">
                ¿Ya tienes cuenta? Inicia sesión
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
};