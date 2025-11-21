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
**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
