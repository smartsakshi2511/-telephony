import { useState, useCallback } from "react";
import React from "react";
import { Outlet } from "react-router-dom";
import AgentNavbar from "../components/navbar/AgentNavbar";
import AgentSidebar from "../components/sidebar/AgentSidebar";
import VerificationModal from "../components/navbar/verify";
import LeadFormModal from "../components/Form/LeadForm";
import CustomSpeedDial from "../components/navbar/SpeedDial";

const AgentRoute = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [openLeadForm, setOpenLeadForm] = useState(false); // NEW



  const toggleSidebar = useCallback(() => {
    setOpenSidebarToggle((prev) => !prev);
  }, []);
  return (
    <div className="layout">
      <AgentSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={toggleSidebar} onVerifyClick={() => setOpenVerify(true)} onLeadFormClick={() => setOpenLeadForm(true)}/>

      <div className="mainContent">
        <AgentNavbar
          OpenSidebar={toggleSidebar}
        />
        <div className="outlet">
          <Outlet />
        </div>
        <CustomSpeedDial />
      </div>

      <LeadFormModal open={openLeadForm} onClose={() => setOpenLeadForm(false)} />
      <VerificationModal open={openVerify} onClose={() => setOpenVerify(false)} />
    </div>
  );
};

export default React.memo(AgentRoute);
