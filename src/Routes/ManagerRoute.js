import { useState, useCallback } from "react";
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

const ManagerRoute = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
 
  const toggleSidebar = useCallback(() => {
    setOpenSidebarToggle((prev) => !prev);
  }, []);

  return (
    <div className="layout">
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={toggleSidebar} />

      <div className="mainContent">
        <Navbar OpenSidebar={toggleSidebar} />
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default React.memo(ManagerRoute);
