import './App.css'
import { BrowserRouter } from 'react-router-dom'
// import LandingUsuario from './public/ui/LandingPage'
// import LoginPage from './auth/ui/LoginPage'
// import RegisterPage from './auth/ui/RegisterPage'
import { AppRouter } from './router/AppRouter'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
     <AppRouter />
     <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      {/* <Routes>
        <Route path="/" element={<LandingUsuario />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Routes> */}
    </BrowserRouter>
  )
}

export default App
