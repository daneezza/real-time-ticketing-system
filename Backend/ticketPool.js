const { Mutex } = require("async-mutex"); // This will prevent data racing in concurrent operations

class TicketPool {
    constructor(
        maxTicketCapacity,
        vendorCount,
        customerCount,
        updateUsers,
        totalTickets
    ) {
        this.totalTickets = totalTickets;
        this.addCount = 0;
        this.updateUsers = updateUsers;
        this.pool = [];
        this.maxTicketCapacity = maxTicketCapacity;
        this.mutex = new Mutex();

        this.vendors = {};
        for (let i = 1; i <= vendorCount; i++) {
            this.vendors[i] = {added: 0, sold: 0};
        }

        this.customers = {};
        for (let i = 1; i <= customerCount; i++) {
            this.customers[i] = {purchased : 0};
        }

        
    }
}