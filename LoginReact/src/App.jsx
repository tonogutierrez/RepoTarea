import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";
import NotAllowed from "./pages/NotAllowed";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de Login (No necesita protección) */}
        <Route path="/login" element={<Login />} />

        {/* Página de error cuando no tiene acceso */}
        <Route path="/not-allowed" element={<NotAllowed />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/users" element={<Users />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Redirigir cualquier ruta desconocida */}
        <Route path="*" element={<NotAllowed />} />
      </Routes>
    </Router>
  );
}

export default App;
