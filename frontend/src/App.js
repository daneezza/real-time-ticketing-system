import React, { useEffect, useState } from "react";
import ConfigForm from "./SystemConfigurationForm.js";
import { Line } from "react-chartjs-2";
import "../src/App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function App() {
  const [data, setData] = useState([0, 0, 0, 0, {}, {}]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const vendors = JSON.parse(event.data);
      setData(vendors);

      const totalSales = vendors[1] - vendors[2]; //Can not data[1] - data[2] because data update after
      setTimeData((prev) => [
        ...prev,
        { time: new Date().toLocaleTimeString(), sales: totalSales },
      ]);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
      alert("Network error");
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
    if (socket.readyState === WebSocket.OPEN) {  
      socket.close();
    }
    }
  }, []);


  useEffect(() => {
    if (data[0] === data[1] - data[2]) {
      fetch("http://localhost:3000/stop")
        .then((res) => res.text())
        .then((text) => console.log(text))
        .catch((error) => console.log(error));
    }
  }, [data]);
  

  const chartData = {
    labels: timeData.map((entry) => entry.time),
    datasets: [
      {
        label: "Sale Ticket Count",
        data: timeData.map((entry) => entry.sales),
        borderColor: "black",
        backgroundColor: "lightblue",
        fill: true,
      },
    ],
  };

  const resetgraph = () => {
    setTimeData([]);
  };

  return (

    <div className="background">
      <link rel="icon" type="image/x-icon" href="https://www.pngkey.com/detail/u2q8e6q8w7e6o0r5_ticketing-system-icon-green-ticket-icon-png"></link>

      <div id='title-webapp'>
        <h1>EventPulse Ticketing System</h1>
      </div>
      

      <div style={{ display: "flex" }}>
        <ConfigForm resetgraph={resetgraph} />      

        <div className="chart" style={{ marginTop: "2%", marginRight: "1%", marginLeft: "1%", width: "45%" }}>
          <center>
            <h4>Sale Ticket Count Over Time</h4>
          </center>
          <br/>
          <Line data={chartData} />

          {data[3] === data[2] && timeData.length ? (
            <p
              style={{
                color: "red",
                fontFamily: "Arial",
                textAlign: "center",
                fontWeight: "bold",
                letterSpacing: "3px",
              }}
            >
              Ticket pool fill
            </p>
          ) : (
            <p></p>
          )}
          {data[0] === data[1] - data[2] && timeData.length ? (
            <p
              style={{
                color: "blue",
                fontFamily: "Arial",
                textAlign: "center",
                fontWeight: "bold",
                letterSpacing: "3px",
              }}
            >
              Sold all tickets
            </p>
          ) : (
            <p></p>
          )}
          <table className="summary-table" style={{ marginTop: "20px" }}>
            <tbody>
              <tr>
                <td>Total Ticket Count</td>
                <td> : {data[0]}</td>
              </tr>
              <tr>
                <td>Maximum Ticket Capacity</td>
                <td> : {data[3]}</td>
              </tr>
              <tr>
                <td>Total Add Ticket Count</td>
                <td> : {data[1]}</td>
              </tr>
              <tr>
                <td>Total Sale Ticket Count</td>
                <td> : {data[1] - data[2]}</td>
              </tr>
              <tr>
                <td>Remaining Ticket Count</td>
                <td> : {data[2]}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="tickets-board" style={{marginTop: "2%", marginRight: "1%"}}>
          <center>
            <h4>Tickets Board</h4>
          </center>
          <br/>

          <table className="ticket-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "center" }}>Add Ticket Count</th>
                <th style={{ textAlign: "center" }}>Sale Ticket Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data[4]).map((key) => (
                <tr key={key}>
                  <td>Vendor {key}</td>
                  <td style={{ textAlign: "center" }}>{data[4][key].add}</td>
                  <td style={{ textAlign: "center" }}>{data[4][key].sale}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <table className="ticket-table">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "center" }}>Reserve Ticket Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data[5]).map((key) => (
                <tr key={key}>
                  <td>Customer {key}</td>
                  <td style={{ textAlign: "center" }}>{data[5][key].sale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default App;
