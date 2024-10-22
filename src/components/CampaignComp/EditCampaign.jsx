// src/components/EditDialog/EditDialog.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
  Input,
  Typography,
} from "@mui/material";
import axios from "axios";

const EditDialog = ({ open, onClose, data, onSave }) => {
  const [tempData, setTempData] = useState({ ...data });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setTempData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setTempData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? (checked ? "active" : "deactive") : value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.keys(tempData).forEach((key) => {
        formData.append(key, tempData[key]);
      });

      await axios.put(`https://api.example.com/campaigns/${data.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSave(tempData);
      onClose();
    } catch (error) {
      console.error("Error updating campaign:", error);
      // Optionally, handle error (e.g., show notification)
    }
  };

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Campaign</DialogTitle>
      <DialogContent>
        <form>
          <Grid container spacing={2}>
            {/* CAMP ID */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="CAMP ID"
                name="campId"
                value={tempData.campId || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            {/* NAME */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={tempData.name || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            {/* ACTIVE Status */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tempData.status === "active"}
                    onChange={handleInputChange}
                    name="status"
                    color="primary"
                  />
                }
                label={tempData.status === "active" ? "Active" : "Deactive"}
              />
            </Grid>
            {/* INBOUND CID */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Inbound CID"
                name="inboundCID"
                value={tempData.inboundCID || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            {/* OUTBOUND CID */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Outbound CID"
                name="outboundCID"
                value={tempData.outboundCID || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            {/* CALL TIME */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Call Time"
                name="callTime"
                type="time"
                value={tempData.callTime || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
            {/* WEEK OFF */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Week Off"
                name="weekOff"
                value={tempData.weekOff || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                helperText="Enter days separated by commas (e.g., Saturday, Sunday)"
              />
            </Grid>
            {/* WEL. IVR */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                WEL. IVR
              </Typography>
              {tempData.welIVR && typeof tempData.welIVR === "string" && (
                <audio controls src={tempData.welIVR}>
                  Your browser does not support the audio element.
                </audio>
              )}
              <Input
                type="file"
                name="welIVR"
                onChange={handleInputChange}
                fullWidth
                inputProps={{ accept: "audio/*" }}
              />
            </Grid>
            {/* AFTER IVR */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="AFTER IVR"
                name="afterIVR"
                value={tempData.afterIVR || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            {/* PARK MUSIC (Call on Hold Music) */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Call on Hold Music (Park Music)
              </Typography>
              {tempData.parkMusic && typeof tempData.parkMusic === "string" && (
                <audio controls src={tempData.parkMusic}>
                  Your browser does not support the audio element.
                </audio>
              )}
              <Input
                type="file"
                name="parkMusic"
                onChange={handleInputChange}
                fullWidth
                inputProps={{ accept: "audio/*" }}
              />
            </Grid>
            {/* No Agent IVR */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                No Agent IVR
              </Typography>
              {tempData.noAgentIVR && typeof tempData.noAgentIVR === "string" && (
                <audio controls src={tempData.noAgentIVR}>
                  Your browser does not support the audio element.
                </audio>
              )}
              <Input
                type="file"
                name="noAgentIVR"
                onChange={handleInputChange}
                fullWidth
                inputProps={{ accept: "audio/*" }}
              />
            </Grid>
            {/* RingTone Music */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                RingTone Music
              </Typography>
              {tempData.ringToneMusic && typeof tempData.ringToneMusic === "string" && (
                <audio controls src={tempData.ringToneMusic}>
                  Your browser does not support the audio element.
                </audio>
              )}
              <Input
                type="file"
                name="ringToneMusic"
                onChange={handleInputChange}
                fullWidth
                inputProps={{ accept: "audio/*" }}
              />
            </Grid>
            {/* Add more fields as necessary */}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default EditDialog;
