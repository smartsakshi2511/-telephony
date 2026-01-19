import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/authContext";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";



const AddDialog = ({ open, onClose, onAdd, setData }) => {

  const { user } = useContext(AuthContext);

  const basePath =
    user?.user_type === "9"
      ? "superadmin"
      : user?.user_type === "8"
      ? "admin"
      : user?.user_type === "7"
      ? "manager"
      : user?.user_type === "2"
      ? "team_leader"
      : "admin"; // fallback

  const [formData, setFormData] = useState({
    file_name: "",
    lang: "",
    text: "",
    type: "",
    campaign_name: "",
  });
  const [error, setError] = useState({
    file_name: "",
    lang: "",
    text: "",
    type: "",
    campaign_name: "",
  });
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [admins, setAdmins] = useState([]);

useEffect(() => {
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://${window.location.hostname}:4000/telephony/admin`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  if (user?.user_type === "9") { // Sirf Superadmin ke liye
    fetchAdmins();
  }
}, [user]);

  useEffect(() => { 
    const token = localStorage.getItem("token");

    axios.get(`https://${window.location.hostname}:4000/campaigns_dropdown`, {
        headers: { Authorization: `Bearer ${token}` }, // No need for query params
      })
      .then((response) => {
        console.log("Fetched Campaigns:", response.data); // Debugging
        const options = response.data.map((campaign) => ({
          id: campaign.compaign_id,
          label: campaign.compaignname,
        }));
        setCampaignOptions([{ id: "", label: "--- Select Campaign ID ---" }, ...options]);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
 
    setError((prev) => ({
      ...prev,
      [name]: value ? "" : `Please select a valid ${name}`,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {
      lang: formData.lang ? "" : "Language is required",
      type: formData.type ? "" : "Type is required",
      text: formData.text ? "" : "Text is required",
    };
  
    setError(newErrors);
  
    if (Object.values(newErrors).some((err) => err)) {
      Swal.fire({
        title: "Error",
        text: "Please fill all required fields.",
        icon: "error",
        backdrop: false,   
      });
      return;
    }
  
    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/texttospeech`,
        {
          file_name: formData.file_name || `${Date.now()}_${formData.campaign_name}.wav`,
          type: formData.type,
          text: formData.text,
          lang: formData.lang,
          campaign_name: formData.campaign_name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // Close the dialog first
      onClose(); 
  
      // Delay the success popup slightly to avoid it going behind the modal
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        backdrop: false,
      }).then(() => {
        if (setData) {
          setData((prevData) => [...prevData, response.data.result]);
        }
      
        onClose(); // Close only after setting data
      });
      
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.error || "An error occurred.",
        icon: "error",
        backdrop: false,
      });
    }
  };
  
  const handleClose = () => {
    onClose();
    setFormData({
      file_name: "",
      lang: "",
      text: "",
      type: "",
      campaign_name: "",
    });
  };

  return (
    <Dialog
    open={open}
    onClose={handleClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: 6,
        p: 1,
      },
    }}
  >
    <DialogTitle
      sx={{
        fontWeight: "bold",
        fontSize: "1.25rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        pt: 2,
      }}
    >
      Create New Speech
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  
    <Divider />
  
    <DialogContent
      dividers
      sx={{
        px: 3,
        pt: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: "15px",
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            placeholder="Enter text to convert to speech"
            name="text"
            value={formData.text}
            onChange={handleChange}
            multiline
          />
        </Grid>
  
        <Grid item xs={12} sm={6}>
          <TextField
            select
            SelectProps={{ native: true }}
            margin="dense"
            fullWidth
            name="lang"
            value={formData.lang}
            onChange={handleChange}
            error={Boolean(error.lang)}
            helperText={error.lang}
          >
            <option value="">-- Select Language --</option>
            <option value="Hindi (Male 1)">Hindi (Male 1)</option>
            <option value="hi_female_v1">Hindi (Female)</option>
            <option value="hi_male_v2">Hindi (Male 2)</option>
            <option value="en_male_v1">English (Male)</option>
            <option value="en_female_v1">English (Female 1)</option>
            <option value="en_female_v4">English (Female 2)</option>
            <option value="en_female_v6">English (Female 3)</option>
            <option value="en_female_v7">English (Female 4)</option>
            <option value="gu_female_v2">Gujarati (Female 1)</option>
            <option value="gu_female_v1">Gujarati (Female 2)</option>
            <option value="mr_female_v1">Marathi (Female)</option>
            <option value="ta_female_v1">Tamil (Female)</option>
            <option value="kn_female_v1">Kannada (Female)</option>
            <option value="te_female_v1">Telugu (Female)</option>
            <option value="or_female_v1">Oriya (Female)</option>
            <option value="or_male_v1">Oriya (Male)</option>
            <option value="pn_female_v1">Panjabi (Female)</option>
            <option value="as_female_v1">Assamese (Female)</option>
          </TextField>
        </Grid>
  
        <Grid item xs={12} sm={6}>
          <TextField
            select
            SelectProps={{ native: true }}
            margin="dense"
            fullWidth
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={Boolean(error.type)}
            helperText={error.type}
          >
            <option value="">-- Select Type --</option>
            <option value="welcome IVR">Welcome IVR</option>
            <option value="AfterOffice">After Office IVR</option>
            <option value="moh">MOH FILE</option>
          </TextField>
        </Grid>
  
        <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
            name="campaign_name"
            label="Select Campaign ID"
            fullWidth
            variant="outlined"
            select
            value={formData.campaign_name}
            onChange={handleChange}
          >
            {campaignOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.id}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

{user?.user_type === "9" && (
  <Grid item xs={12} sm={6}>
    <TextField
      margin="dense"
      name="admin_id"
      label="Select Admin"
      fullWidth
      variant="outlined"
      select
      value={formData.admin_id}
      onChange={handleChange}
    >
      <MenuItem value="">Select Admin</MenuItem>
      {admins.map((admin) => (
        <MenuItem key={admin.user_id} value={admin.user_id}>
          {admin.user_id || admin.full_name}
        </MenuItem>
      ))}
    </TextField>
  </Grid>
)}


      </Grid>
    </DialogContent>
  
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={handleSubmit} color="primary" variant="contained">
        Add
      </Button>
      <Button onClick={handleClose} color="secondary" variant="outlined">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
  
  );
};

export default AddDialog;