import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import Navbar from "./Components/Navbar";
import Login from "./pages/Login";
import Users from "./pages/Users";
import NotAllowed from "./pages/NotAllowed";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ChatPage from "./pages/ChatPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ⏳ Mostrar un loader mientras se verifica la autenticación
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Router>
        <Routes>
          {/* 📌 Página de Login (No necesita protección) */}
          <Route path="/" element={!authUser ? <Navigate to="/login" replace /> : <Navigate to="/dashboard" replace />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/dashboard" />} />
          {/* 📌 Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<Users />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>

          {/* 📌 Redirigir cualquier ruta desconocida */}
          <Route path="*" element={<NotAllowed />} />
        </Routes>

        <Toaster /> {/* ✅ Notificaciones */}
      </Router>
    </div>
  );
};

export default App;
