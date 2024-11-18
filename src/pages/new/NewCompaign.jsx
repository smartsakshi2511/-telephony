 
import React, { useState, useEffect } from "react";
import "./new.scss"; // Retain if you have additional styles
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios"; // Import Axios for API requests

// MUI Components
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Switch,
  Grid,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

const NewcCampaign = ({ title }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    campaignId: "",
    campaignName: "",
    campaignType: "",
    inboundCID: "",
    outboundCID: "",
    welcomeIVR: null,
    afterOfficeIVR: null,
    callOnHoldMusic: null,
    ringToneMusic: null,
    noAgentIVR: null,
    weekOffIVR: null,
    active: "",
    callTime: "",
    ringTime: "",
    autoDialLevel: "",
    ringType: "",
    callingTime: "",
    weekOff: "",
    leadForm: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state
  const [campaignOptions, setCampaignOptions] = useState([]); // For dynamic campaign names
  const [openDialog, setOpenDialog] = useState(false); // State to control Dialog visibility
  const [currentField, setCurrentField] = useState(""); // To track which field's info to display
  const [campaigns, setCampaigns] = useState([]); // State to store fetched campaigns

  // Mapping of field names to their detailed descriptions
  const fieldDetails = {
    campaignId: "Unique identifier for the campaign. It cannot be changed once set.",
    campaignName: "Name of the campaign. It should be descriptive and unique.",
    campaignType: "Type of the campaign, e.g., Marketing, Support, Sales.",
    inboundCID: "Inbound Caller ID (CLI/DID) assigned to the campaign.",
    outboundCID: "Outbound Caller ID (CLD/DID) assigned to the campaign.",
    welcomeIVR: "Welcome Interactive Voice Response file for the campaign.",
    afterOfficeIVR: "After Office IVR file for the campaign.",
    callOnHoldMusic: "Music to play when calls are on hold.",
    ringToneMusic: "Ringtone music for incoming calls.",
    noAgentIVR: "IVR file for scenarios when no agent is available.",
    weekOffIVR: "IVR file to handle week-off schedules.",
    active: "Status of the campaign. Determines if the campaign is active.",
    callTime: "Duration for call timing, e.g., 60 seconds.",
    ringTime: "Duration for ring time before going to voicemail.",
    autoDialLevel: "Auto Dial Level setting (0 = off).",
    ringType: "Type of ringing, e.g., random, sequential.",
    callingTime: "Time settings for when calls are allowed.",
    weekOff: "Days designated as week-offs for the campaign.",
    leadForm: "Lead form associated with the campaign.",
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

  // Fetch campaigns to display in the table
  useEffect(() => {
    const getCampaigns = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("https://api.example.com/get-campaigns");
        setCampaigns(response.data.campaigns); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        // Fallback to mock data if API fails
        setCampaigns([
          {
            campaignId: "CAMP001",
            campaignName: "Summer Sale",
            campaignType: "Marketing",
            inboundCID: "1234567890",
            outboundCID: "0987654321",
            welcomeIVR: null,
            afterOfficeIVR: null,
            callOnHoldMusic: null,
            ringToneMusic: null,
            noAgentIVR: null,
            weekOffIVR: null,
            active: "Yes",
            callTime: "60 SECONDS",
            ringTime: "30 SECONDS",
            autoDialLevel: "0",
            ringType: "Random",
            callingTime: "24hours",
            weekOff: "Sunday",
            leadForm: "https://example.com/lead-form",
          },
          // Add more mock campaigns as needed
        ]);
      }
    };

    getCampaigns();
  }, []);

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

    // campaignId Validation
    if (!formData.campaignId.trim()) {
      newErrors.campaignId = "Campaign ID is required";
    }

    // campaignName Validation
    if (!formData.campaignName.trim()) {
      newErrors.campaignName = "Campaign Name is required";
    }

    // campaignType Validation
    if (!formData.campaignType.trim()) {
      newErrors.campaignType = "Campaign Type is required";
    }

    // inboundCID Validation
    if (!formData.inboundCID.trim()) {
      newErrors.inboundCID = "Inbound CID is required";
    }

    // outboundCID Validation
    if (!formData.outboundCID.trim()) {
      newErrors.outboundCID = "Outbound CID is required";
    }

    // active Validation
    if (!formData.active) {
      newErrors.active = "Please select active status";
    }

    // callTime Validation
    if (!formData.callTime.trim()) {
      newErrors.callTime = "Call Time is required";
    }

    // ringTime Validation
    if (!formData.ringTime.trim()) {
      newErrors.ringTime = "Ring Time is required";
    }


    if (!formData.autoDialLevel.trim()) {
      newErrors.autoDialLevel = "Auto Dial Level is required";
    }

    if (!formData.ringType.trim()) {
      newErrors.ringType = "Ring Type is required";
    }

    if (!formData.callingTime.trim()) {
      newErrors.callingTime = "Calling Time is required";
    }

    if (!formData.weekOff.trim()) {
      newErrors.weekOff = "Week Off is required";
    }
    if (!formData.leadForm.trim()) {
      newErrors.leadForm = "Lead Form URL is required";
    } else if (
      !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.leadForm)
    ) {
      newErrors.leadForm = "Lead Form URL is invalid";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true); // Set loading state

      try {
        const formDataToSubmit = new FormData(); // Use FormData for file uploads
        formDataToSubmit.append("campaignId", formData.campaignId);
        formDataToSubmit.append("campaignName", formData.campaignName);
        formDataToSubmit.append("campaignType", formData.campaignType);
        formDataToSubmit.append("inboundCID", formData.inboundCID);
        formDataToSubmit.append("outboundCID", formData.outboundCID);
        formDataToSubmit.append("active", formData.active);
        formDataToSubmit.append("callTime", formData.callTime);
        formDataToSubmit.append("ringTime", formData.ringTime);
        formDataToSubmit.append("autoDialLevel", formData.autoDialLevel);
        formDataToSubmit.append("ringType", formData.ringType);
        formDataToSubmit.append("callingTime", formData.callingTime);
        formDataToSubmit.append("weekOff", formData.weekOff);
        formDataToSubmit.append("leadForm", formData.leadForm);

        // Append files if they exist
        if (formData.welcomeIVR) {
          formDataToSubmit.append("welcomeIVR", formData.welcomeIVR);
        }
        if (formData.afterOfficeIVR) {
          formDataToSubmit.append("afterOfficeIVR", formData.afterOfficeIVR);
        }
        if (formData.callOnHoldMusic) {
          formDataToSubmit.append("callOnHoldMusic", formData.callOnHoldMusic);
        }
        if (formData.ringToneMusic) {
          formDataToSubmit.append("ringToneMusic", formData.ringToneMusic);
        }
        if (formData.noAgentIVR) {
          formDataToSubmit.append("noAgentIVR", formData.noAgentIVR);
        }
        if (formData.weekOffIVR) {
          formDataToSubmit.append("weekOffIVR", formData.weekOffIVR);
        }

        // Example API URL - Replace with your actual API endpoint
        const response = await axios.post(
          "https://api.example.com/create-campaign",
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data", // For file uploads
            },
          }
        );

        console.log("Campaign created successfully:", response.data);
        setIsSubmitting(false); // Reset loading state

        // Optional: Reset form fields after successful submission
        setFormData({
          campaignId: "",
          campaignName: "",
          campaignType: "",
          inboundCID: "",
          outboundCID: "",
          welcomeIVR: null,
          afterOfficeIVR: null,
          callOnHoldMusic: null,
          ringToneMusic: null,
          noAgentIVR: null,
          weekOffIVR: null,
          active: "",
          callTime: "",
          ringTime: "",
          autoDialLevel: "",
          ringType: "",
          callingTime: "",
          weekOff: "",
          leadForm: "",
        });
        setFile(null);

        // Refresh campaign list
        const updatedCampaigns = await axios.get(
          "https://api.example.com/get-campaigns"
        );
        setCampaigns(updatedCampaigns.data.campaigns);
      } catch (error) {
        console.error("Error submitting the form:", error);
        setIsSubmitting(false); // Reset loading state
        // Optional: Handle error (e.g., show a notification)
      }
    } else {
      console.log("Form has errors");
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

  // Handle Edit Campaign
  const handleEditCampaign = (campaign) => {
    // Implement edit functionality, e.g., open a form with campaign data
    console.log("Edit Campaign:", campaign);
  };

  // Handle Delete Campaign
  const handleDeleteCampaign = async (campaignId) => {
    try {
      // Replace with your actual API endpoint
      await axios.delete(`https://api.example.com/delete-campaign/${campaignId}`);
      console.log(`Campaign ${campaignId} deleted successfully.`);
      // Refresh campaign list
      const updatedCampaigns = await axios.get(
        "https://api.example.com/get-campaigns"
      );
      setCampaigns(updatedCampaigns.data.campaigns);
    } catch (error) {
      console.error("Error deleting campaign:", error);
      // Optional: Handle error (e.g., show a notification)
    }
  };

  return (
    <Box display="flex" className="newContainer">
      <Box flex={6} p={2}>


        {/* Top Section */}
        <Box mb={4}>
          <Typography variant="h4" component="h1">
            Add New Campaign
          </Typography>
        </Box>

        {/* Form Section */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            backgroundColor: "#f9f9f9",
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >


          <Grid container spacing={3}>
            {/* Campaign ID */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" component="label" htmlFor="campaignId">
                    Campaign ID
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("campaignId")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  id="campaignId"
                  name="campaignId"
                  placeholder="Enter Campaign ID"
                  value={formData.campaignId}
                  onChange={handleInputChange}
                  error={Boolean(errors.campaignId)}
                  helperText={errors.campaignId}
                  fullWidth
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            {/* Campaign Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" component="label" htmlFor="campaignName">
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
                <TextField
                  id="campaignName"
                  name="campaignName"
                  placeholder="Enter Campaign Name"
                  value={formData.campaignName}
                  onChange={handleInputChange}
                  error={Boolean(errors.campaignName)}
                  helperText={errors.campaignName}
                  fullWidth
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

          
            {/* Inbound CID */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" component="label" htmlFor="inboundCID">
                    Inbound (CLI/DID)
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("inboundCID")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  id="inboundCID"
                  name="inboundCID"
                  placeholder="Enter Inbound CID"
                  value={formData.inboundCID}
                  onChange={handleInputChange}
                  error={Boolean(errors.inboundCID)}
                  helperText={errors.inboundCID}
                  fullWidth
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            {/* Outbound CID */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" component="label" htmlFor="outboundCID">
                    Outbound (CLD/DID)
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("outboundCID")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  id="outboundCID"
                  name="outboundCID"
                  placeholder="Enter Outbound CID"
                  value={formData.outboundCID}
                  onChange={handleInputChange}
                  error={Boolean(errors.outboundCID)}
                  helperText={errors.outboundCID}
                  fullWidth
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>


  {/* Campaign Type */}
  <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required error={Boolean(errors.campaignType)}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" component="label" htmlFor="campaignType">
                    Campaign Type
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("campaignType")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Select
                  id="campaignType"
                  name="campaignType"
                  value={formData.campaignType}
                  onChange={handleInputChange}
                  displayEmpty
                  label="Campaign Type"
                >
                  <MenuItem value="">
                    <em>Select Campaign Type</em>
                  </MenuItem>
                  <MenuItem value="Marketing">Both</MenuItem>
                  <MenuItem value="Support">Inbound</MenuItem>
                  <MenuItem value="Sales">Outbou</MenuItem>
                  {/* Add more options as needed */}
                </Select>
                {errors.campaignType && (
                  <Typography variant="caption" color="error">
                    {errors.campaignType}
                  </Typography>
                )}
              </FormControl>
            </Grid>


              {/* Active Status */}
              <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required error={Boolean(errors.active)}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" component="label" htmlFor="active">
                    Active
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("active")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Select
                  id="active"
                  name="active"
                  value={formData.active}
                  onChange={handleInputChange}
                  displayEmpty
                  label="Active"
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
                {errors.active && (
                  <Typography variant="caption" color="error">
                    {errors.active}
                  </Typography>
                )}
              </FormControl>
            </Grid>


            {/* Welcome IVR File Upload */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" component="label" htmlFor="welcomeIVR">
                    Welcome IVR
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("welcomeIVR")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DriveFolderUploadOutlinedIcon />}
                >
                  {formData.welcomeIVR ? formData.welcomeIVR.name : "Choose File"}
                  <input
                    type="file"
                    id="welcomeIVR"
                    name="welcomeIVR"
                    accept=".mp3,.wav"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                {errors.welcomeIVR && (
                  <Typography variant="caption" color="error">
                    {errors.welcomeIVR}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* After Office IVR File Upload */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" component="label" htmlFor="afterOfficeIVR">
                    After Office IVR
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("afterOfficeIVR")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DriveFolderUploadOutlinedIcon />}
                >
                  {formData.afterOfficeIVR ? formData.afterOfficeIVR.name : "Choose File"}
                  <input
                    type="file"
                    id="afterOfficeIVR"
                    name="afterOfficeIVR"
                    accept=".mp3,.wav"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                {errors.afterOfficeIVR && (
                  <Typography variant="caption" color="error">
                    {errors.afterOfficeIVR}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Call on Hold Music File Upload */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" component="label" htmlFor="callOnHoldMusic">
                    Call on hold music
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("callOnHoldMusic")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DriveFolderUploadOutlinedIcon />}
                >
                  {formData.callOnHoldMusic ? formData.callOnHoldMusic.name : "Choose File"}
                  <input
                    type="file"
                    id="callOnHoldMusic"
                    name="callOnHoldMusic"
                    accept=".mp3,.wav"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                {errors.callOnHoldMusic && (
                  <Typography variant="caption" color="error">
                    {errors.callOnHoldMusic}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Ring Tone Music File Upload */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" component="label" htmlFor="ringToneMusic">
                    Ring Tone Music
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("ringToneMusic")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DriveFolderUploadOutlinedIcon />}
                >
                  {formData.ringToneMusic ? formData.ringToneMusic.name : "Choose File"}
                  <input
                    type="file"
                    id="ringToneMusic"
                    name="ringToneMusic"
                    accept=".mp3,.wav"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                {errors.ringToneMusic && (
                  <Typography variant="caption" color="error">
                    {errors.ringToneMusic}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* No Agent IVR File Upload */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" component="label" htmlFor="noAgentIVR">
                    No Agent IVR
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("noAgentIVR")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DriveFolderUploadOutlinedIcon />}
                >
                  {formData.noAgentIVR ? formData.noAgentIVR.name : "Choose File"}
                  <input
                    type="file"
                    id="noAgentIVR"
                    name="noAgentIVR"
                    accept=".mp3,.wav"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                {errors.noAgentIVR && (
                  <Typography variant="caption" color="error">
                    {errors.noAgentIVR}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Week Off IVR File Upload */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" component="label" htmlFor="weekOffIVR">
                    Week off IVR
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("weekOffIVR")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DriveFolderUploadOutlinedIcon />}
                >
                  {formData.weekOffIVR ? formData.weekOffIVR.name : "Choose File"}
                  <input
                    type="file"
                    id="weekOffIVR"
                    name="weekOffIVR"
                    accept=".mp3,.wav"
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
                {errors.weekOffIVR && (
                  <Typography variant="caption" color="error">
                    {errors.weekOffIVR}
                  </Typography>
                )}
              </FormControl>
            </Grid>

          
            {/* Call Time */}
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" component="label" htmlFor="callTime">
                    Call Time
                  </Typography>
                  <IconButton
                    aria-label="info"
                    size="small"
                    onClick={() => handleOpenDialog("callTime")}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  id="callTime"
                  name="callTime"
                  placeholder="e.g., 60 SECONDS"
                  value={formData.callTime}
                  onChange={handleInputChange}
                  error={Boolean(errors.callTime)}
                  helperText={errors.callTime}
                  fullWidth
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid> */}

            {/* Ring Time */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" component="label" htmlFor="ringTime">
                      Ring Time
                    </Typography>
                    <IconButton
                      aria-label="info"
                      size="small"
                      onClick={() => handleOpenDialog("ringTime")}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="ringTime">Select Ring Time</InputLabel>
                    <Select
                      name="ring_time"
                      id="ring_time"
                      label="Select Ring Time"
                      defaultValue="60"
                    >
                      <MenuItem value="60">60 SECONDS</MenuItem>
                      <MenuItem value="45">45 SECONDS</MenuItem>
                      <MenuItem value="30">30 SECONDS</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

              </FormControl>
            </Grid>

            {/* Auto Dial Level */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" component="label" htmlFor="autoDialLevel">
                      Auto Dial Level (0 = off)
                    </Typography>
                    <IconButton
                      aria-label="info"
                      size="small"
                      onClick={() => handleOpenDialog("autoDialLevel")}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="autoDialLevel">Select Auto Dial Level</InputLabel>
                    <Select
                      name="auto_dial_level"
                      id="auto_dial_level"
                      label="Select Auto Dial Level"
                      defaultValue=""
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
                </Box>

              </FormControl>
            </Grid>

            {/* Ring Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required error={Boolean(errors.ringType)}>
                <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" component="label" htmlFor="ringType">
                      Ring Type
                    </Typography>
                    <IconButton
                      aria-label="info"
                      size="small"
                      onClick={() => handleOpenDialog("ringType")}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="ringType">Select Ring Type</InputLabel>
                    <Select
                      name="next_agent_call"
                      id="next_agent_call"
                      label="Select Ring Type"
                      defaultValue="random"
                    >
                      <MenuItem value="random">Random</MenuItem>
                      <MenuItem value="campaign_rank">Rank</MenuItem>
                      <MenuItem value="ring_all">Ring All</MenuItem>
                      <MenuItem value="longest_wait_time">Longest Wait Time</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

              </FormControl>
            </Grid>

            {/* Calling Time */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" component="label" htmlFor="callingTime">
                      Calling Time
                    </Typography>
                    <IconButton
                      aria-label="info"
                      size="small"
                      onClick={() => handleOpenDialog("callingTime")}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="callingTime">Select Calling Time</InputLabel>
                    <Select
                      name="local_call_time"
                      id="local_call_time"
                      label="Select Calling Time"
                      defaultValue="12am-11pm"
                    >
                      <MenuItem value="12am-11pm">24 hours - default 24 hours calling</MenuItem>
                      <MenuItem value="9am-6pm">9am-6pm - default 9am to 6pm calling</MenuItem>
                      <MenuItem value="10am-6pm">10am-6pm - default 10am to 6pm calling</MenuItem>
                      <MenuItem value="10am-7pm">10am-7pm - default 10am to 7pm calling</MenuItem>
                      <MenuItem value="12pm-5pm">12pm-5pm - default 12pm to 5pm calling</MenuItem>
                      <MenuItem value="12pm-9pm">12pm-9pm - default 12pm to 9pm calling</MenuItem>
                      <MenuItem value="5pm-9pm">5pm-9pm - default 5pm to 9pm calling</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

              </FormControl>
            </Grid>

            {/* Week Off */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" component="label" htmlFor="weekOff">
                      Week Off
                    </Typography>
                    <IconButton
                      aria-label="info"
                      size="small"
                      onClick={() => handleOpenDialog("weekOff")}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="weekOff">Select Week Off</InputLabel>
                    <Select
                      name="week_off"
                      id="week_off"
                      label="Select Week Off"
                      defaultValue=""
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
                </Box>

              </FormControl>
            </Grid>

            {/* Lead Form */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
                  {/* Label and Info Icon */}
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" component="label" htmlFor="leadForm">
                      Lead Form
                    </Typography>
                    <IconButton
                      aria-label="info"
                      size="small"
                      onClick={() => handleOpenDialog("leadForm")}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Dropdown for Lead Form */}
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="leadForm">Select Lead Form</InputLabel>
                    <Select
                      name="get_call_launch"
                      id="get_call_launch"
                      label="Select Lead Form"
                      defaultValue=""
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="NONE">Inactive</MenuItem>
                      <MenuItem value="WEBFORM">Active</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

              </FormControl>
            </Grid>



<Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        {/* Wrapper Box for Label and Dropdown */}
        <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
          
          {/* Label and Info Icon */}
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle1" component="label" htmlFor="callRoute">
              Call Route
            </Typography>
            <IconButton
              aria-label="info"
              size="small"
              onClick={() => handleOpenDialog("callRoute")}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Dropdown for Call Route */}
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="callRoute">Select Call Route</InputLabel>
            <Select
              name="group_wise"
              id="group_wise"
              label="Select Call Route"
              defaultValue=""
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="0">NONE</MenuItem>
              {/* <MenuItem value="SCRIPT">SCRIPT</MenuItem> */}
              <MenuItem value="1">GROUP</MenuItem>
              <MenuItem value="2">Call Menu</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
                {isSubmitting ? "Submitting..." : "Send"}
              </Button>
            </Grid>
          </Grid>
        </Box>



        {/* Campaign Table (Placeholder) */}
        {/* You can implement your campaign table here using MUI's Table components */}

        {/* Dialog for Field Details */}
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
      </Box>
    </Box>
  );
};

export default NewcCampaign;
