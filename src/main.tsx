
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

/* Ionic core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Tailwind (app styles) - load after Ionic so it can override defaults */
import "./index.css";

/* Project global overrides (ensure this loads after Tailwind) */
import "./styles/globals.css";

/* Optional Ionic utility CSS (you can add later if needed) */
// import '@ionic/react/css/padding.css';
// import '@ionic/react/css/float-elements.css';
// import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css';
// import '@ionic/react/css/flex-utils.css';
// import '@ionic/react/css/display.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  