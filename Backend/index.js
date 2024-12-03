const express = require("express");
const http = require("http"); // To create web socket server
const WebSocket = require("ws") // To real-time updates
const cors = require("cors") // To resolve the sometimes browser blocking the request

// initializing
const app = express();
const PORT = 3001;
app.use(cors());

// create a http server for the WebSocket
const server_http = http.createServer(app);

// create WebSocket server using the http server for real-time updates
const wss = new WebSocket.Server({server_http})

// WebSocker server connection handler
wss.on("connection", (ws) => {
    console.log("New User Connected.");

    // Incoming message processing from the user
    ws.on("message", (notification => {
        console.log(`Received message: ${notification}`)
    }));

    // User Disconnection Tracking
    ws.on("close",() => {
        console.log("User Disconnected.")
    })
});

// Initiate the Server
server_http.listen(PORT, () => {
    console.log(`Server is working on this url : http://localhost:${PORT}`)
});

const updateUser = (vendors) => {
    wss.clients.forEach((user) => {
        if (user.readyState === WebSocket.OPEN) {
            user.send(JSON.stringify(vendors));
        }
    });
};


