// For thread safe operations
const { Mutex } = require("async-mutex");

// Initialize the TicketPool
class TicketPool {
  constructor(
    maxCapacity,
    vendorCount,
    customerCount,
    updateClients,
    totalTicketCount
  ) {
    this.totalTicketCount = totalTicketCount;
    this.addCount = 0;
    this.updateClients = updateClients; // Function to update clients about the state of the ticketpool.
    this.pool = [];
    this.maxCapacity = maxCapacity;
    this.mutex = new Mutex(); // Mutex to ensure thread-safe operations.
    this.vendors = {};
    this.customers = {};

    // Initialize vendor data with counters for tickets added and sold by each vendor.
    for (let i = 1; i <= vendorCount; i++) {
      this.vendors[i] = { add: 0, sale: 0 };
    };

    // Initialize customer data with counters for tickets purchased by each customer.
    for (let i = 1; i <= customerCount; i++) {
      this.customers[i] = { sale: 0 };
    };
  };

  // Method for generating tickets by a vendor.
  async generateTickets(vendorId) {

    // Ensure this block is executed by only one thread at a time.
    await this.mutex.runExclusive(() => {

      if (
        this.pool.length < this.maxCapacity &&
        this.addCount < this.totalTicketCount
      ) {
        const ticket = {
          vendorId: vendorId, // ID of the vendor adding the ticket.
          ticket: Date.now(), // Use current timestamp as the ticket identifier.
        };
        this.pool.push(ticket);
        this.vendors[vendorId].add += 1;
        this.addCount += 1;

        // Update clients with the current state of the pool and sales.
        this.updateClients([
          this.totalTicketCount,
          this.addCount,
          this.pool.length,
          this.maxCapacity,
          this.vendors,
          this.customers,
        ]);

      }
    });
  }

  // Method for purchasing a ticket by a customer.
  async purchaseTicket(customerId) {
    return await this.mutex.runExclusive(() => {

      if (this.pool.length > 0) {
        const ticket = this.pool.shift();
        this.vendors[ticket.vendorId].sale += 1;
        this.customers[customerId].sale += 1;

        this.updateClients([
          this.totalTicketCount,
          this.addCount,
          this.pool.length,
          this.maxCapacity,
          this.vendors,
          this.customers,
        ]);
        return ticket; // Return the purchased ticket.
      } else {
        // If no tickets are available, return null.
        return null; 
      };

    });
  };

};

module.exports = TicketPool;
