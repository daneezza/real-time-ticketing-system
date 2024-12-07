const { Worker } = require("worker_threads");
const TicketPool = require("./ticketPool");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors"); // Import cors for handling Cross-Origin Resource Sharing (To resolve the sometimes browser blocking the requests)

// Initialize the express application and set the server portId with enabling cors.
const app = express();
const PORT = 3000;
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server using the HTTP server
const ws = new WebSocket.Server({ server });

// Handle WebSocket connections
ws.on("connection", (ws) => {
  console.log("New client connected");


  // Handle incoming messages from the client
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

  });

  // Handle client disconnect
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Function to update all connected WebSocket clients with vendors data.
const updateClients = (vendors) => {
  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(vendors));
    }
  });
};

// Variable to keep track of whether the system has started.
var start = false;

// Middleware to check if the system has already started
const middleware = (req, res, next) => {
  if (start) {
    res.send("System already running...");
  } else {
    start = true;
    next();
  }
};

// Array to keep track of all worker threads.
var threads = [];

// Route to start the system. Routes starts after middleware
app.get("/", middleware, (req, res) => {
  const maxCapacity = req.query.maxTicketCapacity;
  const numberOfVendors = req.query.numberOfVendors;
  const numberOfCustomers = req.query.numberOfCustomers;
  const releaseRate = req.query.ticketReleaseRate;
  const customerRetrieveRate = req.query.customerRetrieveRate;
  const totalTicketCount = req.query.totalTicketCount;

  // Shared TicketPool instance
  const ticketPool = new TicketPool(
    maxCapacity,
    numberOfVendors,
    numberOfCustomers,
    updateClients,
    totalTicketCount
  );

  // Start vendors as worker threads
  for (let i = 1; i <= numberOfVendors; i++) {
    const vendorWorker = new Worker("./vendor-ticket-worker.js", {
      workerData: { vendorId: i, releaseRate: releaseRate },
    });
    threads.push(vendorWorker); // Add vendor worker thread to the threads array.

    // Handle messages from the vendor worker
    vendorWorker.on("message", async (message) => {
      if (message.action === "addTickets") {
        await ticketPool.generateTickets(message.vendorId); // Generate tickets for the vendor.
      }
    });

    // Handle errors from the vendor worker
    vendorWorker.on("error", (err) => {
      console.error(`Error from Vendor-${i}:`, err);
    });

    // Handle exit of the vendor worker
    vendorWorker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Vendor-${i} stopped with exit code ${code}`);
      }
    });
  }

  // Start customers as worker threads
  for (let i = 1; i <= numberOfCustomers; i++) {
    const customerWorker = new Worker("./customer-ticket-worker.js", {
      workerData: { customerId: i, customerRetrieveRate: customerRetrieveRate },
    });
    threads.push(customerWorker); // Add customer worker thread to the threads array.

    // Handle messages from the customer worker
    customerWorker.on("message", async (message) => {
      if (message.action === "purchaseTicket") {
        await ticketPool.purchaseTicket(message.customerId); // Purchase tickets for the customer. }
      }
    });
    
    // Handle errors from the customer worker
    customerWorker.on("error", (err) => {
      console.error(`Error from Customer-${i}:`, err);
    });
    
    // Handle exit of the customer worker
    customerWorker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Customer-${i} stopped with exit code ${code}`);
      }
    });
  }

  res.send("System start"); // Respond that the system has started.
});

// Route to stop the system
app.get("/stop", (req, res) => {
  threads.forEach((thread) => {
    thread.terminate().catch((err) => {
      console.error("Error terminating thread:", err);
    });
  });
  start = false; // Set the start flag to false.
  threads = [];
  res.send("All threads are terminated and stopped the system.");
});