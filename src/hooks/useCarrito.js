import { useEffect, useState } from 'react'

// Nombre con el que se guarda el carrito en el localStorage del navegador
const CLAVE_CARRITO = 'kakojuegos-carrito'

/**
 * Lee el carrito guardado en localStorage.
 * Si no hay nada guardado, o el dato está dañado, parte con el carrito vacío.
 */
function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

/* ==========================================================
   Hook personalizado useCarrito
   Agrupa toda la lógica del carrito de compras en un solo lugar.
   Internamente usa useState y expone el estado y las funciones
   que necesitan los componentes (agregar, quitar, eliminar, vaciar).

   Semana 8 (desafío del feedback S7): el carrito se guarda en
   localStorage, así no se pierde al recargar la página.

   Cada elemento del carrito es el producto más una propiedad
   "cantidad". Si el usuario agrega dos veces el mismo juego,
   no se duplica la fila: se suma una unidad.
   ========================================================== */
export function useCarrito() {
  // El estado parte con lo que había guardado en el navegador.
  // Se pasa la función (sin paréntesis) para que React la ejecute solo la primera vez.
  const [carrito, setCarrito] = useState(leerCarritoGuardado)

  /* useEffect con dependencia [carrito]:
     cada vez que el carrito cambia (agregar, quitar, eliminar, vaciar)
     se guarda en localStorage como texto JSON. */
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
  }, [carrito])

  /**
   * Agrega una unidad del producto. Respeta el stock disponible.
   * Se usa la forma funcional de setCarrito (recibe el estado anterior)
   * para trabajar siempre con el valor más reciente.
   */
  function agregarAlCarrito(producto) {
    setCarrito((carritoAnterior) => {
      const existente = carritoAnterior.find((item) => item.id === producto.id)

      if (!existente) {
        return [...carritoAnterior, { ...producto, cantidad: 1 }]
      }
      if (existente.cantidad >= producto.stock) {
        return carritoAnterior
      }
      return carritoAnterior.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
      )
    })
  }

  /**
   * Quita una unidad. Si era la última, el producto sale del carrito.
   */
  function quitarUnidad(idProducto) {
    setCarrito((carritoAnterior) =>
      carritoAnterior
        .map((item) =>
          item.id === idProducto ? { ...item, cantidad: item.cantidad - 1 } : item,
        )
        .filter((item) => item.cantidad > 0),
    )
  }

  /**
   * Elimina el producto completo, sin importar cuántas unidades tenga.
   */
  function eliminarDelCarrito(idProducto) {
    setCarrito((carritoAnterior) =>
      carritoAnterior.filter((item) => item.id !== idProducto),
    )
  }

  function vaciarCarrito() {
    setCarrito([])
  }

  // Valores derivados: no se guardan en el estado porque se calculan
  // a partir del carrito en cada renderizado (una sola fuente de verdad).
  const totalUnidades = carrito.reduce((suma, item) => suma + item.cantidad, 0)
  const totalPagar = carrito.reduce((suma, item) => suma + item.precioOferta * item.cantidad, 0)
  const totalNormal = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)

  /**
   * Cuántas unidades de un producto hay en el carrito (0 si no está).
   * Lo usan las tarjetas para cambiar el texto del botón.
   */
  function cantidadEnCarrito(idProducto) {
    const item = carrito.find((elemento) => elemento.id === idProducto)
    return item ? item.cantidad : 0
  }

  return {
    carrito,
    totalUnidades,
    totalPagar,
    totalNormal,
    ahorro: totalNormal - totalPagar,
    agregarAlCarrito,
    quitarUnidad,
    eliminarDelCarrito,
    vaciarCarrito,
    cantidadEnCarrito,
  }
}
