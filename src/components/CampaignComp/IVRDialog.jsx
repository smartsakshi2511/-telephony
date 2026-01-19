import   { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
} from "@mui/material";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import axios from "axios";
 const formData = new FormData(); 
const IVRDialog = ({ open, onClose, campaign }) => {
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false); 
  const ivrFields = [
    { label: "Welcome IVR", name: "welcome_ivr" },
    { label: "After Office IVR", name: "after_office_ivr" },
    { label: "Music On Hold", name: "music_on_hold" },
    { label: "Ring Tone Music", name: "ring_tone_music" },
    { label: "No Agent IVR", name: "no_agent_ivr" },
    { label: "Week Off IVR", name: "week_off_ivr" },
  ]; 
  const getAudioUrl = (path) =>
    path && path.startsWith("uploads/")
      ? `https://${window.location.hostname}:4000/${path}`
      : null;

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // Upload or update selected IVRs (reusing editCampaign)
const handleUpdate = async () => {
  if (Object.keys(files).length === 0) {
    Swal.fire({
      icon: "info",
      title: "No Files Selected",
      text: "Please choose at least one IVR file to upload.",
    });
    return;
  }

 
  Object.entries(campaign).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  }); 
  Object.entries(files).forEach(([key, file]) => {
    if (file) formData.set(key, file); // replace old field
  });

  try {
    setUploading(true);
    const token = localStorage.getItem("token");

    await axios.put(
      `https://${window.location.hostname}:4000/campaigns/editCampaign/${campaign.compaign_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      toast: true,
      icon: "success",
      title: "IVRs updated successfully!",
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
    });

    onClose(true);
  } catch (error) {
    console.error("IVR update failed:", error);
    Swal.fire("Error", "Failed to update IVR files.", "error");
  } finally {
    setUploading(false);
  }
}; 
  const handleRemoveAll = async () => {
    Swal.fire({
      title: "Remove all IVRs?",
      text: "This will permanently delete all IVR audio files for this campaign.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove all",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.put(
            `https://${window.location.hostname}:4000/campaigns/clearIvr/${campaign.compaign_id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          Swal.fire("Removed!", "All IVRs deleted successfully.", "success");
          onClose(true);
        } catch (err) {
          Swal.fire("Error", "Failed to remove IVRs.", "error");
        }
      }
    });
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      {!campaign ? (
        <DialogContent>
          <Typography sx={{ textAlign: "center", py: 4 }}>
            Loading campaign details...
          </Typography>
        </DialogContent>
      ) : (
        <>
          <DialogTitle
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              borderBottom: "1px solid #eee",
            }}
          >
            Manage IVRs for: {campaign?.compaignname || "N/A"}
          </DialogTitle>

          {uploading && <LinearProgress color="primary" />}

          <DialogContent dividers>
            <Grid container spacing={3}>
              {ivrFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        mb: 1,
                        color: "#444",
                        fontSize: "0.95rem",
                      }}
                    >
                      {field.label}
                    </Typography>

                    {getAudioUrl(campaign[field.name]) ? (
                      <audio
                        controls
                        style={{
                          width: "100%",
                          borderRadius: "4px",
                          marginBottom: "8px",
                        }}
                      >
                        <source
                          src={getAudioUrl(campaign[field.name])}
                          type="audio/mpeg"
                        />
                      </audio>
                    ) : (
                      <Typography
                        sx={{ fontSize: "0.85rem", color: "#999", mb: 1 }}
                      >
                        No IVR uploaded
                      </Typography>
                    )}

                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<DriveFolderUploadOutlinedIcon />}
                    >
                      {files[field.name]?.name || "Upload New Audio"}
                      <input
                        type="file"
                        accept=".wav,.mp3"
                        name={field.name}
                        hidden
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
            <Tooltip title="Remove all IVRs">
              <IconButton color="error" onClick={handleRemoveAll}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={() => onClose(false)}>Cancel</Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
              disabled={uploading}
            >
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default IVRDialog;
