import React, { useState } from "react";
import EmailSender from "./components/EmailSender";
import "./App.css";

function App() {
  const [selectedTab, setSelectedTab] = useState("manual");

  return (
    <div>
      <nav>
        <ul>
          <li
            className={selectedTab === "manual" ? "active-button" : "button"}
            onClick={() => setSelectedTab("manual")}
          >
            Manual
          </li>
          <li
            className={selectedTab === "json" ? "active-button" : "button"}
            onClick={() => setSelectedTab("json")}
          >
            JSON
          </li>
          <li
            className={selectedTab === "excel" ? "active-button" : "button"}
            onClick={() => setSelectedTab("excel")}
          >
            Excel
          </li>
        </ul>
      </nav>

      <EmailSender selectedTab={selectedTab} />
    </div>
  );
}

export default App;