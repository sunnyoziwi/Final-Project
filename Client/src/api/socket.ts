import { io } from "socket.io-client";

export const socket = io("/", {
    transports: ['polling', 'websocket'], 
    extraHeaders: {
        "ngrok-skip-browser-warning": "true"
    },
});