import "./Profile.scss";
import { useState } from "react";
import EditProfile from "./EditPro";
import { Dialog, IconButton } from "@mui/material"; // Import Dialog and IconButton
import RefreshIcon from "@mui/icons-material/Refresh"; // Import the Refresh icon

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("abcd1234efgh5678"); // State for API Key

  // Sample profile data
  const profileData = {
    name: "9990_Admin",
    userId: "USER123",
    password: "******",
    useCLI: "Enabled",
    totalAgent: 5,
    email: "admin@example.com",
    contact: "+1 2345 67 89",
    timezone: "Asia/Kolkata",
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Function to generate a new random API key
  const generateApiKey = () => {
    const newApiKey = Math.random().toString(36).substring(2, 18);
    setApiKey(newApiKey);
  };

  return (
    <div className="userprofile">
      <div className="profileContainer">
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={handleOpen}>
              Edit Profile
            </div>
            <h2 className="title">Contact Information</h2>
           
            <div className="item">
              <div className="contact">
             
                <img
                  src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                  alt="Profile"
                  className="itemImg"
                />
             <h5 className="heading">Welcome to </h5>
             <h2 className="heading">Admin Panel</h2>
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

                {/* API Key with Refresh Icon Button */}
                <div className="detailItem">
                  <span className="itemKey">API Key:</span>
                  <span className="itemValue">{apiKey}</span>
                  <IconButton
                    onClick={generateApiKey}
                    color="primary"
                    aria-label="refresh API key"
                    className="refreshIconButton"
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </div>

              </div>
            </div>
          </div>
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
