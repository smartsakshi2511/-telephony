import React, { useState, useEffect, useContext } from "react";
import "./single.scss";
import ViewagentFeatured from "../../components/featured/ViewAgentFeature";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

const Single = () => {
  const { userid } = useParams();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoDialStatus, setAutoDialStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [agentPermissionsEnabled, setAgentPermissionsEnabled] = useState(false);
  const [agentPermissions, setAgentPermissions] = useState({
    data_upload: false,
    report_view: false,
    block_no: false,
  });
  const [recordingPermission, setRecordingPermission] = useState(false);


  const togglePermission = (key) => {
    setAgentPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fetchAgentPermissions = () => {
    axios
      .get(`https://${window.location.hostname}:4000/permissions/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
  let permissions = res.data;

  // ✅ If no record exists, treat all as true (default)
  if (!permissions || Object.keys(permissions).length === 0) {
    permissions = {
      data_upload: true,
      report_view: true,
      block_no: true,
    };
  }
 
        setAgentPermissions(permissions);
        setAgentPermissionsEnabled(
          permissions.data_upload || permissions.report_view || permissions.block_no
        );
      })
      .catch((err) => {
        console.error("Failed to fetch agent permissions:", err);
        setAgentPermissionsEnabled(false);
      });
  };
 
  const saveAgentPermissions = () => {
    const payload = {
      data_upload: !!agentPermissions.data_upload,
      block_no: !!agentPermissions.block_no,
      report_view: !!agentPermissions.report_view,
    };

    axios
      .post(`https://${window.location.hostname}:4000/permissions/${userid}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Permissions updated successfully",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      })
      .catch((err) => {
        console.error("Failed to update permissions:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Permission update failed",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      });
  };



  const handleAutoDialChange = async () => {
    const newValue = !autoDialStatus;
    setAutoDialStatus(newValue);

    try {
      await axios.patch(
        `https://${window.location.hostname}:4000/user/${userid}/update-status`,
        { auto_dial_status: newValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to update auto dial status", err);
    }
  };


 const saveRecordingPermission = async (newValue) => {
  try {
    await axios.patch(
      `https://${window.location.hostname}:4000/user/${userid}/recording-permission`,
      { recording_permission: newValue },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Swal.fire({
      toast: true,
      icon: "success",
      position: "top-end",
      title: "Recording permission updated",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (err) {
    console.error("Failed to update recording permission:", err);
    Swal.fire({
      toast: true,
      icon: "error",
      position: "top-end",
      title: "Failed to update recording permission",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
};




  useEffect(() => {
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    axios
      .get(`https://${window.location.hostname}:4000/telephony/user/${userid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data);
        setAutoDialStatus(res.data?.auto_dial_status);
        setRecordingPermission(res.data?.recording_permission === 1); // ✅ this line added
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });


    fetchAgentPermissions();
  }, [userid]);

  if (loading) return <CircularProgress />;

  const userTypeLabels = {
  1: "AGENT",
  2: "TEAM LEADER",
  5: "IT",
  6: "QUALITY ANALYTICS",
  7: "MANAGER",
};


  return (
    <div className="singleContainer">
      <div className="header-section">
        <img
          src={
            userData?.admin_profile
              ? `${window.location.protocol}//${window.location.hostname}:4000${userData.admin_profile}`
              : `${window.location.protocol}//${window.location.hostname}:3000/avatar.png`
          }
          alt="User"
          className="profile-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://ui-avatars.com/api/?name=Unknown&background=0D8ABC&color=fff";
          }}
        />
        {/* <div className="profile-summary">
          <h2>{userData?.user_type || "User Type"}</h2>
           <p>{userData?.full_name || "User"}</p>         
        </div> */}


        <div className="profile-summary"> 
  <h2>{userTypeLabels[userData?.user_type] || "User Type"}</h2>
  <p>{userData?.full_name || "User"}</p>         
</div>

        <div className="tab-buttons">
          {["profile", "permissions", "email", "announcement"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

      </div>

      <div className="tab-content">
        {activeTab === "profile" && (
          <div className="top">
            <div className="left2">
              <h1 className="title">User Information</h1>
              <div className="details">
                <div className="detailItem"><span className="itemKey">Username:</span><span className="itemValue">{userData.full_name}</span></div>
                <div className="detailItem"><span className="itemKey">External:</span><span className="itemValue">{userData.ext_number}</span></div>
                <div className="detailItem"><span className="itemKey">Campaign:</span><span className="itemValue">{userData.campaigns_id}</span></div>
                <div className="detailItem"><span className="itemKey">User Type:</span><span className="itemValue">{userData.user_type}</span></div>
                <div className="detailItem"><span className="itemKey">DID:</span><span className="itemValue">{userData.use_did}</span></div>
                <div className="detailItem"><span className="itemKey">Agent Priority:</span><span className="itemValue">{userData.agent_priorty}</span></div>
                <div className="detailItem"><span className="itemKey">Password:</span><span className="itemValue">{userData.password}</span></div>
                <div className="detailItem"><span className="itemKey">Status:</span><span className="itemValue">{userData.status}</span></div>
              </div>
            </div>
            <div className="right2">
              <ViewagentFeatured userId={userid} />
            </div>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="permissions-box">
            <h3 className="permissions-title">Permissions</h3>
            {user?.role === "admin" && (
              <div className="permission-item">
                <label>Enable Auto Dial</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={autoDialStatus}
                    onChange={handleAutoDialChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            )}

            {/* === Agent Permissions Toggle === */}
            {/* === Agent Permissions Toggle === */}
            <div className="permission-item">
              <label>Agent Permissions</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={agentPermissionsEnabled}
                  onChange={(e) => setAgentPermissionsEnabled(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* === Show Permissions Only When Enabled === */}
            {agentPermissionsEnabled && (
              <div className="agent-permission-options">
                <div className="modal-checkbox">
                  <label>
                    Upload Data
                    <input
                      type="checkbox"
                      checked={agentPermissions.data_upload}
                      onChange={() => togglePermission("data_upload")}
                    />
                  </label>
                </div>
                <div className="modal-checkbox">
                  <label>
                    Report View
                    <input
                      type="checkbox"
                      checked={agentPermissions.report_view}
                      onChange={() => togglePermission("report_view")}
                    />
                  </label>
                </div>
                <div className="modal-checkbox">
                  <label>
                    Block Number
                    <input
                      type="checkbox"
                      checked={agentPermissions.block_no}
                      onChange={() => togglePermission("block_no")}
                    />
                  </label>
                </div>
                <button onClick={saveAgentPermissions} className="save-btn">Save Permissions</button>
              </div>
            )}



           <div className="permission-item">
  <label>Recording Permission</label>
  <label className="switch">
    <input
      type="checkbox"
      checked={recordingPermission}
      onChange={() => {
        const newValue = !recordingPermission;
        setRecordingPermission(newValue);
        saveRecordingPermission(newValue); // ✅ calls save function
      }}
    />
    <span className="slider"></span>
  </label>
</div>


          </div>
        )}

        {activeTab === "email" && (
          <div className="permissions-box">
            <h3 className="permissions-title">Email Configuration</h3>
            <p>Email: {userData?.email || "Not available"}</p>
            <p>SMTP: smtp.domain.com</p>
            <p>Port: 587</p>
          </div>
        )}

        {activeTab === "announcement" && (
          <div className="permissions-box">
            <h3 className="permissions-title">Announcement</h3>
            <p>This is an announcement section. You can customize it as needed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Single;
