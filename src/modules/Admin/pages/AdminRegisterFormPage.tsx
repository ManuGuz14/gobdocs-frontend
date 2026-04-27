import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

export const AdminRegisterFormPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND || 'https://gobdocs-backend.up.railway.app';
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Por favor, coloque un correo electrónico.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/usuarios/invitar-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'Error al enviar el correo');
      }

      toast.success('Correo enviado exitosamente');
      navigate('/admin/adminregister');
    } catch (error: any) {
      toast.error(error.message || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout showBackButton>
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50/50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-center text-[#1a2b5e] mb-6">
            Creación Admin
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Coloque el correo aquí"
              placeholder="ejemplo@correo.com"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
