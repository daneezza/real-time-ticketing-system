import { useState } from "react";

function SystemConfigurationForm() {
    const [ configFormData, setConfigFormData] = useState({
        totalTicketCount: "",
        rateOfTicketReleasing: "",
        rateOfCustomerRetrieval: "",
        maximumTicketCapacity: "",
        numOfVendors: "",
        numOfCustomer: "",
    });

    // Handler for input changes in form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Spread the previous data and update the specific field dynamically
        setConfigFormData((previousData) => ({
            ...previousData, 
            [name]: value,
        }));
    };

    // Handler to reset all form fields to empty strings
    const handleReset = () => {
        setConfigFormData({
            totalTicketCount: "",
            rateOfTicketReleasing: "",
            rateOfCustomerRetrieval: "",
            maximumTicketCapacity: "",
            numOfVendors: "",
            numOfCustomer: "",
        });
    };

    // Handler to start the simulation
    const handleStart = () => {
        // Send a fetch request to the local server with all configuration parameters
        fetch(
            `http://localhost:3000?totalTicketCount=${configFormData.totalTicketCount}&ticketReleaseRate=${configFormData.rateOfTicketReleasing}
            &customerRetrieveRate=${configFormData.rateOfCustomerRetrieval}&maxTicketCapacity=${configFormData.maximumTicketCapacity}
            &numberOfVendors=${configFormData.numOfVendors}&numberOfCustomers=${configFormData.numOfCustomer}`
        )
            .then((res) => res.text())
            .then((text) => {
                if (text === "System currently executing...") {
                    console.log(text);
                } else {
                    // If not running, reset the graph and log the response
                    // ------------ add reset graph function after implemented to show reset graph after restart system again.
                    console.log(text);
                }
            })
            .catch((error) => console.log(error));
    };

    // Handler to stop the simulation
    const handleStop = () => {
        fetch("https://localhost:3000/stop")
            .then((res) => res.text())
            .then((text) => console.log(text))
            .catch((error) => console.log(error))
    };

    return (
        <div style={{width: "25%", margin: "2%"}}>
            <center>
                <h4>Configuration Dashboard</h4>
            </center>
            <br/>
            
            <div className="form-floating mb-3">
                <input 
                    type="number" 
                    className="form-control" 
                    name="totalTicketCount" 
                    value={configFormData.totalTicketCount}
                    onChange={handleInputChange}
                    placeholder="Total Tickets Count"
                    min={1}
                />
                <label htmlFor="floatingInput">Total Ticket Count</label>
            </div>

            <div className="form-floating mb-3">
                <input 
                    type="number" 
                    className="form-control" 
                    name="rateOfTicketReleasing" 
                    value={configFormData.rateOfTicketReleasing}
                    onChange={handleInputChange}
                    placeholder="Ticket Rele Rate ( Seconds )"
                    min={1}
                />
                <label htmlFor="floatingInput">Ticket Release Rate ( Seconds )</label>
            </div>

            <div className="form-floating mb-3">
                <input 
                    type="number" 
                    className="form-control" 
                    name="rateOfCustomerRetrieval" 
                    value={configFormData.rateOfCustomerRetrieval}
                    onChange={handleInputChange}
                    placeholder="Customer Retrieval Rate ( Seconds )"
                    min={1}
                />
                <label htmlFor="floatingInput">Customer Retrieval Rate ( Seconds )</label>
            </div>

            <div className="form-floating mb-3">
                <input 
                    type="number" 
                    className="form-control" 
                    name="maximumTicketCapacity" 
                    value={configFormData.maximumTicketCapacity}
                    onChange={handleInputChange}
                    placeholder="Maximum Ticket Capacity"
                    min={1}
                />
                <label htmlFor="floatingInput">Maximum Ticket Capacity</label>
            </div>

            <div className="form-floating mb-3">
                <input 
                    type="number" 
                    className="form-control" 
                    name="numOfVendors" 
                    value={configFormData.numOfVendors}
                    onChange={handleInputChange}
                    placeholder="Number of Vendors"
                    min={1}
                />
                <label htmlFor="floatingInput">Number of Vendors</label>
            </div>

            <div className="form-floating mb-3">
                <input 
                    type="number" 
                    className="form-control" 
                    name="numOfCustomer" 
                    value={configFormData.numOfCustomer}
                    onChange={handleInputChange}
                    placeholder="Number of Customers"
                    min={1}
                />
                <label htmlFor="floatingInput">Number of Customers</label>
            </div>

            <div className="buttons">
                <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleStart}
                >
                Start
                </button>
                <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleReset}
                >
                Reset
                </button>
                <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleStop}
                >
                Stop
                </button>
            </div>

        </div>
    );

}

export default SystemConfigurationForm;