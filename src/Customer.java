import java.util.concurrent.BlockingQueue;

// The Customer class implements Runnable to allow it to run in a separate thread
public class Customer implements Runnable {
    // Queue to hold the tickets being sold
    private final BlockingQueue<Ticket> ticketQueue;

    // Pool of tickets ready to be released
    private final BlockingQueue<Ticket> ticketPool;

    // Rate at which customers buy tickets (tickets per second)
    private final int buyRate;

    // A flag to control the running state of the customer
    private volatile boolean isRunning;

    // Constructor to initialize the customer with the given parameters
    public Customer(BlockingQueue<Ticket> ticketQueue, BlockingQueue<Ticket> ticketPool, int buyRate) {
        this.ticketQueue = ticketQueue;
        this.ticketPool = ticketPool;
        this.buyRate = buyRate;
        this.isRunning = true;
    }

    // Method to stop the customer from buying more tickets
    public void stop() {
        isRunning = false;
    }

    // The run method is executed when the customer thread is started
    @Override
    public void run() {
        try {
            // Loop to buy tickets while the customer is running
            while (isRunning) {
                // Attempt to retrieve a ticket from the queue
                Ticket ticket = ticketQueue.poll();

                // If the queue is empty, try to retrieve from the pool
                synchronized (ticketQueue) {
                    if (ticket == null && !ticketPool.isEmpty()) {
                        ticket = ticketPool.poll();
                        System.out.println("[Customer] Retrieved from pool: " + ticket);
                        Main.log("[Customer] Retrieved from pool: " + ticket);
                        // If a ticket is retrieved, print a message
                    } else if (ticket != null) {
                        System.out.println("[Customer] Retrieved: " + ticket);
                        Main.log("[Customer] Retrieved: " + ticket);
                        // If no tickets are available in both queue and pool, check if all tickets are bought
                    } else if (ticketQueue.isEmpty()) {
                        System.out.println("[Customer] No tickets available. All tickets bought.");
                        System.out.println("Command: 'exit'");
                        Main.log("[Customer] No tickets available. All tickets bought.");
                        break; // Exit the loop if all tickets are bought
                        // If no tickets are available, but not all are bought yet, print a waiting message
                    } else {
                        System.out.println("[Customer] No tickets available. Waiting...");
                        Main.log("[Customer] No tickets available. Waiting...");
                    }
                }
                // Pause for a duration based on the buy rate
                Thread.sleep(1000 / buyRate);
            }
        } catch (InterruptedException e) {
            // Handle interruption during sleep or other operations
            Thread.currentThread().interrupt();
        }
    }
}
