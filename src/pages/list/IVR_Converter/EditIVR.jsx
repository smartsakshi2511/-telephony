import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const EditDialog = ({ open, onClose, onSave, selectedIvr }) => {
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [ivr, setIvr] = useState({
    campaign_name: selectedIvr?.campaign_name || "",
    type: selectedIvr?.type || "",
    file_name: selectedIvr?.file_name || "",
    date: selectedIvr?.date || "",
  });

  // Fetch Campaigns when dialog opens
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://${window.location.hostname}:4000/campaigns_dropdown`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched Campaigns:", response.data);
        setCampaignOptions(response.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    if (open) fetchCampaigns();
  }, [open]);
  

  // Update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Selected Campaign - Name: ${name}, Value: ${value}`);
    setIvr((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Save Click
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Sending Update Data:", ivr);

      await axios.put(
        `https://${window.location.hostname}:4000/updateSpeech/${selectedIvr.id}`,
        ivr,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSave(); // Refresh parent component
      onClose();
    } catch (error) {
      console.error("Error updating IVR:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit IVR</DialogTitle>
      <DialogContent>
        {/* <TextField
          label="Type"
          fullWidth
          name="type"
          value={ivr.type}
          onChange={handleChange}
        /> */}


<TextField
  select
  margin="dense"
  fullWidth
  name="type"
  value={ivr.type}
  onChange={handleChange}
>
  <MenuItem value="">-- Select Type --</MenuItem>
  <MenuItem value="welcome IVR">Welcome IVR</MenuItem>
  <MenuItem value="AfterOffice">After Office IVR</MenuItem>
  <MenuItem value="moh">MOH FILE</MenuItem>
</TextField>


        {/* Campaign Dropdown */}
        <TextField
  select
  name="campaign_name"
  value={ivr.campaign_name}
  onChange={handleChange}
>
  {campaignOptions.map((option) => (
    <MenuItem key={option.id} value={option.id}>
      {option.label}
    </MenuItem>
  ))}
</TextField>


        <TextField
          label="File"
          fullWidth
          name="file_name"
          value={ivr.file_name}
          onChange={handleChange}
        />

        <TextField
          label="Date"
          fullWidth
          name="date"
          value={ivr.date}
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
