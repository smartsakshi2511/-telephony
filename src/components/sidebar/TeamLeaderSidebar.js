import "./sidebar.scss";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CallIcon from "@mui/icons-material/Call";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import BlockIcon from "@mui/icons-material/Block";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";

const TeamSidebar = ({ openSidebarToggle, OpenSidebar }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [logo, setLogo] = useState(null); // ✅ declare state for logo

  const tooltipTitles = {
    dashboard: "View your dashboard",
    agentsList: "Manage and view agents",
    dataUpload: "Upload necessary data",
    callReport: "View call reports",
    leadReport: "View lead reports",
    blockNumber: "Block specific numbers",
    disposition: "Manage dispositions",
    avrConverter: "Convert IVR files",
  };

  const isActiveRoute = (path) => location.pathname === path;

  useEffect(() => {
    if (user?.admin) {
      const token = localStorage.getItem("token");
      axios
        .get(`https://${window.location.hostname}:4000/logo/${user.admin}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.admin_logo) {
            setLogo(
              `https://${window.location.hostname}:4000${res.data.admin_logo}`
            );
          }
        })
        .catch((err) => console.error("Error fetching logo:", err));
    }
  }, [user]);

  return (
    <div id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="top">
        <Link to="/team_leader" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img
              className="logo-img"
              src={logo || `${process.env.PUBLIC_URL}/logo.png`}
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
            <Link to="/team_leader" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/team_leader") ? "active" : ""}>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
          </Tooltip>

          <p className="title">LISTS</p>
          <Tooltip title={tooltipTitles.agentsList} placement="right" arrow>
            <Link to="/team_leader/agent" style={{ textDecoration: "none" }}>
              <li
                className={isActiveRoute("/team_leader/agent") ? "active" : ""}
              >
                <PersonOutlineIcon className="icon" />
                <span>Agents List</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.dataUpload} placement="right" arrow>
            <Link to="/team_leader/dataUpload" style={{ textDecoration: "none" }}>
              <li
                className={
                  isActiveRoute("/team_leader/dataUpload") ? "active" : ""
                }
              >
                <CloudUploadIcon className="icon" />
                <span>Data Upload</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.callReport} placement="right" arrow>
            <Link to="/team_leader/call_report" style={{ textDecoration: "none" }}>
              <li
                className={
                  isActiveRoute("/team_leader/call_report") ? "active" : ""
                }
              >
                <CallIcon className="icon" />
                <span>Call Report</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.leadReport} placement="right" arrow>
            <Link
              to="/team_leader/verify"
              style={{ textDecoration: "none" }}
            >
              <li
                className={
                  isActiveRoute("/team_leader/verify") ? "active" : ""
                }
              >
                <InsertChartOutlinedIcon className="icon" />
                <span>Verify Report</span>
              </li>
            </Link>
          </Tooltip>

          <p className="title">SERVICE</p>
          <Tooltip title={tooltipTitles.blockNumber} placement="right" arrow>
            <Link to="/team_leader/blockList" style={{ textDecoration: "none" }}>
              <li
                className={
                  isActiveRoute("/team_leader/blockList") ? "active" : ""
                }
              >
                <BlockIcon className="icon" />
                <span>Block Number</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.disposition} placement="right" arrow>
            <Link
              to="/team_leader/dispositionList"
              style={{ textDecoration: "none" }}
            >
              <li
                className={
                  isActiveRoute("/team_leader/dispositionList") ? "active" : ""
                }
              >
                <ListAltIcon className="icon" />
                <span>Disposition</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.avrConverter} placement="right" arrow>
            <Link to="/team_leader/ivrList" style={{ textDecoration: "none" }}>
              <li
                className={isActiveRoute("/team_leader/ivrList") ? "active" : ""}
              >
                <SwapCallsIcon className="icon" />
                <span>IVR Converter</span>
              </li>
            </Link>
          </Tooltip>
        </ul>
      </div>
    </div>
  );
};

export default TeamSidebar;
