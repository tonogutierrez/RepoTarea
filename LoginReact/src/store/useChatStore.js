import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.get(`${BASE_URL}/messages/users`, {
        withCredentials: true, // 🔥 Permite que el navegador envíe la cookie JWT automáticamente
      });

      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error loading users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axios.get(`${BASE_URL}/messages/${userId}`, {
        withCredentials: true, // 🔥 Permite que el navegador envíe la cookie JWT automáticamente
      });

      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error loading messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      console.log("📤 Enviando mensaje:", messageData);
      const res = await axios.post(
        `${BASE_URL}/messages/send/${selectedUser.Id}`, // ✅ Cambié `_id` por `Id`
        messageData,
        {
          withCredentials: true, // 🔥 Permite que el navegador envíe la cookie JWT automáticamente
        }
      );
      console.log("✅ Respuesta del servidor:", res.data); 
      set({ messages: [...messages, res.data] });
      
    } catch (error) {
      toast.error(error.response?.data?.error || "Error sending message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.SenderId === selectedUser.Id; // ✅ Cambio importante
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
