import { useEffect, useState } from 'react'

import Navbar from './components/Navbar.jsx'
import Encabezado from './components/Encabezado.jsx'
import Carrusel from './components/Carrusel.jsx'
import PanelAdmin from './components/PanelAdmin.jsx'
import ProductList from './components/ProductList.jsx'
import ShoppingCart from './components/ShoppingCart.jsx'
import ModalDetalle from './components/ModalDetalle.jsx'
import Footer from './components/Footer.jsx'
import { useCarrito } from './hooks/useCarrito.js'
import { normalizarTexto, rutaPublica } from './utils/formato.js'

// Categorías que se muestran en la navbar y en el formulario del panel admin.
const CATEGORIAS = ['Todos', 'Acción', 'RPG', 'Mundo abierto']

/* ==========================================================
   App: componente principal.
   Guarda el estado compartido (catálogo, filtros, carrito y
   producto abierto en el modal) y lo reparte a los componentes
   hijos mediante props. Los hijos avisan de los cambios
   llamando a las funciones que reciben por props.
   ========================================================== */
function App() {
  // ----- Estado del catálogo -----
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Los tres juegos que se destacan en el carrusel (se eligen al cargar el JSON)
  const [destacados, setDestacados] = useState([])


  // ----- Estado de los filtros -----
  const [categoriaActual, setCategoriaActual] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [avisoBusqueda, setAvisoBusqueda] = useState('')

  // ----- Producto que se muestra en el modal (null = modal cerrado) -----
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  // ----- Carrito (useState + useEffect dentro del hook personalizado useCarrito) -----
  const carrito = useCarrito()

  /* useEffect con arreglo de dependencias vacío [ ]:
     se ejecuta una sola vez, cuando el componente aparece en pantalla.
     Carga el catálogo desde public/productos.json con la Fetch API
     y guarda el resultado en el estado "productos". */
  useEffect(() => {
    fetch(rutaPublica('productos.json'))
      .then((respuesta) => {
        // fetch no rechaza la promesa ante un 404 o 500,
        // por eso se revisa respuesta.ok y se lanza el error a mano.
        if (!respuesta.ok) {
          throw new Error(`El servidor respondió con el estado ${respuesta.status}`)
        }
        return respuesta.json()
      })
      .then((datos) => {
        setProductos(datos)
        setDestacados(datos.slice(0, 3))
      })
      .catch((errorCarga) => {
        console.error('Error al cargar el catálogo:', errorCarga)
        setError('No pudimos cargar el catálogo en este momento. Revisa tu conexión e inténtalo nuevamente.')
      })
      .finally(() => setCargando(false))
  }, [])

  /* ==================== Catálogo (panel admin) ==================== */

  // Agrega al catálogo el juego que llega desde el formulario del panel admin.
  function agregarProducto(nuevoProducto) {
    setProductos([...productos, nuevoProducto])
  }

  // Elimina un juego del catálogo. Si estaba en el carrito, también sale de ahí.
  function eliminarProducto(idProducto) {
    setProductos(productos.filter((producto) => producto.id !== idProducto))
    carrito.eliminarDelCarrito(idProducto)
  }

  /* ==================== Filtros ==================== */

  // Lista visible: se calcula con los filtros en cada renderizado.
  const textoNormalizado = normalizarTexto(busqueda)
  const productosVisibles = productos.filter((producto) => {
    const coincideCategoria =
      categoriaActual === 'Todos' || producto.categoria === categoriaActual
    const coincideTexto = normalizarTexto(producto.nombre).includes(textoNormalizado)
    return coincideCategoria && coincideTexto
  })

  function limpiarFiltros() {
    setCategoriaActual('Todos')
    setBusqueda('')
    setAvisoBusqueda('')
  }

  // Cada vez que el usuario escribe se actualiza la búsqueda y se borra el aviso.
  function cambiarBusqueda(texto) {
    setBusqueda(texto)
    setAvisoBusqueda('')
  }

  // Al enviar el formulario vacío se avisa al usuario (se mantiene el catálogo completo).
  function enviarBusqueda(texto) {
    setAvisoBusqueda(texto.trim() === '' ? 'Escribe el nombre de un juego para buscarlo.' : '')
  }

  function cerrarModal() {
    setProductoSeleccionado(null)
  }

  return (
    <>
      <Navbar
        categorias={CATEGORIAS}
        categoriaActual={categoriaActual}
        onCambiarCategoria={setCategoriaActual}
        busqueda={busqueda}
        onCambiarBusqueda={cambiarBusqueda}
        onEnviarBusqueda={enviarBusqueda}
        totalUnidades={carrito.totalUnidades}
      />

      <Encabezado />

      <main>
        <Carrusel productos={destacados} />

        <section className="container my-5">
          <div className="row g-4">
            <div className="col-12 col-lg-8" id="catalogo">
              <ProductList
                productos={productosVisibles}
                cargando={cargando}
                error={error}
                categoriaActual={categoriaActual}
                busqueda={busqueda}
                avisoBusqueda={avisoBusqueda}
                onAgregar={carrito.agregarAlCarrito}
                onVerDetalle={setProductoSeleccionado}
                onLimpiarFiltros={limpiarFiltros}
                cantidadEnCarrito={carrito.cantidadEnCarrito}
              />
            </div>

            <div className="col-12 col-lg-4" id="carrito">
              <ShoppingCart
                items={carrito.carrito}
                totalUnidades={carrito.totalUnidades}
                totalPagar={carrito.totalPagar}
                totalNormal={carrito.totalNormal}
                ahorro={carrito.ahorro}
                onAgregar={carrito.agregarAlCarrito}
                onQuitarUnidad={carrito.quitarUnidad}
                onEliminar={carrito.eliminarDelCarrito}
                onVaciar={carrito.vaciarCarrito}
              />
            </div>
          </div>
        </section>

        {/* El panel admin solo se muestra cuando terminó la carga sin errores */}
        {!cargando && !error && (
          <PanelAdmin
            productos={productos}
            categorias={CATEGORIAS.filter((categoria) => categoria !== 'Todos')}
            onAgregarProducto={agregarProducto}
            onEliminarProducto={eliminarProducto}
          />
        )}

        <section id="contacto" className="container my-5">
          <h2 className="h3 text-warning">Contacto</h2>
          <p className="text-body-secondary">
            ¿Tienes dudas o quieres comprar? Escríbenos a{' '}
            <a href="mailto:contacto@kakojuegos.cl" className="link-warning">
              contacto@kakojuegos.cl
            </a>
            .
          </p>
        </section>
      </main>

      <Footer />

      {/* Renderizado condicional: el modal solo existe si hay un producto seleccionado */}
      {productoSeleccionado && (
        <ModalDetalle
          producto={productoSeleccionado}
          cantidadEnCarrito={carrito.cantidadEnCarrito(productoSeleccionado.id)}
          onAgregar={carrito.agregarAlCarrito}
          onCerrar={cerrarModal}
        />
      )}
    </>
  )
}

export default App
