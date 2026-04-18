import './App.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatedRoutes } from './shared/animations/AnimatedRoutes';

// 🔥 Wrapper interno (porque useLocation necesita estar dentro de BrowserRouter)
function AppContent() {
  const location = useLocation();

  return (
    <AnimatedRoutes location={location}>
      <AppRouter />
    </AnimatedRoutes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;