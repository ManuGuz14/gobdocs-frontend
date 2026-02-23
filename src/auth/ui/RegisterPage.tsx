import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 

export const RegisterPage = () => {
  const navigate = useNavigate();

  // Estado único para el formulario (más limpio)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND || 'https://gobdocs-backend.up.railway.app';

  // Manejador de cambios genérico
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Detiene el refresco de inmediato

    const { nombre, apellido, cedula, email, password, confirmPassword } = formData;

    // 1. VALIDACIÓN: Campos vacíos
    if (Object.values(formData).some(field => field.trim() === '')) {
      toast.warning('Todos los campos son obligatorios.');
      return;
    }

    // 2. VALIDACIÓN: Formato de Email (Básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // 3. VALIDACIÓN: Coincidencia de contraseñas
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    // 4. VALIDACIÓN: Longitud mínima
    if (password.length < 6) {
      toast.warning('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true); // Bloquear botón para evitar múltiples clics

    try {
      const response = await fetch(`${API_URL}/usuarios/registro-ciudadano`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          cedula,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => navigate('/auth/login'), 2000);
      } else {
        // Muestra el error específico del backend si existe
        toast.error(data.detail || data.message || 'Error en el registro.');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      toast.error('No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false); // Desbloquear botón
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-[#1a2b5e] mb-8">Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Juan" />
            <InputField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Pérez" />
          </div>

          <InputField label="Cédula" name="cedula" value={formData.cedula} onChange={handleChange} placeholder="001-1234567-8" />
          <InputField label="Correo electrónico" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ejemplo@correo.com" />
          <InputField label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          <InputField label="Confirmar Contraseña" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-xl font-semibold transition-colors mt-6 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a2b5e] hover:bg-blue-900'
            }`}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          ¿Ya tienes cuenta? <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

// Componente auxiliar para evitar repetir código de inputs
const InputField = ({ label, name, type = "text", value, onChange, placeholder }: any) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input 
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      required
    />
  </div>
);