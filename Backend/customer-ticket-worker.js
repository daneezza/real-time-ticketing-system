// Import dependencies from Node.js worker threads
import { parentPort, workerData } from "worker_threads";

const customerId = workerData.customerId;

// Immediately send a message to main thread
parentPort.postMessage({action: "reserveTickets", customerId: customerId});

// Setup a reccuring interval for ticket purchasing
setInterval(() => {
    parentPort.postMessage({action: "reserveTickets", customerId: customerId})
}, workerData.rateRetrieving * 1000);