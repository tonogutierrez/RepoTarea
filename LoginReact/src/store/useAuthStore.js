import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ✅ Verifica si el usuario está autenticado (usando cookies HTTP-only)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check", { withCredentials: true });
    
      if (res.data &&  res.data.Id) {  // Verifica ambas propiedades
        const formattedUser = {
          id: res.data.Id || res.data.id || res.data._id,  // Asegurar que `id` se asigne correctamente
          fullName: res.data.fullName,
          email: res.data.Email,
          profilePic: res.data.profilePic || null,
        };
    
        set({ authUser: formattedUser });
  
        setTimeout(() => {
          get().connectSocket();
        }, 500);
      } else {
        console.error("❌ No se recibió un usuario válido del backend.");
        set({ authUser: null });
      }
    } catch (error) {
      console.error("❌ Error en checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  
  
  

  // ✅ Registro de usuario
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Cuenta creada con éxito");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al registrarse");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ Iniciar sesión (No se guarda token en localStorage, backend maneja cookies)
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data, { withCredentials: true }); 
      set({ authUser: res.data });
      toast.success("Inicio de sesión exitoso");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al iniciar sesión");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ Cerrar sesión (elimina la cookie desde el backend)
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      set({ authUser: null });
      toast.success("Cierre de sesión exitoso");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al cerrar sesión");
    }
  },

  // ✅ Actualizar perfil (imagen de perfil)
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/profile", data);
      set({ authUser: res.data });
      toast.success("Perfil actualizado con éxito");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al actualizar perfil");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ✅ Conectar usuario a WebSockets
  connectSocket: () => {
    const { authUser, socket } = get();

    

    if (!authUser || !authUser.id) {
        console.warn("⚠️ No se puede conectar a Socket.io porque userId es undefined.");
        return;
    }

    if (socket?.connected) {
        return;
    }

    const newSocket = io(BASE_URL, {
        query: { userId: authUser.id },
        reconnection: true, // 🔥 Permite la reconexión automática
        reconnectionAttempts: Infinity, // 🔥 Intentos de reconexión infinitos
        reconnectionDelay: 5000, // 🔥 Espera 5 segundos entre cada intento de reconexión
    });


    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
    });

    newSocket.on("disconnect", () => {
        console.log("🔌 Socket desconectado, esperando reconexión...");
    });

    // 🔹 Reconectar el socket cuando la pestaña vuelve a estar activa
    window.addEventListener("focus", () => {
        if (!newSocket.connected) {
            console.log("🔄 Volviendo a conectar socket al volver a la pestaña...");
            newSocket.connect();
        }
    });
},
  

  // ✅ Desconectar usuario de WebSockets
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
