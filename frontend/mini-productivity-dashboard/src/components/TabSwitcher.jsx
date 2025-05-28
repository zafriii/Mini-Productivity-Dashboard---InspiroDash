import React, { useState } from "react";
import "./styles/Tabs.css"; 
import { NavLink, useLocation } from "react-router-dom";

const TabSwitcher = () => {
  const location = useLocation();
  const activeTab = location.pathname.includes("/goals") ? "goals" : "tasks";

  return (
    <div className="tab-container">
      <div className="tabs">
        <NavLink
          to="/tasks"
          className={`tab ${activeTab === "tasks" ? "active" : ""}`}
        >
          Daily Tasks
        </NavLink>
        <NavLink
          to="/goals"
          className={`tab ${activeTab === "goals" ? "active" : ""}`}
        >
          Goals
        </NavLink>
        <div className={`underline ${activeTab}`}></div>
      </div>
    </div>
  );
};



export default TabSwitcher;
