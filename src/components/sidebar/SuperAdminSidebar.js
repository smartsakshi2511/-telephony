import "./sidebar.scss";
import { Link, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailIcon from "@mui/icons-material/Email"; // ✅ for Email
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; // ✅ for Users
import CampaignIcon from "@mui/icons-material/Campaign";
import DialpadIcon from "@mui/icons-material/Dialpad";
import GroupIcon from "@mui/icons-material/Group";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // ✅ keep only for Data Upload
import CallIcon from "@mui/icons-material/Call";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import BlockIcon from "@mui/icons-material/Block";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";


const TeamSidebar = ({ openSidebarToggle, OpenSidebar }) => {
  const location = useLocation();

const tooltipTitles = { 
  dashboard: "View your dashboard",
  agentsList: "Manage and view admins",
  campaigns: "View and create campaigns",
  group: "Manage user groups",
  menuIVR: "Configure IVR menus",

  email: "Check and manage email services",      
  users: "Manage application users",             
  dataUpload: "Upload customer and campaign data",  

  callReport: "View call reports",
  leadReport: "View lead reports",
  blockNumber: "Block specific numbers",
  disposition: "Manage dispositions",
  avrConverter: "Convert AVR files",
  settings: "Adjust your settings",
  profile: "View and edit your profile",
  logout: "Logout from the application",
};


  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="top">
        <Link to="/superadmin" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img
              className="logo-img"
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Logo"
              style={{ height: "50px", width: "80%", marginTop: "24px" }}
            />
          </span>
        </Link>
        <span className="close-icon-container">
          {" "}
          <CloseIcon className="icon close_icon" onClick={OpenSidebar} />
        </span>
      </div>

      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Tooltip title={tooltipTitles.dashboard} placement="right" arrow>
            <Link to="/superadmin" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/") ? "active" : ""}>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
          </Tooltip>

          <p className="title">LISTS</p>
          <Tooltip title={tooltipTitles.agentsList} placement="right" arrow>
            <Link to="/superadmin/AdminUser" style={{ textDecoration: "none" }}>
              <li
                className={
                  isActiveRoute("/superadmin/AdminUser") ? "active" : ""
                }
              >
                <PersonOutlineIcon className="icon" />
                <span>Admin List</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.email} placement="right" arrow>
            <Link to="/superadmin/email" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/email") ? "active" : ""}>
                <EmailIcon className="icon" />
                <span>Email</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.users} placement="right" arrow>
            <Link to="/superadmin/agent" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/agent") ? "active" : ""}>
                <PeopleAltIcon className="icon" />
                <span>Users</span>
              </li>
            </Link>
          </Tooltip>
          <Tooltip title={tooltipTitles.campaigns} placement="right" arrow>
            <Link to="/superadmin/campaign" style={{ textDecoration: "none" }}>
              <li
                className={
                  isActiveRoute("/superadmin/campaign") ? "active" : ""
                }
              >
                <CampaignIcon className="icon" />
                <span>Campaigns</span>
              </li>
            </Link>
          </Tooltip>
          <Tooltip title={tooltipTitles.menuIVR} placement="right" arrow>
            <Link to="/superadmin/extension" style={{ textDecoration: "none" }}>
              <li
                className={
                  isActiveRoute("/superadmin/extension") ? "active" : ""
                }
              >
                <DialpadIcon className="icon" />
                <span>DTMF</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.group} placement="right" arrow>
            <Link to="/superadmin/group" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("superadmin/group") ? "active" : ""}>
                <GroupIcon className="icon" />
                <span>Group</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.dataUpload} placement="right" arrow>
            <Link
              to="/superadmin/dataUpload"
              style={{ textDecoration: "none" }}
            >
              <li className={isActiveRoute("/dataUpload") ? "active" : ""}>
                <CloudUploadIcon className="icon" />
                <span>Data Upload</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.callReport} placement="right" arrow>
            <Link
              to="/superadmin/call_report"
              style={{ textDecoration: "none" }}
            >
              <li
                className={
                  isActiveRoute("/superadmin/callReport") ? "active" : ""
                }
              >
                <CallIcon className="icon" />
                <span>Call Report</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.leadReport} placement="right" arrow>
            <Link
              to="/superadmin/leadReportList"
              style={{ textDecoration: "none" }}
            >
              <li
                className={
                  isActiveRoute("/superadmin/leadReport") ? "active" : ""
                }
              >
                <InsertChartOutlinedIcon className="icon" />
                <span>Lead Report</span>
              </li>
            </Link>
          </Tooltip>

          <p className="title">SERVICE</p>
          <Tooltip title={tooltipTitles.blockNumber} placement="right" arrow>
            <Link to="/superadmin/blockList" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/blockNumber") ? "active" : ""}>
                <BlockIcon className="icon" />
                <span>Block Number</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.disposition} placement="right" arrow>
            <Link
              to="/superadmin/dispositionList"
              style={{ textDecoration: "none" }}
            >
              <li
                className={
                  isActiveRoute("/superadmin/disposition") ? "active" : ""
                }
              >
                <ListAltIcon className="icon" />
                <span>Disposition</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.avrConverter} placement="right" arrow>
            <Link to="/superadmin/ivrList" style={{ textDecoration: "none" }}>
              <li
                className={
                  isActiveRoute("/superadmin/avrConverter") ? "active" : ""
                }
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
