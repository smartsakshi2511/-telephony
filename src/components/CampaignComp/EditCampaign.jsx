import  { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import Swal from 'sweetalert2';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";

const EditDialog = ({ open, onClose, data }) => {
  const [form, setForm] = useState({ ...data });
  const [files, setFiles] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
  
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://${window.location.hostname}:4000/campaigns/editCampaign/${data.compaign_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
 
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
  
      Toast.fire({
        icon: "success",
        title: "Campaign updated successfully",
      });
  
      onClose({ ...form });
    } catch (error) {
      console.error("Failed to update campaign:", error);
 
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update campaign!",
      });
    }
  };
  
  const fileFields = [
    { label: "Welcome IVR", name: "welcome_ivr" },
    { label: "After Office IVR", name: "after_office_ivr" },
    { label: "Music On Hold", name: "music_on_hold" },
    { label: "Ring Tone Music", name: "ring_tone_music" },
    { label: "No Agent IVR", name: "no_agent_ivr" },
    { label: "Week Off IVR", name: "week_off_ivr" },
  ];

  return (
    <Dialog open={open} onClose={() => onClose(null)} fullWidth maxWidth="md">
      <DialogTitle>Edit Campaign</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Campaign Name"
              name="compaignname"
              value={form.compaignname || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Campaign Type</InputLabel>
              <Select
                name="campaign_dis"
                value={form.campaign_dis || ""}
                onChange={handleChange}
                label="Campaign Type"
              >
                <MenuItem value="both">Both</MenuItem>
                <MenuItem value="inbound">Inbound</MenuItem>
                <MenuItem value="outbound">Outbound</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Inbound"
              name="campaign_number"
              value={form.campaign_number || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Outbound CLI"
              name="outbond_cli"
              value={form.outbond_cli || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Auto Dial Level</InputLabel>
              <Select
                name="auto_dial_level"
                value={form.auto_dial_level ?? ""}
                onChange={handleChange}
                label="Auto Dial Level"
              >       
                   <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {[...Array(11).keys()].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}     
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Auto Dial Status</InputLabel>
              <Select
                name="status"
                value={form.auto_dial_status ?? ""}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="0">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Call Time</InputLabel>
              <Select
                name="local_call_time"
                value={form.local_call_time ?? ""}
                onChange={handleChange}
                label="Call Time"
              >
                <MenuItem value="12am-11pm">24 hours</MenuItem>
                <MenuItem value="9am-6pm">9am - 6pm</MenuItem>
                <MenuItem value="10am-6pm">10am - 6pm</MenuItem>
                <MenuItem value="10am-7pm">10am - 7pm</MenuItem>
                <MenuItem value="12pm-5pm">12pm - 5pm</MenuItem>
                <MenuItem value="12pm-9pm">12pm - 9pm</MenuItem>
                <MenuItem value="5pm-9pm">5pm - 9pm</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Week Off</InputLabel>
              <Select
                name="week_off"
                value={form.week_off ?? ""}
                onChange={handleChange}
                label="Week Off"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Sunday">Sunday</MenuItem>
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
                <MenuItem value="SaturdaytoSunday">Saturday to Sunday</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Ring Time</InputLabel>
              <Select
                name="ring_time"
                value={form.ring_time ?? ""}
                onChange={handleChange}
                label="Ring Time"
              >
                <MenuItem value="60">60 SECONDS</MenuItem>
                <MenuItem value="45">45 SECONDS</MenuItem>
                <MenuItem value="30">30 SECONDS</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
                     <FormControl fullWidth variant="outlined">
                       <InputLabel id="ringType-label">Select Ring Type</InputLabel>
                       <Select
                         labelId="ringType-label"
                         name="type"
                         value={form.type || ""} // This will show the fetched value
                         onChange={handleChange}
                         label="Select Ring Type"
                       >
                         <MenuItem value="random">Random</MenuItem>
                         <MenuItem value="rank">Rank</MenuItem>
                         <MenuItem value="ring_all">Ring All</MenuItem>
                         <MenuItem value="longest_wait_time">Longest Wait Time</MenuItem>
                       </Select>
                     </FormControl>
                   </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Lead Form</InputLabel>
              <Select
                name="script_notes"
                value={form.script_notes ?? ""}
                onChange={handleChange}
                label="Lead Form"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="active">Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Call Route</InputLabel>
              <Select
                name="ivr"
                value={form.ivr ?? ""}
                onChange={handleChange}
                label="Call Route"
              >
                <MenuItem value="0">NONE</MenuItem>
                <MenuItem value="1">Extension Wise</MenuItem>
                {/* <MenuItem value="2">Call Menu</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>

          {fileFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor={field.name}
                  >
                    {field.label}
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => console.log("info clicked:", field.name)}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DriveFolderUploadOutlinedIcon />}
                >
                  {files[field.name]?.name || "Choose File"}
                  <input
                    type="file"
                    id={field.name}
                    name={field.name}
                    accept=".wav"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </FormControl>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
