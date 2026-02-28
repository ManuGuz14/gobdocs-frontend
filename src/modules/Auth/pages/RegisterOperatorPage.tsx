import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Importamos el AuthLayout, las imágenes y tus componentes de UI
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import LoginGradientVector from '../../../assets/Login/LoginGradientVector.png';
import LoginGradientVector2 from '../../../assets/Login/LoginGradientVector2.png';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

export const RegisterOperadorPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    password: '',
    confirmPassword: '',
    institucionId: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND || 'https://gobdocs-backend.up.railway.app';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { nombre, apellido, cedula, email, password, confirmPassword, institucionId } = formData;

    if (!nombre || !apellido || !cedula || !email || !password || !confirmPassword) {
      toast.warning('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      toast.warning('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/usuarios/registro-operador`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          cedula,
          email,
          password,
          ...(institucionId ? { institucionId } : {})
        }),
      });

      // Parseamos la respuesta con protección
      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('El servidor no devolvió un formato válido.');
      }

      if (response.ok) {
        toast.success('¡Registro de operador exitoso! Redirigiendo...');
        setTimeout(() => navigate('/auth/login'), 2000);
      } else {
        toast.error(data.detail || data.message || 'Error en el registro de operador.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error en registro:');
      toast.error(error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Portal Administrativo GobDocs"
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
        <h2 className="text-2xl font-semibold text-gobdocs-primary">Registro Operador</h2>
        <p className="text-gray-500 text-sm mt-1">
          Crea tu cuenta para acceder al panel administrativo
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            name="nombre"
            placeholder="Leonardo"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
          />
          <Input
            label="Apellido"
            name="apellido"
            placeholder="Perozo"
            type="text"
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cédula"
            name="cedula"
            placeholder="402-0880120-5"
            type="text"
            value={formData.cedula}
            onChange={handleChange}
          />
          <Input
            label="ID Institución"
            name="institucionId"
            placeholder="Opcional"
            type="text"
            value={formData.institucionId}
            onChange={handleChange}
            required={false}
          />
        </div>

        <Input
          label="Correo electrónico"
          name="email"
          placeholder="leonardo@testmail.com"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Contraseña"
          name="password"
          placeholder="••••••••"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <Input
          label="Confirmar Contraseña"
          name="confirmPassword"
          placeholder="••••••••"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <div className="mt-8">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar Operador'}
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