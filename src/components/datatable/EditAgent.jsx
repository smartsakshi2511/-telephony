import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Divider,
  MenuItem,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";

const EditAgent = ({
  openDialog,
  setOpenDialog,
  formData,
  setFormData,
  setData,
}) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // User ID: minimum 4 digits (read-only but still validate)
    if (!formData.user_id || formData.user_id.toString().length < 4) {
      newErrors.user_id = "User ID must be at least 4 digits.";
    }

    // Password: minimum 9 characters
    if (!formData.password || formData.password.length < 9) {
      newErrors.password = "Password must be more than 8 characters.";
    }

    // Full name: required
    if (!formData.full_name || formData.full_name.trim().length === 0) {
      newErrors.full_name = "Full Name is required.";
    }

    // User type: required
    if (!formData.user_type) {
      newErrors.user_type = "User Type is required.";
    }

    // Agent priority: required
    if (!formData.agent_priorty) {
      newErrors.agent_priorty = "Agent Priority is required.";
    }

    // Campaigns: must select at least one
    if (!formData.campaigns_id || formData.campaigns_id.length === 0) {
      newErrors.campaigns_id = "At least one campaign must be selected.";
    }

    // External number: more than 10 digits
    if (!formData.ext_number || formData.ext_number.toString().length <= 10) {
      newErrors.ext_number = "External number must be more than 10 digits.";
    }

    // DID number: more than 10 digits
    if (!formData.use_did || formData.use_did.toString().length <= 10) {
      newErrors.use_did = "DID number must be more than 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://${window.location.hostname}:4000/campaigns_dropdown`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formattedCampaigns = response.data.map((item, index) => ({
          id: item.compaign_id || `temp-id-${index}`,
          name: item.compaign_id || "Unnamed Campaign",
        }));

        setCampaigns(formattedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Ensure campaigns_id is always an array
  useEffect(() => {
    if (formData.campaigns_id && !Array.isArray(formData.campaigns_id)) {
      setFormData((prev) => ({
        ...prev,
        campaigns_id: [prev.campaigns_id],
      }));
    }
  }, [formData.campaigns_id]);

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
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

    if (!formData.user_id || !formData.password || !formData.full_name) {
      Toast.fire({
        icon: "error",
        title: "User ID, Password, and Full Name are required.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const campaignNames = Array.isArray(formData.campaigns_id)
        ? formData.campaigns_id.map(
          (id) => campaigns.find((c) => c.id === id)?.name || ""
        )
        : [];

      const response = await axios.put(
        `https://${window.location.hostname}:4000/telephony/agents/${formData.user_id}`,
        {
          password: formData.password,
          full_name: formData.full_name,
          status: formData.status,
          user_type: formData.user_type,
          agent_priorty: formData.agent_priorty,
          campaigns_id: formData.campaigns_id,
          campaign_name: campaignNames,
          use_did: formData.use_did,
          ext_number: formData.ext_number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prevData) =>
        prevData.map((item) =>
          item.user_id === formData.user_id ? { ...item, ...formData } : item
        )
      );

      Toast.fire({
        icon: "success",
        title: response.data.message || "User updated successfully",
      });

      setTimeout(() => {
        handleDialogClose();
      }, 100);
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update user. Please try again.";
      Toast.fire({ icon: "error", title: errorMessage });
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          boxShadow: 5,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 1, fontSize: "1.25rem" }}>
        Edit User
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ my: 1.5, borderColor: "grey.300" }} />

      <DialogContent sx={{ px: 3, py: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              label="User ID"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              disabled
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          {/* <Grid item xs={6}>
            <TextField
              label="User Type"
              name="user_type"
              value={formData.user_type}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid> */}
          <Grid item xs={6}>
            <TextField
              label="Agent Priority"
              name="agent_priorty"
              value={formData.agent_priorty}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label="Campaigns"
              name="campaigns_id"
              SelectProps={{
                multiple: true,
                value: Array.isArray(formData.campaigns_id)
                  ? formData.campaigns_id
                  : [],
                onChange: (e) =>
                  setFormData((prev) => ({
                    ...prev,
                    campaigns_id: e.target.value,
                  })),
                renderValue: (selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      maxHeight: 80,
                      overflowY: "auto",
                    }}
                  >
                    {selected.map((id) => (
                      <Chip
                        key={id}
                        label={campaigns.find((opt) => opt.id === id)?.name || id}
                        onMouseDown={(e) => e.stopPropagation()} // dropdown na khule
                        onDelete={() =>
                          setFormData((prev) => ({
                            ...prev,
                            campaigns_id: prev.campaigns_id.filter(
                              (item) => item !== id
                            ),
                          }))
                        }
                      />
                    ))}
                  </Box>
                ),
              }}
              fullWidth
              margin="dense"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            >
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                campaigns.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))
              )}
            </TextField>

          </Grid>

          <Grid item xs={6}>
            <TextField
              label="DID Number"
              name="use_did"
              value={formData.use_did || ""}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="External Number"
              name="ext_number"
              value={formData.ext_number || ""}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ py: 1.5, px: 3 }}>
        <Button
          onClick={handleUpdate}
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAgent;
