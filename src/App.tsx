import './App.css'
import { BrowserRouter } from 'react-router-dom'
// import LandingUsuario from './public/ui/LandingPage'
// import LoginPage from './auth/ui/LoginPage'
// import RegisterPage from './auth/ui/RegisterPage'
import { AppRouter } from './router/AppRouter'

function App() {
  return (
    <BrowserRouter>
`     <AppRouter />
      {/* <Routes>
        <Route path="/" element={<LandingUsuario />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Routes> */}
    </BrowserRouter>
  )
}

export default App
