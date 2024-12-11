// Define the Ticket class which implements the Comparable interface
public class Ticket implements Comparable<Ticket> {
    // Private final field for ticket ID
    private final int id;

    // Constructor to initialize the ticket ID
    public Ticket(int id) {
        this.id = id;
    }

    // Override the compareTo method to compare tickets based on their ID
    @Override
    public int compareTo(Ticket other) {
        return Integer.compare(this.id, other.id);
    }

    // Override the toString method to provide a string representation of the ticket
    @Override
    public String toString() {
        return "Ticket{id=" + id + "}";
    }
}