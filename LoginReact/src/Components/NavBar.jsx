import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; // Importa el store de autenticación

const Navbar = () => {
  const { logout } = useAuthStore(); // Obtiene la función de logout del store
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Llama la función que maneja el cierre de sesión
    navigate("/login"); // Redirige al usuario después del logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mi Aplicación
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">
          Inicio
        </Button>
        <Button color="inherit" component={Link} to="/contact">
          Contacto
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Usuarios
        </Button>
        <Button color="inherit" component={Link} to="/chat">
          Chat
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
