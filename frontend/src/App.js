import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [ws, setWs] = useState(null);
    const [data, setData] = useState([0, 0, 0, 0, {}, {}]);
    const [timeData, setTimeData] = ([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3001");

        socket.onopen = () => {
            console.log("Connected to the WebSocket Server...");
        }

        socket.onmessage = (event) => {
            const ticketData = JSON.parse(event.data); // Converts the incoming Websocket message into a JS object
            setData(ticketData);

            const totalTicketSales = ticketData[1] - ticketData[2]; // Using data[1] - data[2] because data state hasn't been updated yet when the code executed.
            setTimeData((prev) => [
                ...prev, { time: new Date().toLocaleTimeString, sales: totalTicketSales }
            ]);
        };

        socket.onerror = (error) => {
            console.log("Web Socket Error! : ",error)
            alert("Network Error Occured!")
        };

        socket.onclose = () => {
            console.log("Disconnected from WebSocket Server!");
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);




}

export default App;
