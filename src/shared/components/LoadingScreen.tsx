import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoadingScreenProps {
  targetRoute: string;
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ targetRoute, onComplete }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(targetRoute);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, targetRoute, onComplete]);

  return (
    <div style={styles.overlay}>
      {/* Background gradient layers */}
      <div style={styles.bgLayer1} />
      <div style={styles.bgLayer2} />

      {/* Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>Cargando</h1>

        {/* Animated blobs container */}
        <div style={styles.blobContainer}>
          {/* Blob 1 - Top right (peach/coral) */}
          <div style={{ ...styles.blob, ...styles.blob1 }} />
          {/* Blob 2 - Bottom left (light blue/white) */}
          <div style={{ ...styles.blob, ...styles.blob2 }} />
          {/* Blob 3 - Bottom right (purple/indigo) */}
          <div style={{ ...styles.blob, ...styles.blob3 }} />
        </div>

        <p style={styles.subtitle}>
          Solicita tus documentos<br />
          mas rapido que nunca
        </p>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes loadingRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes loadingPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes loadingFadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes loadingSubtitleFade {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 0.8; transform: translateY(0); }
        }
        @keyframes blob1Move {
          0%, 100% { transform: translate(10px, -15px) rotate(0deg) scale(1); }
          33% { transform: translate(15px, -10px) rotate(120deg) scale(1.05); }
          66% { transform: translate(5px, -20px) rotate(240deg) scale(0.95); }
        }
        @keyframes blob2Move {
          0%, 100% { transform: translate(-15px, 10px) rotate(0deg) scale(1); }
          33% { transform: translate(-10px, 15px) rotate(-120deg) scale(1.05); }
          66% { transform: translate(-20px, 5px) rotate(-240deg) scale(0.95); }
        }
        @keyframes blob3Move {
          0%, 100% { transform: translate(5px, 15px) rotate(0deg) scale(1); }
          33% { transform: translate(10px, 10px) rotate(120deg) scale(0.95); }
          66% { transform: translate(0px, 20px) rotate(240deg) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bgLayer1: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(145deg, #0a0f2e 0%, #0d1847 30%, #111d5a 50%, #0e1545 70%, #080d28 100%)',
    zIndex: 0,
  },
  bgLayer2: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 30% 50%, rgba(20, 40, 100, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(15, 30, 80, 0.3) 0%, transparent 50%)',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '32px',
    animation: 'loadingFadeIn 0.6s ease-out both',
  },
  title: {
    color: '#ffffff',
    fontSize: '2.2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    margin: 0,
    textShadow: '0 2px 20px rgba(0,0,0,0.3)',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  blobContainer: {
    position: 'relative' as const,
    width: '160px',
    height: '160px',
    animation: 'loadingRotate 8s linear infinite',
  },
  blob: {
    position: 'absolute' as const,
    width: '80px',
    height: '80px',
    borderRadius: '50% 40% 50% 40%',
    filter: 'blur(1px)',
    animation: 'loadingPulse 3s ease-in-out infinite',
  },
  blob1: {
    top: '5px',
    right: '10px',
    background: 'linear-gradient(135deg, #f8c9a0 0%, #e8887a 40%, #d94b4b 100%)',
    borderRadius: '45% 55% 50% 50%',
    animation: 'blob1Move 6s ease-in-out infinite, loadingPulse 3s ease-in-out infinite',
  },
  blob2: {
    bottom: '15px',
    left: '10px',
    background: 'linear-gradient(135deg, #e8eaf6 0%, #b8bfe6 40%, #8b9ad4 100%)',
    borderRadius: '55% 45% 50% 50%',
    animation: 'blob2Move 6s ease-in-out infinite, loadingPulse 3s ease-in-out infinite 0.5s',
  },
  blob3: {
    bottom: '10px',
    right: '20px',
    background: 'linear-gradient(135deg, #7b82c4 0%, #5a60a8 40%, #3d4290 100%)',
    borderRadius: '50% 50% 45% 55%',
    animation: 'blob3Move 6s ease-in-out infinite, loadingPulse 3s ease-in-out infinite 1s',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '1rem',
    fontWeight: 400,
    textAlign: 'center' as const,
    lineHeight: 1.6,
    margin: 0,
    letterSpacing: '0.01em',
    animation: 'loadingSubtitleFade 0.8s ease-out 0.3s both',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
};
