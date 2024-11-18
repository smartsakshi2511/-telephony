// src/components/Layout.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import "./Layout.scss";

const Layout = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  return (
    <div className="layout">
       <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>

      <div className="mainContent">
        <Navbar  OpenSidebar={OpenSidebar} />
        <div className="outlet">
          <Outlet /> {/* Routed content will appear here */}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Layout);
