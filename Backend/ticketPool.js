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
        this.currentTicketPool = [];
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

    // Create a method for vendors to generate tickets
    async generateTickets(vendorId) {
        await this.mutex.runExclusive(() => {
            if(this.currentTicketPool.length < this.maxTicketCapacity && this.addCount < this.totalTickets) {
                const ticket = {
                    vendorId: vendorId, ticket: Date.now() + "0000"
                };

                this.currentTicketPool.push(ticket);
                this.vendors[vendorId].added += 1;
                this.addCount += 1;
                this.updateUsers([
                    this.totalTickets,
                    this.addCount,
                    this.currentTicketPool.length,
                    this.maxTicketCapacity,
                    this.vendors,
                    this.customers,
                ]);
            }
        });
    }

    // Create a method for customers to  purchase tickets
    async purchaseTickets(customerId) {
        await this.mutex.runExclusive(() => {
            if (this.currentTicketPool.length > 0) {
                const ticket = this.currentTicketPool.shift();
                this.vendors[vendorId].sold += 1;
                this.customers[customerId].purchased += 1;
                this.updateUsers([
                    this.totalTickets,
                    this.addCount,
                    this.currentTicketPool.length,
                    this.maxTicketCapacity,
                    this.vendors,
                    this.customers,
                ]);
                return ticket
            }
        });
    }
}

module.exports = TicketPool;