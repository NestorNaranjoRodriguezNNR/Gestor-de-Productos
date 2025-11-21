# Gestión de Productos App

Aplicación para gestionar productos: crear, editar, listar y generar reportes relacionados con inventario y pedidos.

Características principales:
- Panel principal (Dashboard) con métricas e indicadores.
- Formulario para crear/editar pedidos y productos.
- Lista de pedidos con búsqueda y paginación.
- Reportes básicos (ventas, stock, pedidos).
- Componentes UI reutilizables en `src/components/ui`.

Estructura relevante del proyecto:
- `src/components` — componentes de la aplicación.
- `src/components/product-assets` — utilidades relacionadas con imágenes (antes `figma`).
- `src/components/ui` — biblioteca de componentes visuales y atómicos.
- `src/index.css` y `src/styles/globals.css` — estilos globales.

Cómo ejecutar en desarrollo:

1. Instalar dependencias:

```powershell
npm install
```

2. Iniciar servidor de desarrollo:

```powershell
npm run dev
```

Nota: si el puerto por defecto (3000) está en uso, Vite intentará otro puerto (por ejemplo 3001). Revisa la salida del terminal para la URL.

Build para producción:

```powershell
npm run build
```

Cambios importantes realizados en este repositorio:
- `ImageWithFallback.tsx` fue movido a `src/components/product-assets` y la carpeta `figma` fue eliminada.
- Se añadió `@types/react-dom` como dependencia de desarrollo para solucionar tipos de TypeScript.

Contacto / referencias:
- Diseño original (Figma): https://www.figma.com/design/1THqf4P2Hwpk96QK3IGtpU/Gesti%C3%B3n-de-Productos-App

Si quieres que haga un commit con este README o que añada más detalles, dímelo y lo hago.

  # Gestión de Productos App

  This is a code bundle for Gestión de Productos App. The original project is available at https://www.figma.com/design/1THqf4P2Hwpk96QK3IGtpU/Gesti%C3%B3n-de-Productos-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  