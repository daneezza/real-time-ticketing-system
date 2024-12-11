import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;

public class Main {
    private static PrintWriter logWriter; // PrintWriter for logging

    public static void main(String[] args) {
        try {
            // Initialize the log file writer
            logWriter = new PrintWriter(new FileWriter("log.txt", false));

            Scanner scanner = new Scanner(System.in); // Scanner for user input

            // Collect input for ticket details
            System.out.println("=== Ticket Manager CLI ===");
            log("=== Ticket Manager CLI ===");

            // Prompt for the total number of tickets
            int totalTickets = promptForInt(scanner, "Enter total number of tickets: ", Integer.MAX_VALUE);

            // Prompt for the ticket release rate
            int ticketReleaseRate = promptForInt(scanner, "Enter ticket release rate (tickets/sec): ", 100);

            // Prompt for customer buy rate ensuring it is lower than the release rate
            int customerBuyRate = promptForInt(scanner, "Enter customer buy rate (must be lower than release rate): ", ticketReleaseRate - 1);

            // Prompt for the maximum ticket capacity
            int maxTicketCapacity = promptForInt(scanner, "Enter max ticket capacity: ", totalTickets);

            // Ask the user to type "start" after inputs are entered
            System.out.println("\n=== All inputs collected ===");
            log("\n=== All inputs collected ===");
            System.out.println("To begin the ticket manager, type 'start' and press Enter.");

            // Wait for the user to type "start"
            while (true) {
                String startCommand = scanner.nextLine().trim().toLowerCase();
                if (startCommand.equals("start")) {
                    break; // Break the loop and start the ticket manager
                } else {
                    System.err.println("Invalid Command! Please type 'start' to begin the program.");
                }
            }

            // Now proceed with the ticket manager setup and start the system
            try {
                TicketManager manager = new TicketManager(totalTickets, ticketReleaseRate, customerBuyRate, maxTicketCapacity);
                manager.start(); // Start the ticket manager

                while (true) {
                    String command = scanner.nextLine().trim().toLowerCase();
                    if (command.equals("exit")) {
                        manager.stop();
                        log("Exiting System...");
                        logWriter.close();
                        System.exit(0); // Exit the program
                    } else {
                        System.err.println("Invalid command! Try Again!");
                    }
                }

            } catch (IllegalArgumentException e) {
                // Handle any illegal argument exceptions
                System.err.println("Error: " + e.getMessage());
                log("Error: " + e.getMessage());
            }
        } catch (IOException e) {
            // Handle any IO exceptions
            System.err.println("Error initializing log file: " + e.getMessage());
        }
    }

    // Method to prompt for integer input with validation
    private static int promptForInt(Scanner scanner, String prompt, int max) {
        int value;
        while (true) {
            try {
                System.out.print(prompt);
                log(prompt);
                value = Integer.parseInt(scanner.nextLine());
                log("User input: " + value);
                if (value >= 1 && value <= max) {
                    break; // Valid input
                } else {
                    System.err.println("Value must be between " + 1 + " and " + max + ".");
                }
            } catch (NumberFormatException e) {
                // Handle invalid number format
                System.err.println("Invalid input. Please enter a number.");
            }
        }
        return value;
    }

    // Method to log messages to the log file
    public static void log(String message) {
        logWriter.println(message);
        logWriter.flush();
    }
}
