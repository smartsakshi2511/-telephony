// src/pages/profile/Profile.jsx

import "./Profile.scss"; 
import { useState } from "react";
import EditProfile from "./EditPro"; // Import the EditProfile component
import { Dialog } from "@mui/material"; // Import Dialog from MUI

const Profile = () => {
  const [open, setOpen] = useState(false); // State to control modal visibility

  // Sample profile data; in a real app, this would come from props or API
  const profileData = {
    name: "9990_Admin",
    userId: "USER123",
    password: "******", // Typically, passwords shouldn't be displayed
    useCLI: "Enabled",
    totalAgent: 5,
    email: "admin@example.com",
    contact: "+1 2345 67 89",
    timezone: "Asia/Kolkata",
    apiKey: "abcd1234efgh5678",
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="userprofile">
     
      <div className="profileContainer">
       
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={handleOpen}>
              Edit Profile
            </div>
            <h1 className="title">Information</h1>
            
            <div className="item">
              <div className="contact">
                <img
                  src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                  alt="Profile"
                  className="itemImg"
                />
                <h2>Welcome to Admin Panel</h2>
              </div>
              
              <div className="details">
                {/* Display profile information */}
                <div className="detailItem">
                  <span className="itemKey">Name:</span>
                  <span className="itemValue">{profileData.name}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">User ID:</span>
                  <span className="itemValue">{profileData.userId}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Password:</span>
                  <span className="itemValue">{profileData.password}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Use CLI:</span>
                  <span className="itemValue">{profileData.useCLI}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Total Agents:</span>
                  <span className="itemValue">{profileData.totalAgent}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{profileData.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Contact:</span>
                  <span className="itemValue">{profileData.contact}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Timezone:</span>
                  <span className="itemValue">{profileData.timezone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">API Key:</span>
                  <span className="itemValue">{profileData.apiKey}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right section can be used for additional content */}
        </div>
      </div>
      
      {/* Modal for Editing Profile */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <EditProfile profileData={profileData} handleClose={handleClose} />
      </Dialog>
    </div>
  );
};

export default Profile;
