// src/socket.js
import { io } from "socket.io-client";

const socket = io(`https://${window.location.hostname}:4000`, {
  transports: ["websocket"],
});

export default socket;
