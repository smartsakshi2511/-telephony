 import React, { useContext, useState  } from "react";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CampaignIcon from "@mui/icons-material/Campaign";  
import GroupIcon from "@mui/icons-material/Group";  
import CallToActionIcon from "@mui/icons-material/CallToAction"; 
import CloudUploadIcon from "@mui/icons-material/CloudUpload";  
import CallIcon from "@mui/icons-material/Call";  
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";   
import BlockIcon from "@mui/icons-material/Block";   
import ListAltIcon from "@mui/icons-material/ListAlt";  
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";   
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useLocation } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { Tooltip } from "@mui/material";
import {Close as CloseIcon} from '@mui/icons-material';

const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {
  const { dispatch } = useContext(DarkModeContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Tooltip titles for each menu item
  const tooltipTitles = {
    dashboard: "View your dashboard",
    agentsList: "Manage and view agents",
    campaigns: "View and create campaigns",
    group: "Manage user groups",
    menuIVR: "Configure IVR menus",
    dataUpload: "Upload necessary data",
    callReport: "View call reports",
    leadReport: "View lead reports",
    blockNumber: "Block specific numbers",
    disposition: "Manage dispositions",
    avrConverter: "Convert AVR files",
    settings: "Adjust your settings",
    profile: "View and edit your profile",
    logout: "Logout from the application",
  };

  // Function to determine if the current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    
    <div  id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="top">
      <Link to="/" style={{ textDecoration: "none" }}>
      <span className="logo">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          
          style={{ height: "50px", width:"100%", marginTop:"24px" }}  // Adjust height or width as needed
        />
      </span>
    </Link>
    <span className="close-icon-container"> <CloseIcon className="icon close_icon" onClick={OpenSidebar} /></span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Tooltip title={tooltipTitles.dashboard} placement="right" arrow>
            <Link to="/" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/") ? "active" : ""}>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
          </Tooltip>


          <p className="title">LISTS</p>
          <Tooltip title={tooltipTitles.agentsList} placement="right" arrow>
            <Link to="/agent" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/agent") ? "active" : ""}>
                <PersonOutlineIcon className="icon" />
                <span>Agents List</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.campaigns} placement="right" arrow>
            <Link to="/campaign" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/campaign") ? "active" : ""}>
                <CampaignIcon className="icon" />
                <span>Campaigns</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.group} placement="right" arrow>
            <Link to="/group" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/group") ? "active" : ""}>
                <GroupIcon className="icon" />
                <span>Group</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.menuIVR} placement="right" arrow>
            <Link to="/menu_ivr" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/menuIVR") ? "active" : ""}>
                <CallToActionIcon className="icon" />
                <span>Menu IVR</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.dataUpload} placement="right" arrow>
            <Link to="/dataUpload" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/dataUpload") ? "active" : ""}>
                <CloudUploadIcon className="icon" />
                <span>Data Upload</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.callReport} placement="right" arrow>
            <Link to="/call_report" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/callReport") ? "active" : ""}>
                <CallIcon className="icon" />
                <span>Call Report</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.leadReport} placement="right" arrow>
            <Link to="/leadReportList" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/leadReport") ? "active" : ""}>
                <InsertChartOutlinedIcon className="icon" />
                <span>Lead Report</span>
              </li>
            </Link>
          </Tooltip>

          <p className="title">SERVICE</p>
          <Tooltip title={tooltipTitles.blockNumber} placement="right" arrow>
            <Link to="/blockList" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/blockNumber") ? "active" : ""}>
                <BlockIcon className="icon" />
                <span>Block Number</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.disposition} placement="right" arrow>
            <Link to="/dispositionList" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/disposition") ? "active" : ""}>
                <ListAltIcon className="icon" />
                <span>Disposition</span>
              </li>
            </Link>
          </Tooltip>

          <Tooltip title={tooltipTitles.avrConverter} placement="right" arrow>
            <Link to="/ivrList" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/avrConverter") ? "active" : ""}>
                <CompareArrowsIcon className="icon" />
                <span>IVR Converter</span>
              </li>
            </Link>
          </Tooltip>

          {/* <Tooltip title={tooltipTitles.settings} placement="right" arrow>
            <Link to="/settings" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/settings") ? "active" : ""}>
                <SettingsApplicationsIcon className="icon" />
                <span>Settings</span>
              </li>
            </Link>
          </Tooltip> */}

        
          <Tooltip title={tooltipTitles.profile} placement="right" arrow>
            <Link to="/userProfile" style={{ textDecoration: "none" }}>
              <li className={isActiveRoute("/userProfile") ? "active" : ""}>
                <AccountCircleOutlinedIcon className="icon" />
                <span>Profile</span>
              </li>
            </Link>
          </Tooltip>
        </ul>
      </div>
 
    </div>
  );
};

export default Sidebar;
