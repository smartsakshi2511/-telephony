// src/components/Layout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import "./Layout.scss";

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="mainContent">
        <Navbar />
        <div className="outlet">
          <Outlet /> {/* Routed content will appear here */}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Layout);
