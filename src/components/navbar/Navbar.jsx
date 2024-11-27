import React, { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Menu as MenuIcon } from "@mui/icons-material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Button from "@mui/material/Button";
import { DarkModeContext } from "../../context/darkModeContext";
import PopupIframe from "./LiveCall";
import Phone from "./PhoneCall";

const Navbar = ({ OpenSidebar }) => {
  const { dispatch } = useContext(DarkModeContext);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [iframe1Visible, setIframe1Visible] = useState(false);
  const [iframe2Visible, setIframe2Visible] = useState(false);

  // Toggle visibility of the popups
  const toggleIframe1 = () => setIframe1Visible(!iframe1Visible);
  const toggleIframe2 = () => setIframe2Visible(!iframe2Visible);

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Handle outside click to close the dropdown
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".menu")) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const formatTime = (date) => date.toLocaleTimeString();

  return (
    <div className="navbar">
      <div className="menu-icon">
        <MenuIcon className="icon" onClick={OpenSidebar} />
      </div>
      <div className="wrapper">
        <div className="search"></div>
        <div className="items">
          <div className="item">
            <span className="live-time">{formatTime(currentTime)}</span>
          </div>

          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>

          {/* Button to toggle Live Calls popup */}
          <div className="item">
            <Button
              className="pulse-effect responsive-button"
              variant="contained"
              style={{
                background: "linear-gradient(90deg, #283593, #3F51B5,  #283593)",
                color: "#fff",
                marginRight: "10px",
              }}
              onClick={toggleIframe1}
            >
              {iframe1Visible ? " Calls" : "Calls"}
            </Button>
          </div>

          {/* Button to toggle Phone popup */}
          <div className="item pulse-effect">
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(90deg, #2e7d32, #4caf50, #2e7d32)", // Green gradient
                color: "white",
                borderColor: "#4caf50",
              }}
              onClick={toggleIframe2}
            >
              {iframe2Visible ? "Phone" : "Phone"}
            </Button>
          </div>

          <div className="item">
            <div className="menu" onClick={toggleDropdown}>
              <img
                src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                alt=""
                className="avatar"
              />
              {isDropdownVisible && (
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <a href="/userProfile">My Profile</a>
                    </li>
                    <li>Menu 2</li>
                    <li>Menu 3</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PopupIframe for Live Calls */}
      <PopupIframe
        visible={iframe1Visible}
        toggleVisibility={toggleIframe1}
        title="Live Calls"
      />

      {/* PopupIframe for Phone */}
      <Phone
        visible={iframe2Visible}
        toggleVisibility={toggleIframe2}
        title="Phone"
        iframeSrc="./softphone/Phone/index.html"
      />
    </div>
  );
};

export default Navbar;
