import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  if (!socket) {
    socket = io("http://localhost:3000", {
      auth: {
        token,
      },

      autoConnect: false,
    });
  }

  socket.auth = {
    token,
  };

  socket.connect();

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
};
