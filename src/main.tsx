import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Entry point - monta a aplicação React no DOM
// HashRouter é necessário para funcionar em servidores estáticos (GitHub Pages)
// pois o BrowserRouter requer redirecionamento de servidor para rotas SPA
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
