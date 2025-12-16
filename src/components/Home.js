import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [usuario, setUsuario] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    fechaLimite: '',
    categoriaId: ''
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);
  const [mostrarMenuOrdenar, setMostrarMenuOrdenar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', color: '#000000' });
  const [mostrarModalCategorias, setMostrarModalCategorias] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      cargarTareas(user.id);
      cargarCategorias(user.id);
    }
  }, []);

  const cargarTareas = async (usuarioId) => {
    console.log("USUARIO ID:", usuarioId);
    try {
      const response = await axios.get(
        `https://gestor-tareas-backend-d2hqg9d3cfe4bxak.spaincentral-01.azurewebsites.net/api/tareas/usuario/${usuarioId}`
      );
      setTareas(response.data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  const cargarCategorias = async (usuarioId) => {
    try {
      const response = await axios.get(`https://gestor-tareas-backend-d2hqg9d3cfe4bxak.spaincentral-01.azurewebsites.net/api/categorias/usuario/${usuarioId}`);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const crearTarea = async (e) => {
    e.preventDefault();
    try {
      const tareaData = {
        usuarioId: parseInt(usuario.id),
        titulo: nuevaTarea.titulo,
        descripcion: nuevaTarea.descripcion,
        prioridad: nuevaTarea.prioridad,
        fechaLimite: nuevaTarea.fechaLimite,
        categoriaId: nuevaTarea.categoriaId ? parseInt(nuevaTarea.categoriaId) : null
      };

      await axios.post('https://gestor-tareas-backend-d2hqg9d3cfe4bxak.spaincentral-01.azurewebsites.net/api/tareas', tareaData);

      setNuevaTarea({ titulo: '', descripcion: '', prioridad: 'media', fechaLimite: '', categoriaId: '' });
      setMostrarFormulario(false);
      cargarTareas(usuario.id);
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const crearCategoria = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://gestor-tareas-backend-d2hqg9d3cfe4bxak.spaincentral-01.azurewebsites.net/api/categorias', {
        usuarioId: usuario.id,
        nombre: nuevaCategoria.nombre,
        color: nuevaCategoria.color
      });

      setNuevaCategoria({ nombre: '', color: '#000000' });
      cargarCategorias(usuario.id);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      alert(error.response?.data || 'Error al crear categoría');
    }
  };

  const eliminarCategoria = async (categoriaId) => {
    if (window.confirm('¿Eliminar esta categoría?')) {
      try {
        await axios.delete(`https://gestor-tareas-backend-d2hqg9d3cfe4bxak.spaincentral-01.azurewebsites.net/api/categorias/${categoriaId}`);
        cargarCategorias(usuario.id);
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert(error.response?.data || 'Error al eliminar categoría');
      }
    }
  };

  const iniciarEdicion = (tarea) => {
    setTareaEditando(tarea);
    setNuevaTarea({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      prioridad: tarea.prioridad,
      fechaLimite: tarea.fechaLimite ? tarea.fechaLimite.split('T')[0] : '',
      categoriaId: tarea.categoriaId || ''
    });
    setMostrarFormulario(true);
  };

  const actualizarTarea = async (e) => {
    e.preventDefault();
    try {
      const tareaData = {
        titulo: nuevaTarea.titulo,
        descripcion: nuevaTarea.descripcion,
        prioridad: nuevaTarea.prioridad,
        fechaLimite: nuevaTarea.fechaLimite,
        categoriaId: nuevaTarea.categoriaId ? parseInt(nuevaTarea.categoriaId) : null
      };

      await axios.put(`https://gestor-tareas-backend-d2hqg9d3cfe4bxak.spaincentral-01.azurewebsites.net/api/tareas/${tareaEditando.id}`, tareaData);

      setNuevaTarea({ titulo: '', descripcion: '', prioridad: 'media', fechaLimite: '', categoriaId: '' });
      setMostrarFormulario(false);
      setTareaEditando(null);
      cargarTareas(usuario.id);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const cancelarEdicion = () => {
    setTareaEditando(null);
    setNuevaTarea({ titulo: '', descripcion: '', prioridad: 'media', fechaLimite: '', categoriaId: '' });
    setMostrarFormulario(false);
  };

  const cambiarEstado = async (tareaId, completada) => {
    try {
      await axios.put(`https://gestor-tareas-backend-d2hqg9d3cfe4bxak.spaincentral-01.azurewebsites.net/api/tareas/${tareaId}/estado`, {
        completada: !completada
      });
      cargarTareas(usuario.id);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const eliminarTarea = async (tareaId) => {
    if (window.confirm('¿Eliminar esta tarea?')) {
      try {
        await axios.delete(`https://gestor-tareas-backend-d2hqg9d3cfe4bxak.spaincentral-01.azurewebsites.net/api/tareas/${tareaId}`);
        cargarTareas(usuario.id);
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
      }
    }
  };

  const toggleNotificaciones = async (tareaId) => {
    try {
      const response = await axios.put(`https://gestor-tareas-backend-d2hqg9d3cfe4bxak.spaincentral-01.azurewebsites.net/api/tareas/${tareaId}/notificaciones`);
      alert(response.data.mensaje);
      cargarTareas(usuario.id); // Recargar para actualizar el estado visual
    } catch (error) {
      console.error('Error al cambiar notificaciones:', error);
      alert(error.response?.data || 'Error al cambiar notificaciones');
    }
  };

  const ordenarTareas = (tipoOrden) => {
    let tareasOrdenadas = [...tareas];

    switch (tipoOrden) {
      case 'fecha_creacion_asc':
        tareasOrdenadas.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));
        break;
      case 'fecha_creacion_desc':
        tareasOrdenadas.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
        break;
      case 'fecha_limite_asc':
        tareasOrdenadas.sort((a, b) => {
          if (!a.fechaLimite) return 1;
          if (!b.fechaLimite) return -1;
          return new Date(a.fechaLimite) - new Date(b.fechaLimite);
        });
        break;
      case 'fecha_limite_desc':
        tareasOrdenadas.sort((a, b) => {
          if (!a.fechaLimite) return 1;
          if (!b.fechaLimite) return -1;
          return new Date(b.fechaLimite) - new Date(a.fechaLimite);
        });
        break;
      default:
        break;
    }

    setTareas(tareasOrdenadas);
  };

  const obtenerTareasFiltradas = () => {
    let tareasFiltradas = [...tareas];

    // Filtrar por categoría
    if (filtroCategoria) {
      tareasFiltradas = tareasFiltradas.filter(t => t.categoriaId === parseInt(filtroCategoria));
    }

    // Filtrar por estado
    if (filtroEstado === 'completadas') {
      tareasFiltradas = tareasFiltradas.filter(t => t.completada === true);
    } else if (filtroEstado === 'pendientes') {
      tareasFiltradas = tareasFiltradas.filter(t => t.completada === false);
    }

    // Filtrar por prioridad
    if (filtroPrioridad !== 'todas') {
      tareasFiltradas = tareasFiltradas.filter(t => t.prioridad === filtroPrioridad);
    }

    return tareasFiltradas;
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    window.location.reload();
  };

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>GESTOR DE TAREAS</h1>
        <div>
          <span>Hola, {usuario.nombreUsuario}</span>
          <button onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </header>

      <div className="tareas-container">
        <div className="tareas-header">
          <h2>Mis Tareas</h2>
          <div className="botones-header">
            <button
              onClick={() => setMostrarModalCategorias(true)}
              className="btn-categorias-header"
            >
              Categorías
            </button>

            <div className="ordenar-container">
              <button
                onClick={() => setMostrarMenuOrdenar(!mostrarMenuOrdenar)}
                className="btn-ordenar"
              >
                Ordenar
              </button>

              {mostrarMenuOrdenar && (
                <div className="menu-ordenar">
                  <button onClick={() => ordenarTareas('fecha_creacion_asc')}>
                    Fecha Creación ↑
                  </button>
                  <button onClick={() => ordenarTareas('fecha_creacion_desc')}>
                    Fecha Creación ↓
                  </button>
                  <button onClick={() => ordenarTareas('fecha_limite_asc')}>
                    Fecha Límite ↑
                  </button>
                  <button onClick={() => ordenarTareas('fecha_limite_desc')}>
                    Fecha Límite ↓
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (tareaEditando) {
                  cancelarEdicion();
                } else {
                  setMostrarFormulario(!mostrarFormulario);
                }
              }}
              className="btn-nueva"
            >
              {mostrarFormulario ? 'Cancelar' : '+ Nueva Tarea'}
            </button>
          </div>
        </div>

        <div className="filtros-container">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filtro-select"
          >
            <option value="todas">Todas las tareas</option>
            <option value="pendientes">Pendientes</option>
            <option value="completadas">Completadas</option>
          </select>

          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="filtro-select"
          >
            <option value="todas">Todas las prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        {mostrarFormulario && (
          <form onSubmit={tareaEditando ? actualizarTarea : crearTarea} className="form-tarea">
            <h3>{tareaEditando ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
            <input
              type="text"
              placeholder="Título de la tarea"
              value={nuevaTarea.titulo}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
              required
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={nuevaTarea.descripcion}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
            />
            <select
              value={nuevaTarea.prioridad}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, prioridad: e.target.value })}
            >
              <option value="baja">Prioridad Baja</option>
              <option value="media">Prioridad Media</option>
              <option value="alta">Prioridad Alta</option>
            </select>

            <select
              value={nuevaTarea.categoriaId}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, categoriaId: e.target.value })}
            >
              <option value="">Sin categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={nuevaTarea.fechaLimite}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, fechaLimite: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />

            <button type="submit" className="btn-guardar">
              {tareaEditando ? 'Actualizar Tarea' : 'Guardar Tarea'}
            </button>
          </form>
        )}

        <div className="lista-tareas">
          {tareas.length === 0 ? (
            <p className="sin-tareas">No tienes tareas aún. ¡Crea una!</p>
          ) : (
            obtenerTareasFiltradas().map(tarea => (
              <div key={tarea.id} className={`tarea-item ${tarea.completada ? 'completada' : ''}`}>
                <div className="tarea-info">
                  <input
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => cambiarEstado(tarea.id, tarea.completada)}
                  />
                  <div>
                    <h3>{tarea.titulo}</h3>
                    {tarea.descripcion && <p>{tarea.descripcion}</p>}
                    <span className={`prioridad prioridad-${tarea.prioridad.toLowerCase()}`}>
                      {tarea.prioridad}
                    </span>
                    {tarea.fechaLimite && (
                      <span className="fecha-limite">
                        📅 {new Date(tarea.fechaLimite).toLocaleDateString('es-ES')}
                      </span>
                    )}

                    {tarea.categoriaId && (
                      <span
                        className="tarea-categoria"
                        style={{
                          borderColor: categorias.find(c => c.id === tarea.categoriaId)?.color || '#888',
                          color: categorias.find(c => c.id === tarea.categoriaId)?.color || '#888'
                        }}
                      >
                        {categorias.find(c => c.id === tarea.categoriaId)?.nombre || 'Sin categoría'}
                      </span>
                    )}

                  </div>
                </div>
                <div className="tarea-acciones">
                  <button
                    onClick={() => toggleNotificaciones(tarea.id)}
                    className={`btn-email ${tarea.notificacionesActivas ? 'btn-email-activo' : ''}`}
                    title={tarea.notificacionesActivas ? 'Notificaciones activadas' : 'Notificaciones desactivadas'}
                  >
                    📧
                  </button>
                  <button onClick={() => iniciarEdicion(tarea)} className="btn-editar">
                    ✎
                  </button>
                  <button onClick={() => eliminarTarea(tarea.id)} className="btn-eliminar">
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL DE CATEGORÍAS */}
        {mostrarModalCategorias && (
          <div className="modal-overlay" onClick={() => setMostrarModalCategorias(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Gestionar Categorías</h2>
                <button onClick={() => setMostrarModalCategorias(false)} className="btn-cerrar-modal">
                  ✕
                </button>
              </div>

              <div className="modal-body">
                {/* Formulario para crear categoría */}
                <form onSubmit={crearCategoria} className="form-categoria-modal">
                  <h4>Nueva Categoría</h4>
                  <input
                    type="text"
                    placeholder="Nombre de la categoría"
                    value={nuevaCategoria.nombre}
                    onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                    required
                  />
                  <input
                    type="color"
                    value={nuevaCategoria.color}
                    onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, color: e.target.value })}
                  />
                  <button type="submit" className="btn-crear-categoria">Crear</button>
                </form>

                {/* Lista de categorías */}
                <div className="lista-categorias">
                  <h4>Mis Categorías</h4>
                  {categorias.length === 0 ? (
                    <p className="sin-categorias">No tienes categorías aún</p>
                  ) : (
                    categorias.map(cat => (
                      <div key={cat.id} className="categoria-item">
                        <div className="categoria-info">
                          <div
                            className="categoria-color"
                            style={{ backgroundColor: cat.color }}
                          ></div>
                          <span>{cat.nombre}</span>
                        </div>
                        <button
                          onClick={() => eliminarCategoria(cat.id)}
                          className="btn-eliminar-cat"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;