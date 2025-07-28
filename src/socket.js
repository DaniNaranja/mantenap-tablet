// src/socket.js
import { io } from "socket.io-client";

// Conecta al backend con socket.io
const socket = io("https://192.168.42.1:3002", {
  transports: ["websocket"], // Fuerza el uso de WebSocket (más estable en móviles)
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

// Log para debug
socket.on("connect", () => {
  console.log("Conectado a Socket.IO:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Desconectado de Socket.IO");
});

export default socket;
