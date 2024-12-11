import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.PriorityBlockingQueue;

public class TicketManager {
    // Vendor responsible for releasing tickets
    private final Vendor vendor;

    // Customer responsible for buying tickets
    private final Customer customer;

    // Threads for vendor and customer operations
    private final Thread vendorThread;
    private final Thread customerThread;

    // Constructor to initialize the TicketManager with given parameters
    public TicketManager(int totalTickets, int releaseRate, int buyRate, int maxCapacity) {
        // Check that customer buy rate is strictly lower than release rate
        if (buyRate >= releaseRate) {
            throw new IllegalArgumentException("Customer buy rate must be lower than release rate.");
        }

        // Queue to hold the tickets being sold
        BlockingQueue<Ticket> ticketQueue = new LinkedBlockingQueue<>(maxCapacity);
        // Pool of tickets ready to be released
        BlockingQueue<Ticket> ticketPool = new PriorityBlockingQueue<>();
        // Initialize queues and threads
        this.vendor = new Vendor(ticketQueue, ticketPool, releaseRate, totalTickets);
        this.customer = new Customer(ticketQueue, ticketPool, buyRate);
        this.vendorThread = new Thread(vendor);
        this.customerThread = new Thread(customer);
    }

    // Method to start the ticket management system
    public void start() {
        System.out.println("Starting Ticket Manager...");

        // Start the vendor thread
        vendorThread.start();

        // Add a brief delay to ensure the vendor starts producing tickets
        try {
            Thread.sleep(1000); // 1-second delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Start the customer thread
        customerThread.start();
    }

    // Method to stop the ticket management system
    public void stop() {
        System.out.println("Stopping Ticket Manager...");

        // Stop vendor and customer
        vendor.stop();
        customer.stop();

        // Wait for both threads to finish
        try {
            vendorThread.join();
            customerThread.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println("Ticket Manager stopped.");
    }
}
