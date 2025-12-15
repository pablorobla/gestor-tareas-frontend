import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  useEffect(() => {
    // Verificar si hay usuario guardado
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      setUsuarioLogueado(JSON.parse(usuario));
    }
  }, []);

  return (
    <div className="App">
      {usuarioLogueado ? <Home /> : <Login />}
    </div>
  );
}

export default App;