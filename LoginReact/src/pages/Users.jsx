import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; //Ícono de confirmación
import axios from "axios";
import Navbar from "../Components/NavBar";
import UserMenu from "../Components/UserMenu";
import { TableVirtuoso } from "react-virtuoso";

const columns = [
  { width: 80, label: "ID", dataKey: "Id" },
  { width: 150, label: "Nombre", dataKey: "Name" },
  { width: 250, label: "Email", dataKey: "Email" },
  { width: 150, label: "Acciones", dataKey: "actions" },
];

const VirtuosoTableComponents = {
  Scroller: (props) => <Paper {...props} />,
  Table: (props) => (
    <table {...props} style={{ borderCollapse: "separate", tableLayout: "fixed", width: "100%" }} />
  ),
  TableHead: (props) => <thead {...props} />,
  TableRow: (props) => <tr {...props} />,
  TableBody: (props) => <tbody {...props} />,
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); //Para saber si cerrar o no la confirmacion
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false); //Success para mandar mensaje

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
      } catch (err) {
        setError("Error al obtener los usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleOpenConfirmDialog = (user) => {
    setSelectedUser(user);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/users/${selectedUser.Id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.Id !== selectedUser.Id));
      setOpenConfirmDialog(false);
      setOpenSuccessDialog(true);
    } catch (err) {
      setDeleteError("Error al eliminar el usuario.");
    }
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Lista de Usuarios
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {deleteError && <Alert severity="error">{deleteError}</Alert>}

        {!loading && !error && (
          <Paper style={{ height: 400, width: "100%" }}>
            <TableVirtuoso
              data={users}
              components={VirtuosoTableComponents}
              fixedHeaderContent={() => (
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.dataKey}
                      style={{
                        width: column.width,
                        backgroundColor: "#f5f5f5",
                        padding: "10px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              )}
              itemContent={(_index, user) => (
                <>
                  {columns.map((column) => (
                    <td key={column.dataKey} style={{ padding: "10px", textAlign: "left" }}>
                      {column.dataKey === "actions" ? (
                        <UserMenu onDelete={() => handleOpenConfirmDialog(user)} />
                      ) : (
                        user[column.dataKey]
                      )}
                    </td>
                  ))}
                </>
              )}
            />
          </Paper>
        )}

        {/* Modal de Confirmación */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          PaperProps={{
            style: {
              borderRadius: 16,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
              padding: "20px",
            },
          }}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que quieres eliminar al usuario <strong>{selectedUser?.Name}</strong>? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Sí, eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Éxito */}
        <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
          <DialogTitle>Usuario Eliminado</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
            <DialogContentText sx={{ mt: 2 }}>El usuario ha sido eliminado exitosamente.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccessDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Users;
