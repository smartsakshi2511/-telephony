import { useContext, useState, useMemo, useRef, useEffect } from "react";
import "./navbar.scss";
import { useAnnouncements } from "./nav_hooks/AnnouncementsBell";
import { useBreakStatus } from "./nav_hooks/useBreakStatus";
import { useAutoDial } from "./nav_hooks/useAutoDial";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { Menu as MenuIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { PopupContext } from "../../context/iframeContext";
import Phone from "./PhoneCall";
import AnnouncementBox from "../featured/Agent_Allowancement_Card";
import { Menu, MenuItem, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AgentNavbar = ({ OpenSidebar }) => {
  const { popupState, toggleIframe, updateIframeSrc } =
    useContext(PopupContext);
  const { logout, user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const { announcements, unread, setUnread } = useAnnouncements(token);
  const { selectedBreak, updateBreakStatus } = useBreakStatus(
    user,
    popupState,
    updateIframeSrc,
    toggleIframe
  );
  const { autoDialOn, autoDialStatus, handleAutoDialToggle } = useAutoDial(
    user,
    token,
    popupState,
    updateIframeSrc,
    toggleIframe
  );

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  const breakOptions = ["Ready", "Lunch Break", "Bio Break", "Mobile"];
  const breakColors = {
    Ready: "#00796B",
    "Lunch Break": "#D84315",
    "Bio Break": "#F9A825",
    Mobile: "#4527A0",
  };

  const phonePopup = useMemo(
    () => (
      <Phone
        visible={popupState.phone}
        id="phone"
        toggleVisibility={() => toggleIframe("phone")}
        iframeSrc={popupState.iframeSrc}
      />
    ),
    [popupState.phone, popupState.iframeSrc]
  );

  const updateWrapup = async (status) => {
    if (!user || !token) return;
    try {
      await axios.post(
        `https://${window.location.hostname}:4000/agent-wrapup`,
        { wrapup: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update wrapup", err);
    }
  };

  // Phone popup triggers wrapup
  useEffect(() => {
    updateWrapup(popupState.phone ? 1 : 0);
  }, [popupState.phone]);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = (breakType) => {
    if (breakType) updateBreakStatus(breakType);
    setAnchorEl(null);
  };

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const handleLogout = async () => {
    try {
      await axios.post(`https://${window.location.hostname}:4000/log/logout`, {
        user_id: user.user_id,
      });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar">
      <div className="menu-icon">
        <MenuIcon className="icon" onClick={OpenSidebar} />
      </div>
      <div className="wrapper">
        <div className="search"></div>
        <div className="items">
          {autoDialStatus && (
            <div className="item">
              <button className="autodial" onClick={handleAutoDialToggle}>
                Auto Dial ({autoDialOn ? "ON" : "OFF"})
              </button>
            </div>
          )}

          <div className="item">
            <Button
              variant="contained"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={handleMenuClick}
              style={{
                background: breakColors[selectedBreak] || "#008080",
                color: "white",
                textTransform: "none",
                borderRadius: "8px",
                padding: "6px 16px",
              }}
            >
              {selectedBreak}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => handleMenuClose(null)}
              MenuListProps={{ "aria-labelledby": "break-button" }}
            >
              {breakOptions.map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => handleMenuClose(option)}
                  selected={selectedBreak === option}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Phone Button */}
          <div>
            <Button onClick={() => toggleIframe("phone")}>
              <img
                src="/images/iconImages/teleImage.png"
                alt="Phone"
                style={{ width: 30, height: 30 }}
              />
            </Button>
          </div>

          {/* Announcements Bell */}
          <div>
            <IconButton
              ref={bellRef}
              onClick={() => {
                setAnnouncementOpen((prev) => !prev);
                setUnread(false);
              }}
            >
              <Badge color="error" variant="dot" invisible={!unread}>
                <NotificationsIcon className="vibrate" />
              </Badge>
            </IconButton>
            <AnnouncementBox
              open={announcementOpen}
              anchorEl={bellRef.current}
              onClose={() => setAnnouncementOpen(false)}
              announcements={announcements}
            />
          </div>
          <div className="item">
            <div className="menu" onClick={toggleDropdown}>
              <img
                src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg"
                alt="avatar"
                className="avatar"
              />
              {isDropdownVisible && (
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <a href="userProfile">My Profile</a>
                    </li>
                    <li onClick={handleLogout} className="logout-button">
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {phonePopup}
    </div>
  );
};

export default AgentNavbar;
