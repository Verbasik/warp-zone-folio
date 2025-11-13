import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// HashRouter redirect: ensure hash is present for GitHub Pages
if (!window.location.hash) {
  window.location.replace(window.location.pathname + '#/');
}

createRoot(document.getElementById("root")!).render(<App />);
