import React from "react";

const MessageSkeleton = () => {
  // Creamos un array de 6 mensajes de carga
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`flex items-start space-x-2 ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />

          {/* Burbuja del mensaje */}
          <div className="flex flex-col space-y-1">
            {/* Nombre del usuario (skeleton) */}
            <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />

            {/* Mensaje (skeleton) */}
            <div className="w-[200px] h-16 bg-gray-300 rounded-md animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
