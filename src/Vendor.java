import java.util.concurrent.BlockingQueue;

// The Vendor class implements Runnable to allow it to run in a separate thread
public class Vendor implements Runnable {
    // Queue to hold the tickets being sold
    private final BlockingQueue<Ticket> ticketQueue;

    // Pool of tickets ready to be released
    private final BlockingQueue<Ticket> ticketPool;

    // Rate at which tickets are released (tickets per second)
    private final int releaseRate;

    // Total number of tickets to be released
    private final int totalTickets;

    // A flag to control the running state of the vendor
    private volatile boolean isRunning;

    // Constructor to initialize the vendor with the given parameters
    public Vendor(BlockingQueue<Ticket> ticketQueue, BlockingQueue<Ticket> ticketPool, int releaseRate, int totalTickets) {
        this.ticketQueue = ticketQueue;
        this.ticketPool = ticketPool;
        this.releaseRate = releaseRate;
        this.totalTickets = totalTickets;
        this.isRunning = true;
    }

    // Method to stop the vendor from releasing more tickets
    public void stop() {
        isRunning = false;
    }

    // The run method is executed when the vendor thread is started
    @Override
    public void run() {
        try {
            // Loop to release tickets until the total count is reached or stopped
            for (int i = 1; i <= totalTickets && isRunning; i++) {
                Ticket ticket = new Ticket(i);
                // Try to add the ticket to the queue, if full add it to the pool
                synchronized (ticketQueue){
                    if (!ticketQueue.offer(ticket)) {
                        ticketPool.put(ticket);
                        System.out.println("[Vendor] Queue full. Added to pool: " + ticket);
                        Main.log("[Vendor] Queue full. Added to pool: " + ticket);
                    } else {
                        System.out.println("[Vendor] Added to queue: " + ticket);
                        Main.log("[Vendor] Added to queue: " + ticket);
                    }
                }
                // Pause for a duration based on the release rate
                Thread.sleep(1000 / releaseRate);
            }
            System.out.println("[Vendor] All tickets released.");
            Main.log("[Vendor] All tickets released.");
            // Stop the vendor after all tickets are released
            isRunning = false;
        } catch (InterruptedException e) {
            // Handle interruption during sleep or other operations
            Thread.currentThread().interrupt();
        }
    }
}
