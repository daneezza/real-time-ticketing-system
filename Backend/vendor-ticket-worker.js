// Import dependencies from Node.js worker threads
import { parentPort, workerData } from "worker_threads";

const vendorId = workerData.vendorId;
try{
    // Immediately send a message to main thread
    parentPort.postMessage({action: "addTickets", vendorId: vendorId});

    // Setup a reccuring interval for ticket generation
    setInterval(() => {
        parentPort.postMessage({action: "addTickets", vendorId: vendorId});
        console.log(`Vendor ${vendorId} generating tickets.`);
    }, workerData.releaseRate * 1000);

} catch (error) { 
    parentPort.postMessage({ action: "error", error: error.message }); 
}