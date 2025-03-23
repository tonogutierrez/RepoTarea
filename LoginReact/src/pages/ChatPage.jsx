import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import ChatContainer from "../Components/ChatContainer";
import NoChatSelected from "../Components/NoChatSelected";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore"; // ✅ Importar Zustand para manejar autenticación

const ChatPage = () => {
  const { selectedUser } = useChatStore();
  const { authUser, checkAuth } = useAuthStore(); // ✅ Obtener usuario autenticado y verificar sesión
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      await checkAuth(); // 🔥 Verifica si el usuario sigue autenticado
      if (!authUser) {
        console.log("🚨 Usuario no autenticado, redirigiendo a login...");
        navigate("/login"); // 🔄 Redirigir a login si no hay sesión
      }
    };

    verifyUser();
  }, [authUser, navigate, checkAuth]);

  if (!authUser) return null; // Evita que la UI se renderice antes de verificar la autenticación

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
