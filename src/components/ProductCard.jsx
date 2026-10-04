import PrecioProducto from './PrecioProducto.jsx'
import { calcularDescuento, manejarErrorImagen, rutaImagen } from '../utils/formato.js'

/* ==========================================================
   ProductCard: tarjeta de un producto del catálogo.
   Muestra imagen, nombre, descripción corta, precio normal y
   precio oferta. Es un componente reutilizable: la misma tarjeta
   sirve para los seis juegos, solo cambian las props.

   Props:
     producto     objeto con los datos del juego
     cantidad     unidades de este juego que ya están en el carrito
     onAgregar    función para agregarlo al carrito
     onVerDetalle función para abrir el modal de detalle
   ========================================================== */
function ProductCard({ producto, cantidad, onAgregar, onVerDetalle }) {
  const descuento = calcularDescuento(producto.precio, producto.precioOferta)
  const sinStockDisponible = cantidad >= producto.stock

  // Texto del botón según el estado del carrito (renderizado condicional):
  // "Agregar al carrito" -> "En el carrito (n)" -> "Stock máximo en carrito".
  // Con el juego ya en el carrito, un nuevo clic suma otra unidad.
  let textoBoton = 'Agregar al carrito'
  if (sinStockDisponible) textoBoton = 'Stock máximo en carrito'
  else if (cantidad > 0) textoBoton = `En el carrito (${cantidad})`

  return (
    <div className="col-12 col-sm-6 col-xl-4">
      <article className="card h-100 card-producto">
        <div className="position-relative">
          <img
            src={rutaImagen(producto.imagen)}
            className="card-img-top"
            alt={`Portada de ${producto.nombre}`}
            loading="lazy"
            onError={manejarErrorImagen}
          />
          <span className="badge text-bg-dark etiqueta-categoria">{producto.categoria}</span>
          {descuento > 0 && (
            <span className="badge text-bg-danger etiqueta-descuento">-{descuento}%</span>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <h3 className="card-title h6">{producto.nombre}</h3>
          <p className="small text-body-secondary mb-1">{producto.plataforma}</p>
          <p className="card-text small flex-grow-1">{producto.descripcion}</p>
          <PrecioProducto precio={producto.precio} precioOferta={producto.precioOferta} />

          {/* Aviso de pocas unidades: solo cuando el stock es bajo */}
          {producto.stock <= 5 && (
            <p className="small text-warning mb-0 mt-1">¡Últimas {producto.stock} unidades!</p>
          )}
        </div>

        <div className="card-footer bg-transparent d-grid gap-2">
          {/* Evento onClick: agrega el producto; se deshabilita al llegar al stock */}
          <button
            type="button"
            className={`btn btn-sm ${cantidad > 0 ? 'btn-success' : 'btn-danger'}`}
            onClick={() => onAgregar(producto)}
            disabled={sinStockDisponible}
          >
            {textoBoton}
          </button>
          <button type="button" className="btn btn-outline-light btn-sm" onClick={() => onVerDetalle(producto)}>
            Ver detalles
          </button>
        </div>
      </article>
    </div>
  )
}

export default ProductCard
