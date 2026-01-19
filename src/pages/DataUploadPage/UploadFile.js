import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  LinearProgress,
  Grid,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const UploadLeadDialog = ({ openDialog, handleCloseDialog, listId, campaign }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !listId) {
      Swal.fire({
        icon: "warning",
        title: "Please select a file and a list ID.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append("excel", selectedFile);
    formData.append("list_id", listId);
    formData.append("campaign_id", campaign);

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication failed. Please log in.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      setUploading(true);

      const response = await axios.post(
        `https://${window.location.hostname}:4000/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: `Upload Successful! Rows Processed: ${response.data.successCount}`,
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });

      // ✅ Reset and close
      setSelectedFile(null);
      setProgress(0);
      handleCloseDialog();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Upload Failed: ${error.response?.data?.error || "Server Error"}`,
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      BackdropProps={{ invisible: true }}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px",
          boxShadow: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        Upload Lead
        <IconButton onClick={handleCloseDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="List ID"
              variant="outlined"
              fullWidth
              disabled
              value={listId}
              InputLabelProps={{ shrink: true }}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Campaign"
              variant="outlined"
              fullWidth
              disabled
              value={campaign}
              InputLabelProps={{ shrink: true }}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 3,
            p: 2,
            textAlign: "center",
            border: "1px dashed #ccc",
            borderRadius: "10px",
            backgroundColor: "#fafafa",
          }}
        >
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Choose File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".xls,.xlsx,.csv"
            />
          </Button>
          {selectedFile && (
            <Typography
              variant="body2"
              sx={{ mt: 1, fontWeight: 500, color: "#444" }}
            >
              {selectedFile.name}
            </Typography>
          )}
        </Box>

        {uploading && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleCloseDialog}
          color="inherit"
          variant="outlined"
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={uploading}
          sx={{
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadLeadDialog;
