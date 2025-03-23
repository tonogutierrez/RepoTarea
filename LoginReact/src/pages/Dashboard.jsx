import * as React from "react";
import { Container, Typography } from "@mui/material";
import Navbar from "../Components/Navbar";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
    const movieData = {
      "lord-of-the-rings": {
        title: "The Lord of the Rings",
        description:
          "*The Lord of the Rings* es una épica trilogía de películas basada en las novelas de J.R.R. Tolkien. Sigue la aventura de Frodo Bolsón y la Comunidad del Anillo mientras intentan destruir el Anillo Único para salvar la Tierra Media del malvado Sauron.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl7SabxdQDiX_VwP3NNGC277uv3k2FXfUKqw&s",
      },
      "harry-potter": {
        title: "Harry Potter",
        description:
          "*Harry Potter* es una saga de películas basada en las novelas de J.K. Rowling. Narra la historia de Harry Potter, un joven mago, y sus amigos Hermione y Ron, mientras luchan contra el mago oscuro Lord Voldemort.",
          image: "https://i0.wp.com/cinemedios.com/wp-content/uploads/2023/07/harry-potter.jpeg?fit=1024%2C634&ssl=1",
        },
    };
  
    const selectedMovie = Object.keys(movieData).find((key) =>
      pathname.includes(key)
    );
  
    return (
      <Box
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {selectedMovie ? (
          <>
            <Typography variant="h5">{movieData[selectedMovie].title}</Typography>
            <Typography variant="body1" sx={{ maxWidth: "600px", mt: 2 }}>
              {movieData[selectedMovie].description}
            </Typography>
            <img
              src={movieData[selectedMovie].image}
              alt={movieData[selectedMovie].title}
              style={{
                width: "100%",
                maxWidth: "600px",
                marginTop: "20px",
                borderRadius: "10px",
              }}
            />
          </>
        ) : (
          <Typography>Selecciona una película para ver más detalles.</Typography>
        )}
      </Box>
    );
  }
  
  DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
  };
  

  const Dashboard = () => {
    const router = useDemoRouter("/movies/lord-of-the-rings");
  
    return (
      <AppProvider
        navigation={[
          {
            segment: "movies",
            title: "Movies",
            icon: <FolderIcon />,
            children: [
              {
                segment: "lord-of-the-rings",
                title: "Lord of the Rings",
                icon: <DescriptionIcon />,
              },
              {
                segment: "harry-potter",
                title: "Harry Potter",
                icon: <DescriptionIcon />,
              },
            ],
          },
        ]}
        router={router}
        theme={demoTheme}
      >
        <DashboardLayout>
          <Navbar />
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    );
  };
  
  export default Dashboard;
  