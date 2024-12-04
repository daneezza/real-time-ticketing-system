import { useState } from "react";

function SystemConfigurationForm() {
    const [ configFormData, setConfigFormData] = useState({
        totalTicketCount: "",
        rateOfTicketReleasing: "",
        rateOfCustomerRetrieval: "",
        maximumTicketCapacity: "",
        numOfVendors: "",
        numOfCustomer: ""
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
            numOfCustomer: ""
        });
    };

    // Handler to start the simulation
    const handleStart = () => {
        // Send a fetch request to the local server with all configuration parameters
        fetch(
            `http://localhost:3001?totalTicketCount=${configFormData.totalTicketCount}&ticketReleaseRate=${configFormData.rateOfTicketReleasing}
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
        fetch("https://localhost:3001/stop")
            .then((res) => res.text())
            .then((text) => console.log(text))
            .catch((error) => console.log(error))
    };

    //Render methods should be here. Up next

}

export default SystemConfigurationForm;