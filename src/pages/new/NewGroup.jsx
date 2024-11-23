import "./new.scss";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios"; // Import Axios for API requests

const NewGroup = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    groupId: "",
    groupName: "",
    campaignName: "",
    enterPressKey: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignOptions, setCampaignOptions] = useState([]); // For dynamic campaign names
  const [openDialog, setOpenDialog] = useState(false); // State to control Dialog visibility
  const [currentField, setCurrentField] = useState(""); // To track which field's info to display
  const [groups, setGroups] = useState([]); // State to store fetched groups
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  }); // For notifications

  // Mapping of field names to their detailed descriptions
  const fieldDetails = {
    groupId: "Unique identifier for the group. It cannot be changed once set.",
    groupName: "Name of the group. It should be descriptive and unique.",
    campaignName: "Name of your Campaign.",
    enterPressKey:
      "Enter the key to be pressed for specific actions within the group.",
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("https://api.example.com/campaigns");
        setCampaignOptions(response.data.campaigns); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        // Fallback to predefined campaigns if API fails
        setCampaignOptions([
          { id: 1, name: "Sales Team" },
          { id: 2, name: "HR Team" },
          { id: 3, name: "Software Team" },
        ]);
      }
    };

    fetchCampaigns();
  }, []);

  // Fetch groups to display in the table
  useEffect(() => {
    const getGroups = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("https://api.example.com/get-groups");
        setGroups(response.data.groups); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching group data:", error);
        // Fallback to mock data if API fails
        setGroups([
          {
            groupId: "GRP001",
            groupName: "Marketing Group",
            campaignName: "Summer Sale",
            enterPressKey: "1",
          },
          // Add more mock groups as needed
        ]);
      }
    };

    getGroups();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Validate form data
  const validate = () => {
    let newErrors = {};

    // groupId Validation
    if (!formData.groupId.trim()) {
      newErrors.groupId = "Group ID is required";
    }

    // groupName Validation
    if (!formData.groupName.trim()) {
      newErrors.groupName = "Group Name is required";
    }

    // campaignName Validation
    if (!formData.campaignName.trim()) {
      newErrors.campaignName = "Campaign Name is required";
    }

    // enterPressKey Validation
    if (!formData.enterPressKey.trim()) {
      newErrors.enterPressKey = "Enter Press Key is required";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true); // Set loading state

      try {
        const formDataToSubmit = new FormData(); // Use FormData for file uploads
        formDataToSubmit.append("groupId", formData.groupId);
        formDataToSubmit.append("groupName", formData.groupName);
        formDataToSubmit.append("campaignName", formData.campaignName);
        formDataToSubmit.append("enterPressKey", formData.enterPressKey);

        if (formData.file) {
          formDataToSubmit.append("file", formData.file);
        }

        // Example API URL - Replace with your actual API endpoint
        const response = await axios.post(
          "https://api.example.com/create-group",
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data", // For file uploads
            },
          }
        );

        console.log("Group created successfully:", response.data);
        setIsSubmitting(false); // Reset loading state

        // Optional: Reset form fields after successful submission
        setFormData({
          groupId: "",
          groupName: "",
          campaignName: "",
          enterPressKey: "",
        });
        setFile(null);

        // Refresh group list
        const updatedGroups = await axios.get(
          "https://api.example.com/get-groups"
        );
        setGroups(updatedGroups.data.groups);

        // Show success snackbar
        setSnackbar({
          open: true,
          message: "Group created successfully!",
          severity: "success",
        });
      } catch (error) {
        console.error("Error submitting the form:", error);
        setIsSubmitting(false); // Reset loading state
        // Show error snackbar
        setSnackbar({
          open: true,
          message: "Failed to create group.",
          severity: "error",
        });
      }
    } else {
      console.log("Form has errors");
      setSnackbar({
        open: true,
        message: "Please fix the errors in the form.",
        severity: "warning",
      });
    }
  };

  // Handle opening the Dialog with specific field details
  const handleOpenDialog = (field) => {
    setCurrentField(field);
    setOpenDialog(true);
  };

  // Handle closing the Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentField("");
  };

  // Handle closing the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle Edit Group
  const handleEditGroup = (group) => {
    // Implement edit functionality, e.g., open a form with group data
    console.log("Edit Group:", group);
    // You can set the formData to the selected group's data to allow editing
  };

  // Handle Delete Group
  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`https://api.example.com/delete-group/${groupId}`);
      console.log(`Group ${groupId} deleted successfully.`);

      const updatedGroups = await axios.get(
        "https://api.example.com/get-groups"
      );
      setGroups(updatedGroups.data.groups);

      setSnackbar({
        open: true,
        message: "Group deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting group:", error);

      setSnackbar({
        open: true,
        message: "Failed to delete group.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        Add New Group
      </Typography>

      {/* Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Group ID */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="groupId"
                    sx={{ fontWeight: 500 }}
                  >
                    Group ID
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("groupId")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  id="groupId"
                  name="groupId"
                  placeholder="Enter Group ID"
                  value={formData.groupId}
                  onChange={handleInputChange}
                  error={Boolean(errors.groupId)}
                  helperText={errors.groupId}
                  fullWidth
                />
              </FormControl>
            </Grid>

            {/* Group Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="groupName"
                    sx={{ fontWeight: 500 }}
                  >
                    Group Name
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("groupName")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  id="groupName"
                  name="groupName"
                  placeholder="Enter Group Name"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  error={Boolean(errors.groupName)}
                  helperText={errors.groupName}
                  fullWidth
                />
              </FormControl>
            </Grid>

            {/* Campaign Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(errors.campaignName)}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography
                    variant="subtitle1"
                    component="label"
                    id="campaign-name-label"
                    sx={{ fontWeight: 500 }}
                  >
                    Campaign Name
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("campaignName")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Select
                  labelId="campaign-name-label"
                  id="campaignName"
                  name="campaignName"
                  value={formData.campaignName}
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Campaign</em>
                  </MenuItem>
                  {campaignOptions.map((campaign) => (
                    <MenuItem key={campaign.id} value={campaign.name}>
                      {campaign.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.campaignName && (
                  <Typography variant="caption" color="error">
                    {errors.campaignName}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Enter Press Key */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="enterPressKey"
                    sx={{ fontWeight: 500 }}
                  >
                    Enter Press Key
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("enterPressKey")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  id="enterPressKey"
                  name="enterPressKey"
                  placeholder="Enter Press Key"
                  value={formData.enterPressKey}
                  onChange={handleInputChange}
                  error={Boolean(errors.enterPressKey)}
                  helperText={errors.enterPressKey}
                  fullWidth
                />
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={20} />}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Field Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{fieldDetails[currentField]}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewGroup;
