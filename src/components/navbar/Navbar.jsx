import React, { useContext, useState, useEffect, useMemo } from "react";
import "./navbar.scss";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { Menu as MenuIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { PopupContext } from "../../context/iframeContext";
import PopupIframe from "./LiveCall";
import Phone from "./PhoneCall";
import CreateAnnouncementDialog from "../Form/Create_Announcement";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  AccountCircle,
  AccessAlarm,
  PhoneInTalk,
  Logout,
  Settings,
} from "@mui/icons-material";
import Clock from "./nav_hooks/Clock";

const Navbar = ({ OpenSidebar }) => {
  const { popupState, toggleIframe } = useContext(PopupContext);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `https://${window.location.hostname}:4000/telephony/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting to login...");
        logout();
        navigate("/login");
        return;
      }

      await axios.post(
        `https://${window.location.hostname}:4000/log/logout`,
        {
          user_id: user.user_id,
          admin: user.admin_id || null, // ✅ make sure admin is sent
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token
          },
        }
      ); 
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error); 
      logout();
      navigate("/login");
    }
  };

  const callPopup = useMemo(
    () => (
      <PopupIframe
        id="call"
        visible={popupState.call}
        toggleVisibility={() => toggleIframe("call")}
        title="Live Calls"
      />
    ),
    [popupState.call]
  );

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

  return (
    <div className="navbar">
      <div className="menu-icon">
        <MenuIcon className="icon" onClick={OpenSidebar} />
      </div>
      <div className="wrapper">
        <div className="search"></div>
        <div className="items">
          <div className="item">
            <Clock />
          </div>

          <div
            className="item"
            onClick={() => toggleIframe("call")}
            title="Live Calls"
          >
            <Player
              autoplay
              loop
              src="/images/livecall.json"
              style={{ height: 65, width: 65, cursor: "pointer" }}
            />
          </div>

          <div>
            <Button
              onClick={() => toggleIframe("phone")}
              title="Call via Phone"
            >
              <Player
                autoplay
                // loop
                src="/images/ani2.json"
                style={{ height: 70, width: 70 }}
              />
            </Button>
          </div>
          {user?.role === "admin" && (
            <Button
              onClick={() => setAnnouncementDialogOpen(true)}
              title="Create Announcement"
              style={{ minWidth: "30px", padding: "2px" }}
            >
              <Player
                autoplay
                loop
                src="/images/announcement.json"
                style={{ height: 40, width: 40 }}
              />
            </Button>
          )}
          <div className="item">
            <div className="menu" onClick={toggleDropdown}>
              <img
                src={
                  profileData?.admin_profile
                    ? `https://${window.location.hostname}:4000${profileData.admin_profile}`
                    : "/download.png"
                }
                alt="Profile"
                className="avatar"
              />
              {isDropdownVisible && (
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <a href="/userProfile">
                        <AccountCircle style={{ marginRight: "8px" }} />
                        My Profile
                      </a>
                    </li>
                    <li>
                      <Link to="/admin/reminders">
                        <AccessAlarm style={{ marginRight: "8px" }} />
                        Reminder
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/did">
                        <PhoneInTalk style={{ marginRight: "8px" }} />
                        DID
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/sms_template">
                        <PhoneInTalk style={{ marginRight: "8px" }} />
                        SMS
                      </Link>
                    </li>
                    <li onClick={handleLogout} className="logout-button">
                      <Logout style={{ marginRight: "8px" }} />
                      Logout
                    </li>
                    {user?.role === "superadmin" && (
                      <li>
                        <Link to="/superadmin/admin_control">
                          <Settings style={{ marginRight: "8px" }} />
                          Setting
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreateAnnouncementDialog
        open={announcementDialogOpen}
        onClose={() => setAnnouncementDialogOpen(false)}
      />
      {callPopup}
      {phonePopup}
    </div>
  );
};

export default Navbar;
