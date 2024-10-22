import React, { useContext, useState, useEffect } from 'react';
import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Button from "@mui/material/Button"; 
import { DarkModeContext } from "../../context/darkModeContext";
import PopupIframe from "./LiveCall";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [iframe1Visible, setIframe1Visible] = useState(false);
  const [iframe2Visible, setIframe2Visible] = useState(false);

  // Toggle visibility of the popups
  const toggleIframe1 = () => setIframe1Visible(!iframe1Visible);
  const toggleIframe2 = () => setIframe2Visible(!iframe2Visible);

  const handleMouseEnter = () => setDropdownVisible(true);
  const handleMouseLeave = () => setDropdownVisible(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString();

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div>
        <div className="items">
          <div className="item">
            <span className="live-time">{formatTime(currentTime)}</span>
          </div>
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon className="icon" onClick={() => dispatch({ type: "TOGGLE" })} />
          </div>

    
          <div className="item">
            <Button
              variant="contained"
              style={{ backgroundColor: "purple", color: "white", marginRight: '10px' }}
              onClick={toggleIframe1}
            >
              {iframe1Visible ? ' All Calls' : 'Live Calls'}
            </Button>
          </div>
 
          <div className="item">
            <Button
              variant="contained"
              style={{ backgroundColor: "green", color: "white" }}
              onClick={toggleIframe2}
            >
              {iframe2Visible ? 'Close Phone' : 'Phone'}
            </Button>
          </div>

          <div className="item">
            <div
              className="menu"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                alt=""
                className="avatar"
              />
              {isDropdownVisible && (
                <div className="dropdown-menu">
                  <ul>
                    <li><a href="/userProfile">My Profile</a></li>
                    <li>Menu 2</li>
                    <li>Menu 3</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <PopupIframe
        visible={iframe1Visible}
        toggleVisibility={toggleIframe1}
        iframeSrc="https://www.example.com/live-calls"
        title="Live Calls"
      />

      {/* PopupIframe for Phone */}
      <PopupIframe
        visible={iframe2Visible}
        toggleVisibility={toggleIframe2}
        iframeSrc="https://www.wikipedia.org"
        title="Phone"
      />
    </div>
  );
};

export default Navbar;
