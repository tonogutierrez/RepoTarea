import { Link } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";

const NotAllowed = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <img 
        src="https://i.pinimg.com/originals/d9/2a/1c/d92a1cf8aef657f514349872e882dae6.gif" 
        alt="Ohhh nooo!" 
        style={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}
      />
      <Typography variant="h3" gutterBottom>
        Ohhh nooo 😨
      </Typography>
      <Typography variant="h5" gutterBottom>
        Necesitas hacer login para acceder a esta página.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/login">
        Ir al Login
      </Button>
    </Container>
  );
};

export default NotAllowed;
