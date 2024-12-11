# Real-Time Event Ticketing System 🎟️

A comprehensive real-time platform for managing event ticketing, built with Node.js, Express, React.js, and Java for Command Line Interface. This system ensures smooth ticket purchasing, real-time updates on seat availability, and robust transaction handling.

## Features

- Real-time ticket generation and purchasing.
- WebSocket communication for live updates.
- Controlled ticket flow with maximum capacity handling.
- Multi-vendor and multi-customer support.
- Frontend visualization using

## Setup Instructions

### Prerequisites

- **Node.js Version:** 14.x or higher
- **NPM:** 6.x or higher

### How to Build and Run the Application

1. **Clone the repository:**

    ```sh
    git clone https://github.com/daneezza/real-time-ticketing-system.git
    cd real-time-ticketing-system
    ```

2. **Set up the backend:**

    - Navigate to the backend directory:
      ```sh
      cd backend
      ```

    - Install dependencies:
        ```sh
      npm install
        ```

    - Start the backend server:
        ```sh
       npm start
        ```

3. **Set up the frontend:**

    - Navigate to the frontend directory:
        ```sh
      cd frontend
        ```

    - Install dependencies:
        ```sh
       npm install
        ```

    - Start the frontend development server:
        ```sh
       npm start
        ```

## Usage Instructions

### How to Configure and Start the System

1. **Start the backend server:**

    ```sh
    cd backend
    npm start
    ```

2. **Start the frontend server:**

    ```sh
    cd frontend
    npm start
    ```

3. **Access the application:**
    Open your web browser and navigate to `http://localhost:3000`.

### Explanation of UI Controls

- **Dashboard:**
  - **Start System Button:** Initiates the ticketing system. Ensure you configure the necessary parameters.
  - **Reset System Button:** Resets the System Configuration Form.
  - **Stop System Button:** Terminates the current ticketing session and resets the system.

- **System Configuration:**
  - **Total Ticket Count:** Total number of tickets available for the event.
  - **Ticket Release Rate:** Rate at which vendors generate new tickets.
  - **Customer Retrieve Rate:** Rate at which customers purchase tickets.
  - **Maximum Ticket Capacity:** Maximum number of tickets that can be held.
