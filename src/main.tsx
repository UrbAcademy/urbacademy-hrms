import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AddEmployee from './pages/AddEmployee';

createRoot(document.getElementById("root")!).render(<App />);

