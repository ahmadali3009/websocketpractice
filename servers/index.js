import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const port = 8080;

const server = app.listen(port, () => {
    console.log("Port is running on", port);
});

const wss = new WebSocketServer({ server });

// Handle new connections
wss.on("connection", (ws) => {
    console.log("New client connected");

    // Listen for messages from the client
    ws.on("message", (data) => {
        console.log("Received message from client:", data.toString());

        // Broadcast the message to all clients except the sender
        wss.clients.forEach((client) => {
            // Use WebSocket.OPEN to ensure the client is connected
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });

        // Send a response back to the sender client
        const response = `Server received: ${data}`;
        ws.send(response);
    });

    // Handle client disconnection
    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
