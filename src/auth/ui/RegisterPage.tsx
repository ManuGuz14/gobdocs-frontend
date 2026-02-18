import './RegisterPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    usuario: '',
    email: '',
    password: '',
    confirmar: '',
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('register', form);
  }

  return (
    <div className="register-page">
      <img src="/auth/dots.svg" alt="decor" className="decor-dots top-right" />
      <img src="/auth/blob1.svg" alt="decor" className="decor-blob left-bottom" />

      <header className="register-header">
        <h1>Bienvenido a GobDocs RD</h1>
      </header>

      <main className="register-main">
        <form className="register-card" onSubmit={handleSubmit}>
          <h2>Crear cuenta</h2>
          <p className="card-sub">Registra tus datos para empezar a solicitar documentos</p>

          <label className="field">
            <span className="label">Nombre completo</span>
            <input name="nombre" value={form.nombre} onChange={onChange} className="input" />
          </label>

          <label className="field">
            <span className="label">Usuario</span>
            <input name="usuario" value={form.usuario} onChange={onChange} className="input" />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input name="email" value={form.email} onChange={onChange} className="input" />
          </label>

          <label className="field">
            <span className="label">Contraseña</span>
            <input type="password" name="password" value={form.password} onChange={onChange} className="input" />
          </label>

          <label className="field">
            <span className="label">Confirmar contraseña</span>
            <input type="password" name="confirmar" value={form.confirmar} onChange={onChange} className="input" />
          </label>

          <button className="primary-btn" type="submit">Crear cuenta</button>

          <div className="muted-row">
            <span>¿Ya tienes cuenta?</span>
            <button type="button" className="link-btn" onClick={() => navigate('/login')}>Iniciar sesión</button>
          </div>
        </form>
      </main>

      <footer className="register-footer">
        <div className="footer-inner">
          <div>GobDocs RD @ 2025</div>
          <div>administracion@gobdocs.com</div>
          <div>809-785-9999</div>
        </div>
      </footer>
    </div>
  );
}
