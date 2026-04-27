import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCedula } from '../../../shared/utils/formatCedula';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import LoginGradientVector from '../../../assets/Login/LoginGradientVector.png';
import LoginGradientVector2 from '../../../assets/Login/LoginGradientVector2.png';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

const GOBDOCS_ID = "a8f98d65-1c1c-490e-9cb1-9829777e5b60";

export const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: emailFromUrl,
    password: '',
    confirmPassword: '',
    institucionId: GOBDOCS_ID
  });

  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND || 'https://gobdocs-backend.up.railway.app';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'cedula' ? formatCedula(value) : value
    });
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, apellido, cedula, email, password, confirmPassword, institucionId } = formData;

    if (!nombre || !apellido || !cedula || !email || !password || !confirmPassword) {
      toast.warning('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/usuarios/registro-admin`, {
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

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('El servidor no devolvió un formato válido.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar administrador.');
      }

      toast.success('Admin registrado exitosamente');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <AuthLayout
      customBackground={
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
        <h2 className="text-2xl font-semibold text-gobdocs-primary">Registro de Admin</h2>
        <p className="text-gray-500 text-sm mt-1">
          Verifica los datos del nuevo administrador
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
            maxLength={13}
            value={formData.cedula}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Correo electrónico"
          name="email"
          placeholder="leonardo@admin.com"
          type="email"
          value={formData.email}
          onChange={handleChange}
          readOnly={!!emailFromUrl}
          style={emailFromUrl ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed' } : {}}
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
            {isLoading ? 'Registrando...' : 'Registrar Admin'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};
