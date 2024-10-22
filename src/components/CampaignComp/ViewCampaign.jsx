// src/components/ViewDialog/ViewDialog.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";

const ViewDialog = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Campaign Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Example Fields */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">CAMP ID:</Typography>
            <Typography variant="body1">{data.campId}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Name:</Typography>
            <Typography variant="body1">{data.name}</Typography>
          </Grid>
          {/* Add more fields as necessary */}
          {/* Audio Fields */}
          {data.welIVR && typeof data.welIVR === "string" && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">WEL. IVR:</Typography>
              <audio controls src={data.welIVR}>
                Your browser does not support the audio element.
              </audio>
            </Grid>
          )}
          {/* Repeat for other audio fields */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default ViewDialog;
