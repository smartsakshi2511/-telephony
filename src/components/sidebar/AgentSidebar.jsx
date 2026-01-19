import React, { useContext, useState, useEffect } from "react";
import "./sidebar.scss";
import axios from "axios";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CallIcon from "@mui/icons-material/Call";
import GroupIcon from "@mui/icons-material/Call";
import BarChartIcon from "@mui/icons-material/BarChart";

import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import BlockIcon from "@mui/icons-material/Block";
import { Link, useLocation } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { Tooltip } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AuthContext } from "../../context/authContext";

const AgentSidebar = ({
  openSidebarToggle,
  OpenSidebar,
  onLeadFormClick,
  onVerifyClick,
}) => {
  const { dispatch } = useContext(DarkModeContext);
  const location = useLocation();
  const { user, permissions } = useContext(AuthContext);
  const [logo, setLogo] = useState("");
  useEffect(() => {
    if (user?.admin) {
      const token = localStorage.getItem("token");
      axios
        .get(`https://${window.location.hostname}:4000/logo/${user.admin}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data?.admin_logo) {
            setLogo(
              `https://${window.location.hostname}:4000${res.data.admin_logo}`
            );
          }
        })
        .catch((err) => {
          console.error("Error fetching logo:", err);
        });
    }
  }, [user]);

  const hasPermission = (key) => {
    if (permissions?.[key] === 0) return false; // explicitly disabled
    return true; // default true for undefined or 1
  };

  const tooltipTitles = {
    dashboard: "View your dashboard",
    dataUpload: "Upload necessary data",
    callReport: "View call reports",
    leadReport: "View lead reports",
    blockNumber: "Block specific numbers",
    fieldExecutive: "View Field Executives", // 👈 New tooltip
    profile: "View and edit your profile",
    verify: "Verify Your Detail",
    leadForm: "Lead Form",
    logout: "Logout from the application",
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="top">
        <Link to="/agent" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img
              className="logo-img"
              src={logo || `${process.env.PUBLIC_URL}/logo.png`} // fallback
              alt="Logo"
              style={{
                height: "50px",
                width: "80%",
                marginTop: "24px",
                objectFit: "contain",
              }}
            />
          </span>
        </Link>
        <span className="close-icon-container">
          <CloseIcon className="icon close_icon" onClick={OpenSidebar} />
        </span>
      </div>
      <hr />

      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Tooltip title={tooltipTitles.dashboard} placement="right" arrow>
            <Link to="/agent" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/") ? "active" : ""}>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
          </Tooltip>

          <p className="title">LISTS</p>

          {hasPermission("data_upload") && (
            <Tooltip title={tooltipTitles.dataUpload} placement="right" arrow>
              <Link to="/agent/dataUpload" style={{ textDecoration: "none" }}>
                <li
                  className={isActiveRoute("/agent/dataUpload") ? "active" : ""}
                >
                  <CloudUploadIcon className="icon" />
                  <span>Data Upload</span>
                </li>
              </Link>
            </Tooltip>
          )}

          {hasPermission("report_view") && (
            <>
              <Tooltip title={tooltipTitles.callReport} placement="right" arrow>
                <Link
                  to="/agent/call_report"
                  style={{ textDecoration: "none" }}
                >
                  <li
                    className={
                      isActiveRoute("/agent/callReport") ? "active" : ""
                    }
                  >
                    <CallIcon className="icon" />
                    <span>Call Report</span>
                  </li>
                </Link>
              </Tooltip>
            </>
          )}

          {hasPermission("block_no") && (
            <Tooltip title={tooltipTitles.blockNumber} placement="right" arrow>
              <Link to="/agent/blockList" style={{ textDecoration: "none" }}>
                <li
                  className={isActiveRoute("/agent/blockList") ? "active" : ""}
                >
                  <BlockIcon className="icon" />
                  <span>Block Number</span>
                </li>
              </Link>
            </Tooltip>
          )}

          {/* {hasPermission("lead_form") && (
            <Tooltip title={tooltipTitles.verify} placement="right" arrow>
              <Link to={`/agent/verify`} style={{ textDecoration: "none" }}>
                <li className={isActiveRoute(`/agent/verify`) ? "active" : ""}>
                  <BarChartIcon className="icon" />
                  <span>Verify Report</span>
                </li>
              </Link>
            </Tooltip>
          )}
  */}

          <Tooltip title={tooltipTitles.leadReport} placement="right" arrow>
            <li onClick={onLeadFormClick} style={{ cursor: "pointer" }}>
              <InsertChartOutlinedIcon className="icon" />
              <span>Lead Form</span>
            </li>
          </Tooltip>

          {hasPermission("lead_report") && (
  <Tooltip title={tooltipTitles.leadReport} placement="right" arrow>
    <Link to="/agent/leadReportList" style={{ textDecoration: "none" }}>
      <li className={isActiveRoute("/agent/leadReportList") ? "active" : ""}>
        <InsertChartOutlinedIcon className="icon" />
        <span>Lead Report</span>
      </li>
    </Link>
  </Tooltip>
)}

        </ul>
      </div>
    </div>
  );
};

export default AgentSidebar;
