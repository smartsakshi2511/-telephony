import {
  Tabs,
  Tab,
  Avatar,
  Box,
  Button,
   TextField,
} from "@mui/material";
import { Typography } from '@mui/material';
import axios from "axios";

import { useState } from "react";
 

const ViewAdminDialog = ({ open, onClose, userData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAdmin, setSelectedAdmin] = useState("");
 
   const [selectedContext, setSelectedContext] = useState("");
const [contextConfig, setContextConfig] = useState({
  pri: `[PRI configuration goes here]`,
  gsm: `[Sinway]
type=endpoint
transport=transport-udp
context=telephony_in
disallow=all
allow=ulaw
allow=alaw
aors=Sinway-trunk
rewrite_contact=yes
force_rport=yes
direct_media=no
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes

[Sinway-trunk]
type=aor
contact=sip:192.168.1.101

[Sinway-trunk]
type=auth
auth_type=none

[Sinway-trunk]
type=identify
endpoint=Sinway
match=192.168.1.101`,
  sip: `[trunk-peer] 
type=endpoint
transport=transport-udp
context=telephony_in
disallow=all
allow=ulaw
allow=alaw
aors=trunk-peer
direct_media=no
t38_udptl=no
trust_id_inbound=yes
send_pai=yes
send_rpid=yes

; NAT-related options
rewrite_contact=yes
rtp_symmetric=yes
force_rport=yes
ice_support=no

[trunk-peer]
type=aor
contact=sip:95.217.41.242
qualify_frequency=60

[trunk-peer]
type=identify
endpoint=trunk-peer
match=95.217.41.242`,
});


  const getProfileImage = () => {
    return userData?.admin_profile
      ? `${window.location.protocol}//${window.location.hostname}:4000${userData.admin_profile}`
      : `${window.location.protocol}//${window.location.hostname}:3000/avatar.png`;
  };


const handleContextSave = async (type, configValue) => {
  const token = localStorage.getItem("token");
  const superadmin = userData?.user_name;
  const admin = selectedAdmin;
  const career = type;
  const contextname = configValue.split("\n")[0]?.trim();

  if (!admin || !career || !configValue) {
    alert("Please select admin, context type and fill context");
    return;
  }

  try {
    const res = await axios.post(
      `https://192.168.1.18:4000/telephony/context/save`,
      {
        superadmin,
        admin,
        career,
        contextname,
        contextvalue: configValue,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message || "Context saved successfully!");
  } catch (err) {
    console.error("Save context error:", err);
    alert("Error saving context");
  }
};




  return (
      <Box p={4}>
      <h1>User Details</h1>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar
          src={getProfileImage()}
          sx={{ width: 60, height: 60 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://ui-avatars.com/api/?name=Unknown&background=0D8ABC&color=fff";
          }}
        />
        <Box>
          <h2>{userData?.full_name || "User"}</h2>
          <p>{userData?.user_type || "User Type"}</p>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Profile" />
        <Tab label="Permissions" />
        <Tab label="Email" />
        <Tab label="Announcement" />
        <Tab label="Context" />
      </Tabs>

      <Box mt={2}>
        {activeTab === 0 && (
          <div>
            <p><strong>Username:</strong> {userData?.user_name}</p>
            <p><strong>Mobile:</strong> {userData?.admin_mobile}</p>
            <p><strong>Type:</strong> {userData?.user_type}</p>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <p><strong>Auto Dial Permission:</strong> {userData?.auto_dial_permission ? "Yes" : "No"}</p>
            <p><strong>Recording Permission:</strong> {userData?.recording_permission ? "Yes" : "No"}</p>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <p><strong>Email:</strong> {userData?.admin_email}</p>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <p><strong>Announcements:</strong> {userData?.announcement || "No announcements available"}</p>
          </div>
        )}

{activeTab === 4 && (
  <Box mt={3}>
    <Typography variant="h6" gutterBottom>
      Select Context Type
    </Typography>

    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <select
        value={selectedContext}
        onChange={(e) => setSelectedContext(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '16px',
          minWidth: '200px'
        }}
      >
        <option value="">-- Select --</option>
        <option value="pri">PRI</option>
        <option value="gsm">GSM</option>
        <option value="sip">SIP Trunk</option>
      </select>
      <TextField
  label="Select Admin"
  select
  fullWidth
  value={selectedAdmin}
  onChange={(e) => setSelectedAdmin(e.target.value)}
  SelectProps={{ native: true }}
  sx={{ minWidth: "200px" }}
>
  <option value="">-- Select Admin --</option>
  <option value="1000">1000</option>
  <option value="2000">2000</option>
  <option value="3000">3000</option>
</TextField>

  {/* <TextField
    label="Select Admin"
    select
    fullWidth
    value={selectedAdmin}
    onChange={(e) => setSelectedAdmin(e.target.value)}
    SelectProps={{ native: true }}
    sx={{ minWidth: "200px" }}
  >
    <option value="">-- Select Admin --</option>
    {adminList.map((admin) => (
      <option key={admin.user_id} value={admin.user_name}>
        {admin.full_name}
      </option>
    ))}
  </TextField> */}

    
    </Box>

    {selectedContext && (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Configuration for <strong>{selectedContext.toUpperCase()}</strong>
        </Typography>

        <Box
  sx={{
    border: "1px solid #ccc",
    borderRadius: 2,
    backgroundColor: "#f9f9f9",
    fontFamily: "monospace",
    padding: 1,
    maxHeight: "400px",
    overflowY: "auto", // SCROLL HERE
  }}
>
  <Box component="pre" sx={{ margin: 0 }}>
    <TextField
  multiline
  fullWidth
  minRows={15}
  maxRows={30}
  value={contextConfig[selectedContext]}
  onChange={(e) =>
    setContextConfig({
      ...contextConfig,
      [selectedContext]: e.target.value,
    })
  }
  variant="outlined"
  sx={{
    fontFamily: 'monospace',
    backgroundColor: "#fff",
    "& .MuiInputBase-root": {
      fontSize: "14px",
      lineHeight: "1.6",
    },
    "& textarea": {
      overflowY: "auto",
    },
  }}
/>

  </Box>
</Box>

      </Box>
    )}
      <Button
    variant="contained"
    onClick={() => handleContextSave(selectedContext, contextConfig[selectedContext])}
  >
    Save Context
  </Button>
  </Box>
)}



      </Box>
    </Box>
  );
};

export default ViewAdminDialog;
