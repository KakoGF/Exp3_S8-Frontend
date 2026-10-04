import { useState } from 'react'
import Mensaje from './Mensaje.jsx'

/* ==========================================================
   ProductoForm: formulario para agregar un juego al catálogo.
   Basado en el VideojuegoForm de la guía de la Semana 8:
   cada campo es un "input controlado" con su propio useState,
   y al enviar se llama a la función onAgregar que llega por props.

   Props:
     categorias  categorías disponibles para el select
     onAgregar   función de App que agrega el juego al catálogo
   ========================================================== */
function ProductoForm({ categorias, onAgregar }) {
  // Un estado por cada campo del formulario
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState(categorias[0])
  const [precio, setPrecio] = useState('')
  const [precioOferta, setPrecioOferta] = useState('')
  const [stock, setStock] = useState('10')
  const [imagen, setImagen] = useState('')

  // Mensajes para el usuario ('' = no se muestra nada)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  /**
   * Evento onSubmit: evita que la página se recargue, valida los datos,
   * envía el juego nuevo a App y deja el formulario limpio.
   */
  function manejarEnvio(evento) {
    evento.preventDefault()
    setExito('')

    const precioNumero = Number(precio)
    // Si no se escribe precio oferta, el juego queda a precio normal
    const ofertaNumero = precioOferta === '' ? precioNumero : Number(precioOferta)
    const stockNumero = Number(stock)

    if (nombre.trim() === '') {
      setError('Escribe el nombre del juego.')
      return
    }
    if (precioNumero <= 0) {
      setError('El precio normal debe ser mayor a 0.')
      return
    }
    if (ofertaNumero <= 0 || ofertaNumero > precioNumero) {
      setError('El precio oferta debe ser mayor a 0 y no puede superar al precio normal.')
      return
    }
    if (stockNumero < 1) {
      setError('El stock debe ser de al menos 1 unidad.')
      return
    }

    onAgregar({
      id: Date.now(),
      nombre: nombre.trim(),
      categoria,
      precio: precioNumero,
      precioOferta: ofertaNumero,
      imagen: imagen.trim(),
      plataforma: 'PC',
      stock: stockNumero,
      descripcion: 'Juego agregado desde el panel de administración.',
      detalle: 'Sin información adicional por ahora.',
    })

    setError('')
    setExito(`"${nombre.trim()}" se agregó al catálogo.`)
    setNombre('')
    setCategoria(categorias[0])
    setPrecio('')
    setPrecioOferta('')
    setStock('10')
    setImagen('')
  }

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <h3 className="h6 text-warning mb-3">Agregar juego</h3>

      {/* Renderizado condicional: solo aparece el mensaje que corresponda */}
      {error && <Mensaje tipo="danger">{error}</Mensaje>}
      {exito && <Mensaje tipo="success">{exito}</Mensaje>}

      <div className="row g-2">
        <div className="col-12">
          <label htmlFor="formNombre" className="form-label small mb-1">Nombre</label>
          <input
            id="formNombre"
            type="text"
            className="form-control form-control-sm"
            placeholder="Ej: Hollow Knight"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="col-12 col-sm-6">
          <label htmlFor="formCategoria" className="form-label small mb-1">Categoría</label>
          <select
            id="formCategoria"
            className="form-select form-select-sm"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categorias.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-sm-6">
          <label htmlFor="formStock" className="form-label small mb-1">Stock</label>
          <input
            id="formStock"
            type="number"
            min="1"
            className="form-control form-control-sm"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div className="col-12 col-sm-6">
          <label htmlFor="formPrecio" className="form-label small mb-1">Precio normal</label>
          <input
            id="formPrecio"
            type="number"
            min="1"
            className="form-control form-control-sm"
            placeholder="Ej: 15990"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div className="col-12 col-sm-6">
          <label htmlFor="formOferta" className="form-label small mb-1">Precio oferta (opcional)</label>
          <input
            id="formOferta"
            type="number"
            min="1"
            className="form-control form-control-sm"
            placeholder="Ej: 9990"
            value={precioOferta}
            onChange={(e) => setPrecioOferta(e.target.value)}
          />
        </div>

        <div className="col-12">
          <label htmlFor="formImagen" className="form-label small mb-1">URL de la imagen (opcional)</label>
          <input
            id="formImagen"
            type="text"
            className="form-control form-control-sm"
            placeholder="https://..."
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-danger btn-sm w-100 mt-3">
        Agregar al catálogo
      </button>
    </form>
  )
}

export default ProductoForm
