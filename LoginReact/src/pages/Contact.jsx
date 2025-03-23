import { Container, Typography, Box } from "@mui/material";
import Navbar from "../Components/NavBar.jsx";
import { useEffect, useState } from "react";

const Contact = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Recuperar el correo guardado en localStorage
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contacto
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">📧 Correo Electrónico</Typography>
          <Typography variant="body1">
            {userEmail ? userEmail : "soporte@empresa.com"}
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">📞 Teléfono</Typography>
          <Typography variant="body1">+52 55 1234 5678</Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">📍 Dirección</Typography>
          <Typography variant="body1">
            Av. Insurgentes Sur 123, Colonia Roma, CDMX, México
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">⏰ Horario de Atención</Typography>
          <Typography variant="body1">
            Lunes a Viernes: 9:00 AM - 6:00 PM
          </Typography>
          <Typography variant="body1">
            Sábados: 10:00 AM - 2:00 PM
          </Typography>
          <Typography variant="body1">Domingos: Cerrado</Typography>
        </Box>
      </Container>
    </>
  );
};

export default Contact;
