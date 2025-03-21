import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:3000/login"; // Ajustado al puerto correcto

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Guarda el mensaje del backend
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email.trim() !== "" && password.trim() !== "") {
      setLoading(true);
      setError(false);
      setErrorMessage(""); // Limpiar mensaje previo

      try {
        const response = await axios.post(
          API_URL,
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("✅ API Response:", response.data);

        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token); //Guardo el token en el localStorage
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("🚨 Error en login:", error);

        let errorMsg = "⚠️ Error inesperado. Inténtalo más tarde.";

        if (error.response) {
          errorMsg = error.response.data?.detail?.general || error.response.data?.error || errorMsg;
        } else {
          errorMsg = "⚠️ No se pudo conectar al servidor.";
        }

        setErrorMessage(errorMsg);
      } finally {
        setLoading(false);
      }
    } else {
      setError(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Iniciar Sesión
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <TextField
        label="Correo Electrónico"
        type="email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error && email.trim() === ""}
        helperText={error && email.trim() === "" ? "Campo requerido" : ""}
      />

      <TextField
        label="Contraseña"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error && password.trim() === ""}
        helperText={error && password.trim() === "" ? "Campo requerido" : ""}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Login"}
      </Button>
    </Container>
  );
};

export default Login;
