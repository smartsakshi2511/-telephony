import "./sidebar.scss";
import {   useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CampaignIcon from "@mui/icons-material/Campaign";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import DialpadIcon from "@mui/icons-material/Dialpad";
import GroupIcon from "@mui/icons-material/Group";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CallIcon from "@mui/icons-material/Call";
import BarChartIcon from "@mui/icons-material/BarChart";
import BlockIcon from "@mui/icons-material/Block";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { AuthContext } from "../../context/authContext";
import BadgeIcon from "@mui/icons-material/Badge";

const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {
  const { user, permissions } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
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
          setLogo(`https://${window.location.hostname}:4000${res.data.admin_logo}`);
        }
      })
      .catch((err) => {
        console.error("Error fetching logo:", err);
      });
  }
}, [user]);

  const hasPermission = (key) => {
    // Agar admin (user_type = "8") hai to by default permission allow karo
    if (user?.user_type === "8" || user?.user_type === "7") return true;
    return permissions?.[key] === 1;
  };

  const basePath =
    user?.user_type === "8"
      ? "admin"
      : user?.user_type === "7"
      ? "manager"
      : "admin";

  const isActiveRoute = (path) => location.pathname === path;

  const tooltipTitles = {
    dashboard: "View your dashboard",
    agentsList: "Manage and view agents",
    campaigns: "View and create campaigns",
    dtmf: "Configure DTMF extensions",
    group: "Manage user groups",
    dataUpload: "Upload necessary data",
    callReport: "View call reports",
    leadReport: "View lead reports",
    blockNumber: "Block specific numbers",
    disposition: "Manage dispositions",
    ivrConverter: "Convert IVR files",
    smsTemplate: "Message Templates",
    fieldExecutives: "View list of Field Executives",
  };

  const handleAgentClick = () => {
    navigate(`/${basePath}/agent`);
  };

  return (
    <div id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="top">
        <Link to={`/${basePath}`} style={{ textDecoration: "none" }}>
          <span className="logo">
            <img
              className="logo-img"
            src={logo || "/logo.png"}
              alt="Logo"
            />
          </span>
        </Link>
        <span className="close-icon-container">
          <CloseIcon className="icon close_icon" onClick={OpenSidebar} />
        </span>
      </div>

      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Tooltip title={tooltipTitles.dashboard} placement="right" arrow>
            <Link to={`/${basePath}`} style={{ textDecoration: "none" }}>
              <li className={isActiveRoute(`/${basePath}`) ? "active" : ""}>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
          </Tooltip>

          <p className="title">LISTS</p>

          {hasPermission("agent_management") && (
            <Tooltip title={tooltipTitles.agentsList} placement="right" arrow>
              <li className="sidebar-link" onClick={handleAgentClick}>
                <PeopleIcon className="icon" />
                <span>Users List</span>
              </li>
            </Tooltip>
          )}



          {hasPermission("campaign") && (
            <Tooltip title={tooltipTitles.campaigns} placement="right" arrow>
              <Link
                to={`/${basePath}/campaign`}
                style={{ textDecoration: "none" }}
              >
                <li
                  className={
                    isActiveRoute(`/${basePath}/campaign`) ? "active" : ""
                  }
                >
                  <CampaignIcon className="icon" />
                  <span>Campaigns</span>
                </li>
              </Link>
            </Tooltip>
          )}

          {hasPermission("dtmf") && (
            <Tooltip title={tooltipTitles.dtmf} placement="right" arrow>
              <Link
                to={`/${basePath}/extension`}
                style={{ textDecoration: "none" }}
              >
                <li
                  className={
                    isActiveRoute(`/${basePath}/extension`) ? "active" : ""
                  }
                >
                  <DialpadIcon className="icon" />
                  <span>DTMF</span>
                </li>
              </Link>
            </Tooltip>
          )}

          {hasPermission("group") && (
            <Tooltip title={tooltipTitles.group} placement="right" arrow>
              <Link
                to={`/${basePath}/group`}
                style={{ textDecoration: "none" }}
              >
                <li
                  className={
                    isActiveRoute(`/${basePath}/group`) ? "active" : ""
                  }
                >
                  <GroupIcon className="icon" />
                  <span>Group</span>
                </li>
              </Link>
            </Tooltip>
          )}

          {hasPermission("data_upload") && (
            <Tooltip title={tooltipTitles.dataUpload} placement="right" arrow>
              <Link
                to={`/${basePath}/dataUpload`}
                style={{ textDecoration: "none" }}
              >
                <li
                  className={
                    isActiveRoute(`/${basePath}/dataUpload`) ? "active" : ""
                  }
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
                  to={`/${basePath}/call_report`}
                  style={{ textDecoration: "none" }}
                >
                  <li
                    className={
                      isActiveRoute(`/${basePath}/call_report`) ? "active" : ""
                    }
                  >
                    <CallIcon className="icon" />
                    <span>Call Report</span>
                  </li>
                </Link>
              </Tooltip>

              <Tooltip title={tooltipTitles.leadReport} placement="right" arrow>
                <Link
                  to={`/${basePath}/leadReportList`}
                  style={{ textDecoration: "none" }}
                >
                  <li
                    className={
                      isActiveRoute(`/${basePath}/leadReportList`)
                        ? "active"
                        : ""
                    }
                  >
                    <BarChartIcon className="icon" />
                    <span>Lead Report</span>
                  </li>
                </Link>
              </Tooltip> 
    
            </>
          )}

          {hasPermission("block_no") && (
            <Tooltip title={tooltipTitles.blockNumber} placement="right" arrow>
              <Link
                to={`/${basePath}/blockList`}
                style={{ textDecoration: "none" }}
              >
                <li
                  className={
                    isActiveRoute(`/${basePath}/blockList`) ? "active" : ""
                  }
                >
                  <BlockIcon className="icon" />
                  <span>Block Number</span>
                </li>
              </Link>
            </Tooltip>
          )}

          {hasPermission("disposition") && (
            <Tooltip title={tooltipTitles.disposition} placement="right" arrow>
              <Link
                to={`/${basePath}/dispositionList`}
                style={{ textDecoration: "none" }}
              >
                <li
                  className={
                    isActiveRoute(`/${basePath}/dispositionList`)
                      ? "active"
                      : ""
                  }
                >
                  <ListAltIcon className="icon" />
                  <span>Disposition</span>
                </li>
              </Link>
            </Tooltip>
          )}

          {hasPermission("ivr_converter") && (
            <Tooltip title={tooltipTitles.ivrConverter} placement="right" arrow>
              <Link
                to={`/${basePath}/ivrList`}
                style={{ textDecoration: "none" }}
              >
                <li
                  className={
                    isActiveRoute(`/${basePath}/ivrList`) ? "active" : ""
                  }
                >
                  <SwapCallsIcon className="icon" />
                  <span>IVR Converter</span>
                </li>
              </Link>
            </Tooltip>
          )}

          <Link to="/admin/user-details">
            <li
              className={isActiveRoute("/admin/user-details") ? "active" : ""}
            >
              <AssignmentIndIcon className="icon" />
              <span>Users Details</span>
            </li>
          </Link>

 
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
