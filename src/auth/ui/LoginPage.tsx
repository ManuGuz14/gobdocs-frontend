import './LoginPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // placeholder: perform login
    console.log('login', { user, password });
  }

  return (
    <div className="login-page">
      <img src="/auth/dots.svg" alt="decor" className="decor-dots top-left" />
      <img src="/auth/blob1.svg" alt="decor" className="decor-blob bottom-left" />

      <header className="login-header">
        <h1>Bienvenido a GobDocs RD</h1>
      </header>

      <main className="login-main">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Inicio de sesión</h2>
          <p className="card-sub">Bienvenido a GobDocs RD, tus documentos a un clic</p>

          <label className="field">
            <span className="label">Usuario</span>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder=""
              name="user"
              className="input"
            />
          </label>

          <label className="field">
            <span className="label">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              className="input"
            />
          </label>

          <a className="forgot-link" onClick={() => navigate('/login')}>He olvidado mi contraseña</a>

          <button className="primary-btn" type="submit">Iniciar Sesión</button>

          <a className="create-link" onClick={() => navigate('/registro')}>Crea una cuenta nueva aqui</a>
        </form>
      </main>

      <footer className="login-footer">
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <div>GobDocs RD @ 2025</div>
          <div>administracion@gobdocs.com</div>
          <div>809-785-9999</div>
          
          {/* El "Easter Egg" del Patito de Goma */}
          <img 
            src="/rubber-duck.png" /* Cambia esto por la ruta real de tu imagen en la carpeta public o assets */
            alt="Acceso Operadores"
            title="Registro de Operadores" /* El texto que sale al dejar el mouse encima */
            className="duck-easter-egg"
            style={{ 
              width: '30px', 
              height: '30px', 
              cursor: 'pointer', 
              transition: 'transform 0.2s ease-in-out' 
            }}
            onClick={() => navigate('/registro-operador')} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      </footer>
    </div>
  );
}