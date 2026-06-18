import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Programacao from './pages/Programacao';
import Barracas from './pages/Barracas';
import Admin from './pages/Admin';
import Login from './pages/Login';

// App: Componente principal que define as rotas da aplicação
// Frontend: React Router gerencia a navegação entre páginas
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="programacao" element={<Programacao />} />
          <Route path="barracas" element={<Barracas />} />
          <Route path="admin" element={<Admin />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
