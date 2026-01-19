import   { useState, useEffect, useContext, useCallback } from "react";
import "./Profile.scss";
import Axios from "axios";
import EditProfile from "./EditPro";
import { Dialog, IconButton, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AuthContext } from "../../context/authContext";
import Swal from "sweetalert2";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const { refreshUser } = useContext(AuthContext);
   useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await Axios.get(
          `https://${window.location.hostname}:4000/telephony/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfileData(response.data);
        setApiKey(response.data.api_key);

        if (response.data.admin_logo) {
          localStorage.setItem("admin_logo", response.data.admin_logo);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        Swal.fire({
          toast: true,
          icon: "error",
          title: "Failed to load profile",
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    };

    fetchProfileData();
  }, []);
  const generateApiKey = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await Axios.put(
        `https://${window.location.hostname}:4000/update-api-key/${profileData.user_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApiKey(response.data.api_key);

      Swal.fire({
        toast: true,
        icon: "success",
        title: "API Key updated!",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      console.error("Error updating API key:", error);
      Swal.fire({
        toast: true,
        icon: "error",
        title: "Failed to update API Key",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }, [profileData]);
  const copyApiKey = useCallback(() => {
    navigator.clipboard.writeText(apiKey);
    Swal.fire({
      toast: true,
      icon: "success",
      title: "API Key copied!",
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
  }, [apiKey]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!profileData) {
    return (
      <div className="loading-wrapper">
        <CircularProgress />
        <p>Loading profile...</p>
      </div>
    );
  } 
  const handleProfileUpdateSuccess = (newLogoPath) => {
    if (newLogoPath) {
      localStorage.setItem("admin_logo", newLogoPath);
    }
    refreshUser();

    Swal.fire({
      toast: true,
      icon: "success",
      title: "Profile updated!",
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
  };

  return (
    <div className="userprofile">
      <div className="profile-header">
        <img
          src={
            profileData.admin_profile
              ? `https://${window.location.hostname}:4000${profileData.admin_profile}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="avatar"
        />
        <div className="header-info">
          <h2>{profileData.full_name}</h2>
          <p>ID: {profileData.user_id}</p>
        </div>
        <button className="edit-btn" onClick={handleOpen}>
          ✏️ Edit
        </button>
      </div>

      {/* profile sections */}
      <div className="profile-grid">
        <div className="profile-card">
          <h3>Contact Information</h3>
          <div className="detail-row">
            <span>Name:</span> {profileData.full_name}
          </div>
          <div className="detail-row">
            <span>Email:</span> {profileData.admin_email}
          </div>
          <div className="detail-row">
            <span>Phone:</span> {profileData.admin_mobile}
          </div>
          <div className="detail-row">
            <span>Timezone:</span> {profileData.user_timezone}
          </div>
        </div>

        <div className="profile-card">
          <h3>Account Details</h3>
          <div className="detail-row">
            <span>User ID:</span> {profileData.user_id}
          </div>
          <div className="detail-row">
            <span>Password:</span> ••••••
          </div>
          <div className="detail-row">
            <span>Use CLI:</span> {profileData.use_did}
          </div>
          <div className="detail-row">
            <span>Total Agents:</span> {profileData.totalAgents}
          </div>
        </div>

        <div className="profile-card api-key">
          <h3>API Key</h3>
          <div className="api-row">
            <code>{apiKey}</code>
            <div className="actions">
              <IconButton onClick={generateApiKey}>
                <RefreshIcon />
              </IconButton>
              <button className="copy-btn" onClick={copyApiKey}>
                📋
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <EditProfile
          open={open}
          profileData={profileData}
          handleClose={handleClose}
          onSuccess={handleProfileUpdateSuccess}
        />
      </Dialog>
    </div>
  );
};

export default Profile;
