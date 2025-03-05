import React, { useState, useEffect } from "react";
import axios from "axios";

const Test = () => {
  const [message, setMessage] = useState("");
  const [msg2, setMsg2] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:7777") // Backend URL
      .then((response) => {
        setMessage(response.data); // Set response data to state
      })
      .catch((error) => {
        console.error("Error connecting to backend:", error);
        setMessage("Failed to connect to backend!");
      });
  }, []);



  useEffect(() => {
    axios
      .get("http://localhost:7777/test/123456") // Backend URL
      .then((response) => {
        setMsg2(response.data); // Set response data to state
      })
      .catch((error) => {
        console.error("Error connecting to backend:", error);
        setMsg2("Failed to connect to backend!");
      });
  }, []);

  return (
    <div>
      <h2>Backend Connection Test</h2>
      <p>Response from Backend: {message}</p>
      <p>Response from Backend with ID : {msg2}</p>
    </div>
  );
};

export default Test;
