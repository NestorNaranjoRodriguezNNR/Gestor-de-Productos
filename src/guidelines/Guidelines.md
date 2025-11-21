## Guidelines para el proyecto "Gestión de Productos"

Este documento describe reglas, convenciones y buenas prácticas para el desarrollo y mantenimiento del proyecto.

Propósito:
- Mantener coherencia en el código y el diseño.
- Acelerar el trabajo en equipo con convenciones claras.

Principales recomendaciones:

- Estructura y componentes:
  - Mantener componentes pequeños y reutilizables en `src/components`.
  - Componentes visuales y atómicos deben vivir en `src/components/ui`.
  - Colocar utilidades y assets en carpetas claras (`product-assets`, `utils`).

- Estilo y CSS:
  - Preferir `flexbox` y `grid` para el layout sobre posicionamiento absoluto.
  - Usar variables o tokens (si se añaden) para colores, tamaños y espaciados.
  - Mantener las reglas globales limpias; evitar propiedades redundantes.

- Tipado y calidad:
  - Usar TypeScript con tipos explícitos cuando sea útil (evitar `any`).
  - Añadir declaraciones de tipo para librerías sin tipos (`@types/*`) cuando sea necesario.

- Accesibilidad y UX:
  - Asegurar etiquetas `alt` en imágenes y roles en elementos interactivos.
  - Mantener contrastes y estados visuales para foco/hover.

- Testing y build:
  - Ejecutar `npm run build` antes de publicar cambios importantes.

Convenciones de componentes (ejemplo breve):

### Button
- Uso: acciones principales en formularios y diálogos.
- Variantes: `primary`, `secondary`, `tertiary`.
- Reglas: `primary` solo una vez por sección visible, `secondary` y `tertiary` para acciones secundarias.

Si quieres, puedo expandir estas guías con ejemplos de código, normas de commit, o reglas de linting específicas.

