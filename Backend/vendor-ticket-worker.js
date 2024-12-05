// Import dependencies from Node.js worker threads
import { parentPort, workerData } from "worker_threads";

const vendorId = workerData.vendorId;

// Immediately send a message to main thread
parentPort.postMessage({action: "generateTickets", vendorId: vendorId});

// Setup a reccuring interval for ticket generation
setInterval(() => {
    parentPort.postMessage({action: "generateTickets", vendorId: vendorId})
}, workerData.rateReleasing * 1000);