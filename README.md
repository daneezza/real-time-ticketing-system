# Ticket Manager CLI 
A command-line interface (CLI) application to manage ticket sales and purchases, featuring thread synchronization, logging, and user command handling. This project requires

## Features 
- **Ticket Management**: Handles the release and purchase of tickets using multithreading. 
- **Thread Synchronization**: Ensures safe access to shared resources. 
- **Logging**: Logs user inputs, actions taken by the Vendor and Customer, and system outputs to respective log files. 
- **Commands**: Supports commands to start, stop the ticket manager. 
- **Error Handling**: Gracefully handles invalid commands and exceptions.





## Prerequisties
- **JDK 23**: Ensure JDK 23 is installed on your system. You can download it from the [Oracle website](https://www.oracle.com/java/technologies/javase-jdk23-downloads.html). 
## Getting Started

### Clone the Repository 
``` 
git clone https://github.com/daneezza/real-time-ticketing-system.git
cd real-time-ticketing-system
```

### Compile the Project
Ensure you have JDK 23 installed and set up your JAVA_HOME environment variable accordingly.

```
javac *.java
```

### Run the Application
```
java Main
```

### Usage
**1. Start the CLI:** Run the application to start the Ticket Manager CLI.

**2. Enter Ticket Details:** Follow the prompts to enter the total number of tickets, ticket release rate, customer buy rate, and max ticket capacity.

**3. Start the Ticket Manager:** Type start to begin the ticket management process.

**4. Commands:** 
- **exit:** *Stop Exits the application.*

**5. Logging:** Check log.txt, vendor_log.txt, and customer_log.txt for logs of user inputs and system actions.

## Project Structure
- **Main.java:** Handles user inputs and initializes the ticket manager.

- **Ticket.java:** Represents individual tickets.

- **TicketManager.java:** Manages ticket vending and purchasing.

- **Vendor.java:** Handles ticket release.

- **Customer.java:** Handles ticket purchase.
