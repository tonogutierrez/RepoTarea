import * as React from "react";
import { Menu, MenuItem } from "@mui/material";

const CustomMenu = ({ onClose }) => {
  return (
    <Menu open onClose={onClose}>
      <MenuItem onClick={onClose}>Perfil</MenuItem>
      <MenuItem onClick={onClose}>Configuración</MenuItem>
      <MenuItem onClick={onClose}>Cerrar Sesión</MenuItem>
    </Menu>
  );
};

export default CustomMenu;
