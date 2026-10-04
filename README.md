# KakoJuegos — Semana 8 (React)

**Actividad Sumativa Semana 8:** "Mejorando funcionalidades clave en el eCommerce con React"
**Asignatura:** Desarrollo Frontend I (PFY2201) — Duoc UC
**Alumno:** Joaquín Gómez Flores

- Repositorio: https://github.com/KakoGF/Exp3_S8-Frontend
- Sitio publicado (gh-pages): https://kakogf.github.io/Exp3_S8-Frontend/

---

## ¿De qué se trata?

Sigo con la tienda de videojuegos KakoJuegos que vengo armando desde las primeras semanas. En la Semana 7 la pasé a React con componentes. En esta semana la mejoré usando los Hooks `useState` y `useEffect`, junto con el renderizado condicional.

### Lo nuevo en esta semana

1. **Panel de administración:** un botón "Mostrar panel admin" abre un formulario para **agregar juegos al catálogo** y una lista para **eliminarlos**. Al abrirse, el botón cambia a "Ocultar panel admin".
2. **Botón "En el carrito (n)":** cuando un juego ya está en el carrito, el botón de la tarjeta cambia de texto y de color.
3. **El carrito ya no se pierde al recargar la página:** se guarda en `localStorage` con un `useEffect`. Este era el desafío que me dejó el profe en el feedback de la Semana 7.
4. **Imagen por defecto:** si un juego no tiene imagen o la URL no carga, se muestra "Imagen no disponible". Se hace con `onError`, igual que en la guía.

---

## Cómo ejecutarlo

Se necesita Node.js instalado. En la terminal CMD de VS Code:

```
npm install
npm run dev
```

Después se abre `http://localhost:5173/Exp3_S8-Frontend/` en el navegador.

## Cómo publicarlo en GitHub Pages

```
npm run deploy
```

Este comando primero arma la carpeta `dist` (`npm run build`) y después la sube a la rama `gh-pages` con el paquete `gh-pages`. En GitHub se configura así: **Settings → Pages → Deploy from a branch → `gh-pages` / `(root)`**.

En `vite.config.js` la opción `base: '/Exp3_S8-Frontend/'` tiene que llevar el mismo nombre del repositorio. Si no coincide, el sitio publicado no encuentra sus archivos.

---

## Estructura de carpetas

```
src/
├── App.jsx                 Componente principal: catálogo, filtros y carga de datos
├── main.jsx                Monta <App /> e importa Bootstrap
├── components/
│   ├── Navbar.jsx          Menú, categorías, buscador y contador del carrito
│   ├── Buscador.jsx        Formulario de búsqueda
│   ├── Encabezado.jsx      Título de la tienda
│   ├── Carrusel.jsx        Juegos destacados
│   ├── ProductList.jsx     Catálogo (cargando / error / sin resultados / tarjetas)
│   ├── ProductCard.jsx     Tarjeta de un juego
│   ├── PrecioProducto.jsx  Precio normal tachado + precio oferta
│   ├── ModalDetalle.jsx    Detalle del juego
│   ├── ShoppingCart.jsx    Panel del carrito
│   ├── CartItem.jsx        Fila del carrito
│   ├── CartTotal.jsx       Totales y ahorro
│   ├── PanelAdmin.jsx      NUEVO: panel para administrar el catálogo
│   ├── ProductoForm.jsx    NUEVO: formulario para agregar juegos
│   ├── Mensaje.jsx         Alerta reutilizable
│   └── Footer.jsx          Pie de página
├── hooks/
│   └── useCarrito.js       Lógica del carrito + guardado en localStorage
├── utils/
│   └── formato.js          Funciones de apoyo (precios, rutas, imágenes)
└── styles/
    └── kakojuegos.css      Estilos propios
public/
├── productos.json          Datos del catálogo (6 juegos)
└── img/                    Portadas e imagen por defecto
```

---

## Cómo cumplí lo que pide la pauta

### 1. Gestión de estados con `useState`

| Estado | Dónde | Para qué |
|---|---|---|
| `productos` | `App` | Lista del catálogo. Cambia al cargar el JSON, al agregar y al eliminar juegos. |
| `cargando`, `error` | `App` | Saber si se está cargando el catálogo o si hubo un error. |
| `carrito` | `useCarrito` | Juegos del carrito con su cantidad. |
| `categoriaActual`, `busqueda` | `App` | Filtros del catálogo. |
| `productoSeleccionado` | `App` | Qué juego se muestra en el modal. |
| `mostrarPanel` | `PanelAdmin` | **Elemento interactivo:** muestra u oculta el panel y cambia el texto del botón. |
| `nombre`, `precio`, `imagen`… | `ProductoForm` | Un estado por cada campo del formulario (inputs controlados). |
| `error`, `exito` | `ProductoForm` | Mensajes de validación y de juego agregado. |

Para cambiar el estado siempre se crea un arreglo nuevo con `[...lista, nuevo]`, `filter` o `map`, sin modificar el arreglo original.

### 2. Efectos con `useEffect`

| Dónde | Dependencias | Qué hace |
|---|---|---|
| `App` | `[]` | Carga `productos.json` con `fetch` una sola vez y guarda los datos en el estado. Si falla, guarda el error. |
| `useCarrito` | `[carrito]` | Cada vez que el carrito cambia, lo guarda en `localStorage`. |
| `Carrusel` | `[productos.length]` | Inicia el carrusel de Bootstrap (cada 3 segundos). |
| `ModalDetalle` | `[onCerrar]` | Cierra el modal con la tecla Escape mientras está abierto. |

### 3. Renderizado condicional

| Condición | Qué se muestra |
|---|---|
| Cargando el catálogo | Spinner "Cargando productos..." |
| Error al cargar | Alerta roja |
| Búsqueda sin resultados | Alerta amarilla con enlace "Ver todo el catálogo" |
| Carrito vacío | Mensaje "Tu carrito está vacío..." (con operador ternario) |
| Juego ya en el carrito | Botón verde "En el carrito (n)" en vez de "Agregar al carrito" |
| Se llegó al stock | Botón deshabilitado "Stock máximo en carrito" |
| Panel admin abierto o cerrado | Formulario y lista, o un texto corto; el botón cambia de texto |
| Formulario con datos malos | Alerta roja con el problema |
| Juego agregado | Alerta verde "... se agregó al catálogo." |
| Juego sin imagen | Imagen "Imagen no disponible" |

### 4. Buenas prácticas

- Los componentes van en `components/`, el hook en `hooks/` y las funciones de apoyo en `utils/`.
- Cada componente empieza con un comentario que explica qué hace y qué props recibe.
- Para no repetir código se reutilizan `Mensaje` (todas las alertas), `PrecioProducto` (tarjeta y modal) y las funciones de `formato.js`.
- Los componentes usan nombres en PascalCase, las funciones y variables en camelCase, y las props de eventos empiezan con `on` (`onAgregar`, `onEliminarProducto`).

### 5. Publicación

El código está en la rama `main` y el sitio compilado en la rama `gh-pages`.

---

## Consideraciones

- Los juegos agregados desde el panel admin **no se guardan al recargar**, porque el catálogo siempre se vuelve a leer desde `productos.json`. Solo se guarda el carrito.
- Al eliminar un juego del catálogo, también sale del carrito.
- El carrusel muestra los 3 juegos destacados que vienen en el JSON. Se eligen al cargar la página y no cambian aunque se eliminen desde el panel.
