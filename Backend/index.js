const express = require("express");
const http = require("http"); // To create web socket server
const WebSocket = require("ws") // To real-time updates
const cors = require("cors"); // To resolve the sometimes browser blocking the request
const TicketPool = require("./ticketPool");
const { Worker } = require("worker_threads");

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

const updateUsers = (vendors) => {
    wss.clients.forEach((user) => {
        if (user.readyState === WebSocket.OPEN) {
            user.send(JSON.stringify(vendors));
        }
    });
};

// Setting up the middleware to prevent system run multiple times.
var start = false;

const middleware = (req, res, next) => {
    if(start) {
        res.send("System currently executing...")
    } else {
        start = true;
        next();
    }
};

// Initialize threads
var threads = [];

app.get("/", middleware, (req, res) => {
    const maxTicketCapacity = req.query.maximumTicketCapacity;
    const numberOfVendors = req.query.numOfVendors;
    const numberOfCustomers = req.query.numOfCustomers;
    const rateReleasing = req.query.rateOfTicketReleasing;
    const rateRetrieving = req.query.rateOfCustomerRetrieval;
    const totalTicketCount = req.query.totalTicketCount;

    // Create a Shared TicketPool instance
    const ticketPool = new TicketPool(        
        maxTicketCapacity,
        numberOfVendors,
        numberOfCustomers,
        updateUsers,
        totalTicketCount
    );

    // Using a loop to create worker threads for each vendor
    for (let i = 1; i <= numberOfVendors; i++) {
        
        // Create a new worker thread and passes vendor-data
        const vendorWorker = new Worker("./vendor-ticket-worker.js", {
            workerData: { vendorId: i, rateReleasing: rateReleasing },
        });
        threads.push(vendorWorker);

        vendorWorker.on("message", async (notification) => {
            if (notification.action === "generateTickets") {
                await ticketPool.generateTickets(notification.vendorId);
            }
        });

        vendorWorker.on("error", (error) => {
            console.error(`Vendor-${i} encountered an error: `, error);
        });

        vendorWorker.on("exit", (exitCode) => {
            if(exitCode !== 0) {
                console.error(`Vendor-${i} has stopped with this exit code : ${exitCode}`);
            }
        });
    }

    // Using a loop to create worker threads for each customer
    for (let i = 1; i <= numberOfCustomers; i++) {

        // Create a new worker thread and passes customer-data
        const customerWorker = new Worker("./customer-ticket-worker.js", {
            workerData: { customerId: i, rateRetrieving: rateRetrieving },
        });
        threads.push(customerWorker);

        customerWorker.on("message", async(notification) => {
            if (notification.action === "reserveTickets") {
                await ticketPool.purchaseTickets(notification.customerId);
            }
        });

        customerWorker.on("error", (error) => {
            console.error(`Customer-${i} encountered an error: `, error);
        });

        customerWorker.on("exit", (exitCode) => {
            if(exitCode !== 0) {
                console.error(`Customer-${i} has stopped with this exit code : ${exitCode}`);
            }
        });
    }

    res.send("System Excutes");
});

app.get("/stop", (req, res) => {
    threads.forEach((thread) => {
        thread.terminate().catch((error) => {
            console.error("Error Occured. Failed to Terminate thread: ", error);
        });
    });
    start = false;
    threads = [];
    res.send("All threads are terminated and system was stopped.")
});


