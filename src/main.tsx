import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure HashRouter has an initial fragment on GitHub Pages without forcing a reload.
if (!window.location.hash) {
  window.location.hash = "/";
}

createRoot(document.getElementById("root")!).render(<App />);
