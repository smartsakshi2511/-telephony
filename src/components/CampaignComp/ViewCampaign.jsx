import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
  Chip,
} from "@mui/material";

const ViewDialog = ({ open, onClose, data }) => {
  if (!data) return null;

  const displayFields = [
    "campaign_id",
    "campaignname",
    "campaign_number",
    "outbond_cli",
    "campaign_dis",
    "week_off",
    "music_on_hold",
    "welcome_ivr",
    "after_office_ivr",
    "week_off_ivr",
    "ring_tone_music",
    "no_agent_ivr",
  ];

  const getAudioUrl = (path) => `https://${window.location.hostname}:4000/${path}`;

  const getStatusChip = (status) => {
    const statusColors = {
      active: "success",
      inactive: "default",
      pending: "warning",
      closed: "error",
    };
    return (
      <Chip
        label={status.toUpperCase()}
        color={statusColors[status.toLowerCase()] || "primary"}
        sx={{ fontWeight: "bold", fontSize: "0.85rem" }}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        Campaign Details
      </DialogTitle>
      <DialogContent dividers sx={{ padding: "20px" }}>
        <Grid container spacing={3}>
          {displayFields
            .filter((key) => data[key] !== undefined) // Ensure only existing fields are shown
            .map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <Paper
                  sx={{
                    padding: "12px",
                    borderRadius: "10px",
                    boxShadow: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.95rem",
                      color: "#555",
                    }}
                  >
                    {key.replace(/_/g, " ").toUpperCase()}:
                  </Typography>

                  {key === "status" ? (
                    getStatusChip(data[key])
                  ) : typeof data[key] === "string" &&
                    data[key].startsWith("uploads/") ? (
                    <audio controls style={{ width: "100%", marginTop: "5px" }}>
                      <source
                        src={getAudioUrl(data[key])}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "1rem", color: "#333" }}
                    >
                      {data[key]}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          sx={{ fontSize: "1rem" }}
        >
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
