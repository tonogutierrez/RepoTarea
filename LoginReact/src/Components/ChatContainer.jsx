import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?.Id) {
      getMessages(selectedUser.Id);
    }

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?.Id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // 🚀 Scroll automático cuando hay nuevos mensajes
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {/* 🔹 SECCIÓN DONDE SE RENDERIZAN LOS MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSentByCurrentUser = String(message.SenderId) === String(authUser.id);

          return (
            <div
              key={message.Id}
              className={`flex items-center gap-2 mb-2 ${
                isSentByCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar del usuario solo en mensajes recibidos */}
              {!isSentByCurrentUser && (
                <img
                  src={selectedUser?.ProfilePic || "/default-avatar.png"}
                  alt={selectedUser?.Name || "User"}
                  className="size-10 rounded-full border"
                />
              )}

              {/* Mensaje */}
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  isSentByCurrentUser ? "bg-blue-500 text-white" : "bg-gray-700 text-white"
                }`}
              >
                {message.ImageUrl && (
                  <img
                    src={message.ImageUrl}
                    alt="Imagen enviada"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.MessageText && <p>{message.MessageText}</p>}
              </div>
            </div>
          );
        })}

        {/* 🏁 Este `div` asegura que el scroll siempre baje hasta aquí */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
