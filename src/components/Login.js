import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    const url = esRegistro
      ? 'http://localhost:8080/api/auth/register'
      : 'http://localhost:8080/api/auth/login';

    try {

      const bodyData = esRegistro
        ? { nombreUsuario, contrasena, email }
        : { nombreUsuario, contrasena };

      const response = await axios.post(url, bodyData);

      setMensaje(`${response.data.mensaje || 'Éxito'}`);

      setNombreUsuario('');
      setContrasena('');

      if (!esRegistro) {

        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

        console.log('Usuario logueado:', response.data.usuario);

        window.location.reload();

      }

    } catch (error) {
      setMensaje(`${error.response?.data || 'Error en la conexión'}`);
    }
  };

  const cambiarModo = () => {
    setEsRegistro(!esRegistro);
    setNombreUsuario('');
    setContrasena('');
    setMensaje('');
    setEmail('');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>GESTOR DE TAREAS</h1>
        <h2>{esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario:</label>
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {esRegistro && (
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
                required
              />
            </div>
          )}

          <button type="submit" className="btn-primary">
            {esRegistro ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="toggle-form">
          {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <span onClick={cambiarModo}>
            {esRegistro ? ' Inicia sesión' : ' Regístrate'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;