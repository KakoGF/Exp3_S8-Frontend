import { useState } from 'react'
import ProductoForm from './ProductoForm.jsx'
import { formatearPrecio, manejarErrorImagen, rutaImagen } from '../utils/formato.js'

/* ==========================================================
   PanelAdmin: sección para administrar el catálogo.
   Tiene un botón que muestra u oculta el panel (su texto cambia
   según el estado). Dentro del panel se puede agregar un juego
   con ProductoForm o eliminar uno de la lista.

   Props:
     productos           catálogo completo
     categorias          categorías para el formulario
     onAgregarProducto   función de App que agrega un juego
     onEliminarProducto  función de App que elimina un juego
   ========================================================== */
function PanelAdmin({ productos, categorias, onAgregarProducto, onEliminarProducto }) {
  // Estado local: el panel parte oculto
  const [mostrarPanel, setMostrarPanel] = useState(false)

  return (
    <section id="admin" className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="h3 text-warning mb-0">Panel de administración</h2>
        {/* Evento onClick: alterna entre mostrar y ocultar el panel */}
        <button
          type="button"
          className={`btn btn-sm ${mostrarPanel ? 'btn-outline-light' : 'btn-danger'}`}
          onClick={() => setMostrarPanel(!mostrarPanel)}
          aria-expanded={mostrarPanel}
          aria-controls="contenidoAdmin"
        >
          {mostrarPanel ? 'Ocultar panel admin' : 'Mostrar panel admin'}
        </button>
      </div>

      {/* Renderizado condicional: el contenido del panel solo existe si mostrarPanel es true */}
      {mostrarPanel ? (
        <div id="contenidoAdmin" className="card">
          <div className="card-body">
            <div className="row g-4">
              <div className="col-12 col-lg-5">
                <ProductoForm categorias={categorias} onAgregar={onAgregarProducto} />
              </div>

              <div className="col-12 col-lg-7">
                <h3 className="h6 text-warning mb-3">
                  Juegos en el catálogo{' '}
                  <span className="badge text-bg-secondary">{productos.length}</span>
                </h3>

                {productos.length === 0 ? (
                  <p className="small text-body-secondary mb-0">
                    No hay juegos en el catálogo. Agrega uno con el formulario.
                  </p>
                ) : (
                  <ul className="list-group list-group-flush lista-admin">
                    {productos.map((producto) => (
                      <li key={producto.id} className="list-group-item d-flex align-items-center gap-2">
                        <img
                          src={rutaImagen(producto.imagen)}
                          alt=""
                          className="miniatura-carrito"
                          onError={manejarErrorImagen}
                        />
                        <div className="flex-grow-1">
                          <p className="mb-0 small fw-semibold">{producto.nombre}</p>
                          <p className="mb-0 small text-body-secondary">
                            {producto.categoria} · {formatearPrecio(producto.precioOferta)} · Stock {producto.stock}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onEliminarProducto(producto.id)}
                          aria-label={`Eliminar ${producto.nombre} del catálogo`}
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="small text-body-secondary mb-0">
          Desde aquí se pueden agregar juegos nuevos al catálogo o eliminar los existentes.
        </p>
      )}
    </section>
  )
}

export default PanelAdmin
