import { useState } from 'react';
import './LandingPage.css';

const imgLogotocanva1 = "https://www.figma.com/api/mcp/asset/0ab693b8-32cf-416f-9e71-99b7dc04d09e";
const imgArrow1 = "https://www.figma.com/api/mcp/asset/b39b2017-4e69-4963-beb5-c046cbbc522b";
const imgVector = "https://www.figma.com/api/mcp/asset/e889e4a5-0a4c-432c-920f-ceecb6a68cf2";
const imgHombreRevisandoDoc21 = "https://www.figma.com/api/mcp/asset/512de9e9-6008-4e19-909d-00e7542bdfe2";
const imgMujerDeNegociosConCarpeta1 = "https://www.figma.com/api/mcp/asset/0ddb3585-fa77-417d-8cfc-ebba41022b6e";
const imgCommentDotsRegularFull1 = "https://www.figma.com/api/mcp/asset/0a020dd6-951a-4c6f-8195-e2ca68b626fd";

interface NavUserProps {
  className?: string;
}

function DropdownAccount() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`dropdown-account ${isOpen ? 'open' : ''}`} data-name="DropDownAccount" data-node-id="64:737">
      <button 
        className="dropdown-toggle" 
        data-name="Vector" 
        data-node-id="I64:737;64:713"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img alt="Menu" className="dropdown-icon" src={imgVector} />
      </button>
      {isOpen && (
        <div className="dropdown-background" data-node-id="I64:737;64:508">
          <p className="dropdown-item" data-node-id="I64:737;64:505">
            Mi perfil
          </p>
          <p className="dropdown-item" data-node-id="I64:737;64:506">
            Mis Documentos
          </p>
          <p className="dropdown-item" data-node-id="I64:737;64:507">
            Cerrar sesion
          </p>
        </div>
      )}
    </div>
  );
}

function NavUser({ className }: NavUserProps) {
  return (
    <div className={className || "nav-user-container"} data-name="Nav User" data-node-id="64:1045">
      <div className="nav-wrapper" data-name="Nav" data-node-id="64:1044">
        <div className="nav-background" data-node-id="I64:1044;5:4" />
        <div className="nav-logo" data-name="logotocanva 1" data-node-id="I64:1044;5:8">
          <img alt="GobDocs Logo" className="logo-image" src={imgLogotocanva1} />
        </div>
        <p className="nav-link" data-node-id="I64:1044;5:9">
          Visualizar
        </p>
        <p className="nav-link" data-node-id="I64:1044;5:12">
          Solicitar
        </p>
        <div className="nav-arrow" data-node-id="I64:1044;5:16">
          <img alt="" className="arrow-icon" src={imgArrow1} />
        </div>
        <div className="nav-arrow" data-node-id="I64:1044;5:17">
          <img alt="" className="arrow-icon" src={imgArrow1} />
        </div>
      </div>
      <DropdownAccount />
    </div>
  );
}

interface FooterProps {
  className?: string;
}

function Footer({ className }: FooterProps) {
  return (
    <div className={className || "footer-container"} data-name="Footer" data-node-id="5:25">
      <div className="footer-background" data-node-id="5:5" />
      <p className="footer-text footer-copyright" data-node-id="5:20">
        GobDocs RD @ 2025
      </p>
      <p className="footer-text footer-phone" data-node-id="5:21">
        809-785-9999
      </p>
      <p className="footer-text footer-email" data-node-id="5:23">
        administracion@gobdocs.com
      </p>
    </div>
  );
}

export default function LandingUsuario() {
  return (
    <div className="landing-container" data-name="Landing - Usuario" data-node-id="5:3">
      <Footer className="footer" />
      
      {/* Hero Section Background */}
      <div className="hero-gradient" data-node-id="5:27" />
      
      {/* Hero Section Left Content */}
      <div className="hero-section-left">
        <h1 className="hero-title" data-node-id="5:28">
          <span>Solicita tus documentos</span>
          <span>mas rapido que nunca</span>
        </h1>
        <p className="hero-description" data-node-id="5:29">
          Solicita certificados, constancias y documentos oficiales de forma rápida y sin complicaciones. Nuestra plataforma centraliza el proceso para que puedas gestionar tus solicitudes en línea, ahorrar tiempo y dar seguimiento en tiempo real, todo desde un solo lugar y sin filas innecesarias.
        </p>
        <a href="#" className="cta-button cta-button-light" data-node-id="5:32">
          <span>Solicita documentos aqui</span>
        </a>
      </div>
      
      {/* Hero Section Right Image */}
      <div className="hero-image-right" data-name="hombre-revisando-doc2 1" data-node-id="13:10">
        <img alt="Hombre revisando documentos" className="hero-image" src={imgHombreRevisandoDoc21} />
      </div>
      
      {/* AI Chat Section */}
      <div className="ai-section">
        <h2 className="ai-title" data-node-id="13:11">
          <span>Solicita tus documentos</span>
          <span>con nuestro chat IA</span>
        </h2>
        <p className="ai-description" data-node-id="13:13">
          Con nuestro chat inteligente, pedir documentos nunca fue tan fácil. Solo indícanos qué necesitas y el sistema te guiará paso a paso, resolviendo dudas, validando información y acelerando el trámite para que obtengas tus documentos de manera segura y eficiente.
        </p>
        <a href="#" className="cta-button cta-button-dark" data-node-id="13:15">
          <span>Ver tus documentos aqui</span>
        </a>
      </div>
      
      {/* AI Section Left Image */}
      <div className="ai-image-left" data-name="mujer-de-negocios-con-carpeta 1" data-node-id="14:18">
        <img alt="Mujer de negocios con carpeta" className="ai-image" src={imgMujerDeNegociosConCarpeta1} />
      </div>
      
      {/* Chat Icon */}
      <div className="chat-icon-wrapper" data-node-id="14:23">
        <a href="#" className="chat-icon" data-name="comment-dots-regular-full 1">
          <img alt="Chat Icon" className="chat-icon-image" src={imgCommentDotsRegularFull1} />
        </a>
      </div>
      
      {/* User Profile Dropdown */}
      {/* <div className="user-dropdown" data-name="DropDownUser/Inactive" data-node-id="64:708" /> */}
      
      {/* Navigation */}
      <NavUser className="nav-user" />
    </div>
  );
}
