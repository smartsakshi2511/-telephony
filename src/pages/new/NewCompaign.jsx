import React, { useState, useEffect } from "react";
import "./new.scss";
import { useNavigate } from "react-router-dom";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Divider from "@mui/material/Divider";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

const fieldDetails = {
  campaignId:
    "Unique identifier for the campaign. It cannot be changed once set.",
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
  autoDialStatus: "Auto Dial Status.",
  ringType: "Type of ringing, e.g., random, sequential.",
  callingTime: "Time settings for when calls are allowed.",
  weekOff: "Days designated as week-offs for the campaign.",
  leadForm: "Lead form associated with the campaign.",
};

const NewcCampaign = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
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
    autoDialStatus: "",
    ringType: "",
    callingTime: "",
    weekOff: "",
    leadForm: "",
    admin: "",
    group_wise: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state
  const [admins, setAdmins] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // State to control Dialog visibility
  const [currentField, setCurrentField] = useState(""); // To track which field's info to display

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
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://${window.location.hostname}:4000/telephony/admin`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);
  const validate = () => {
    let newErrors = {};

    if (!formData.campaignId.trim()) {
      newErrors.campaignId = "Campaign ID is required";
    } else if (!/^[A-Za-z0-9]+$/.test(formData.campaignId)) {
      newErrors.campaignId =
        "Campaign ID must contain only letters and numbers (no spaces or special characters)";
    }
    if (!formData.campaignName.trim()) {
      newErrors.campaignName = "Campaign Name is required";
    }
    if (!formData.campaignType.trim()) {
      newErrors.campaignType = "Campaign Type is required";
    }

    if (!formData.inboundCID) {
      newErrors.inboundCID = "Inbound CID is required";
    } else if (!/^\d{6,15}$/.test(formData.inboundCID)) {
      newErrors.inboundCID = "Must be between 6 and 15 digits";
    }

    if (!formData.outboundCID) {
      newErrors.outboundCID = "Outbound CID is required";
    } else if (!/^\d{6,15}$/.test(formData.outboundCID)) {
      newErrors.outboundCID = "Must be between 6 and 15 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("compaign_id", formData.campaignId);
        formDataToSubmit.append("compaignname", formData.campaignName);
        formDataToSubmit.append("status", formData.active);
        formDataToSubmit.append("campaign_number", formData.inboundCID);
        formDataToSubmit.append("outbond_cli", formData.outboundCID);
        formDataToSubmit.append("week_off", formData.weekOff);
        formDataToSubmit.append("admin", formData.admin);
        if (formData.campaignType)
          formDataToSubmit.append("campaign_dis", formData.campaignType);
        if (formData.ringTime)
          formDataToSubmit.append("ring_time", formData.ringTime);
        if (formData.autoDialLevel)
          formDataToSubmit.append("auto_dial_level", formData.autoDialLevel);
        if (formData.autoDialStatus)
          formDataToSubmit.append("auto_dial_status", formData.autoDialStatus);
        if (formData.ringType)
          formDataToSubmit.append("type", formData.ringType);
        if (formData.callingTime)
          formDataToSubmit.append("local_call_time", formData.callingTime);
        if (formData.leadForm)
          formDataToSubmit.append("script_notes", formData.leadForm);
        if (formData.welcomeIVR)
          formDataToSubmit.append("welcome_ivr", formData.welcomeIVR);
        if (formData.afterOfficeIVR)
          formDataToSubmit.append("after_office_ivr", formData.afterOfficeIVR);
        if (formData.callOnHoldMusic)
          formDataToSubmit.append("music_on_hold", formData.callOnHoldMusic);
        if (formData.ringToneMusic)
          formDataToSubmit.append("ring_tone_music", formData.ringToneMusic);
        if (formData.noAgentIVR)
          formDataToSubmit.append("no_agent_ivr", formData.noAgentIVR);
        if (formData.weekOffIVR)
          formDataToSubmit.append("week_off_ivr", formData.weekOffIVR);
        if (formData.group_wise)
          formDataToSubmit.append("ivr", formData.group_wise); // ✅ maps dropdown to ivr column

        const token = localStorage.getItem("token");

        const response = await axios.post(
          `https://${window.location.hostname}:4000/campaigns/addCampaign`,
          formDataToSubmit,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsSubmitting(false);
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
          title: "Campaign added successfully!",
        });

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
          autoDialStatus: "",
          ringType: "",
          callingTime: "",
          weekOff: "",
          leadForm: "",
          admin: "",
          group_wise: "",
        });

        setFile(null);
        navigate("/admin/campaign");
      } catch (error) {
        console.error("Error submitting the form:", error);
        setIsSubmitting(false);

        Swal.fire({
          icon: "error",
          title: "Failed to add campaign",
          text: error?.response?.data?.message || "Something went wrong",
        });
      }
    } else {
      console.log("Form has errors");
    }
  };

  const handleOpenDialog = (field) => {
    setCurrentField(field);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentField("");
  };
  const checkDuplicateId = async () => {
    if (!formData.campaignId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://${window.location.hostname}:4000/campaigns/checkDuplicateId/${formData.campaignId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.exists) {
        setErrors((prev) => ({
          ...prev,
          campaignId: "Campaign ID already exists",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          campaignId: "", // ✅ message hata do if new valid ID
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Box display="flex" className="newContainer">
      <Box flex={6} p={2}>
        <Box mb={4}>
          <Typography variant="h4" component="h1">
            Add New Campaign
          </Typography>
        </Box>
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
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="campaignId"
                  >
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
                  type="text"
                  placeholder="Enter Campaign ID"
                  value={formData.campaignId}
                  onChange={handleInputChange}
                  onBlur={checkDuplicateId} // ✅ add this
                  error={Boolean(errors.campaignId)}
                  helperText={errors.campaignId}
                  fullWidth
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="campaignName"
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

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="inboundCID"
                  >
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
                  type="number"
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

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="outboundCID"
                  >
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
                  type="number"
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

            <Grid item xs={12} sm={3}>
              <FormControl
                fullWidth
                variant="outlined"
                required
                error={Boolean(errors.campaignType)}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="campaignType"
                  >
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
                  <MenuItem value="both">Both</MenuItem>
                  <MenuItem value="inbound">Inbound</MenuItem>
                  <MenuItem value="outbound">Outbound</MenuItem>
                  {/* Add more options as needed */}
                </Select>
                {errors.campaignType && (
                  <Typography variant="caption" color="error">
                    {errors.campaignType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle1"
                      component="label"
                      htmlFor="ringTime"
                    >
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
                      name="ringTime"
                      id="ringTime"
                      label="Select Ring Time"
                      defaultValue="60"
                      value={formData.ringTime}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="60">60 SECONDS</MenuItem>
                      <MenuItem value="45">45 SECONDS</MenuItem>
                      <MenuItem value="30">30 SECONDS</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl
                fullWidth
                variant="outlined"
                required
                error={Boolean(errors.ringType)}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle1"
                      component="label"
                      htmlFor="ringType"
                    >
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
                      name="ringType"
                      id="ringType"
                      label="Select Ring Type"
                      value={formData.ringType}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="random">Random</MenuItem>
                      <MenuItem value="rank">Rank</MenuItem>
                      <MenuItem value="ring_all">Ring All</MenuItem>
                      <MenuItem value="longest_wait_time">
                        Longest Wait Time
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle1"
                      component="label"
                      htmlFor="callRoute"
                    >
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
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="callRoute">
                      Select Call Route
                    </InputLabel>
                    <Select
                      name="group_wise"
                      id="group_wise"
                      label="Select Call Route"
                      value={formData.group_wise || ""}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="0">NONE</MenuItem>
                      <MenuItem value="1">Extension Wise</MenuItem>
                      {/* <MenuItem value="2">Call Menu</MenuItem> */}
                    </Select>
                  </FormControl>
                </Box>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle1"
                      component="label"
                      htmlFor="callingTime"
                    >
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
                    <InputLabel htmlFor="callingTime">
                      Select Calling Time
                    </InputLabel>
                    <Select
                      name="callingTime"
                      id="callingTime"
                      label="Select Calling Time"
                      value={formData.callingTime}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="12am-11pm">
                        24 hours - default 24 hours calling
                      </MenuItem>
                      <MenuItem value="9am-6pm">
                        9am-6pm - default 9am to 6pm calling
                      </MenuItem>
                      <MenuItem value="10am-6pm">
                        10am-6pm - default 10am to 6pm calling
                      </MenuItem>
                      <MenuItem value="10am-7pm">
                        10am-7pm - default 10am to 7pm calling
                      </MenuItem>
                      <MenuItem value="12pm-5pm">
                        12pm-5pm - default 12pm to 5pm calling
                      </MenuItem>
                      <MenuItem value="12pm-9pm">
                        12pm-9pm - default 12pm to 9pm calling
                      </MenuItem>
                      <MenuItem value="5pm-9pm">
                        5pm-9pm - default 5pm to 9pm calling
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle1"
                      component="label"
                      htmlFor="weekOff"
                    >
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
                      name="weekOff"
                      id="weekOff"
                      label="Select Week Off"
                      value={formData.weekOff}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="Sunday">Sunday</MenuItem>
                      <MenuItem value="Monday">Monday</MenuItem>
                      <MenuItem value="Tuesday">Tuesday</MenuItem>
                      <MenuItem value="Wednesday">Wednesday</MenuItem>
                      <MenuItem value="Thursday">Thursday</MenuItem>
                      <MenuItem value="Friday">Friday</MenuItem>
                      <MenuItem value="Saturday">Saturday</MenuItem>
                      <MenuItem value="SaturdaytoSunday">
                        Saturday to Sunday
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle1"
                      component="label"
                      htmlFor="leadForm"
                    >
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
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="leadForm">Select Lead Form</InputLabel>
                    <Select
                      name="leadForm"
                      id="leadForm"
                      label="Select Lead Form"
                      value={formData.leadForm}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="admin"
                  >
                    Select Admin
                  </Typography>

                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Select
                  name="admin"
                  value={formData.admin}
                  onChange={handleChange}
                  displayEmpty
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="">Select Admin</MenuItem>
                  {admins.map((admin) => (
                    <MenuItem key={admin.user_id} value={admin.user_id}>
                      {admin.full_name || admin.user_id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="welcomeIVR"
                  >
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
                  {formData.welcomeIVR
                    ? formData.welcomeIVR.name
                    : "Choose File"}
                  <input
                    type="file"
                    id="welcomeIVR"
                    name="welcomeIVR"
                    accept=".wav"
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

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="afterOfficeIVR"
                  >
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
                  {formData.afterOfficeIVR
                    ? formData.afterOfficeIVR.name
                    : "Choose File"}
                  <input
                    type="file"
                    id="afterOfficeIVR"
                    name="afterOfficeIVR"
                    accept=".wav"
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

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="callOnHoldMusic"
                  >
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
                  {formData.callOnHoldMusic
                    ? formData.callOnHoldMusic.name
                    : "Choose File"}
                  <input
                    type="file"
                    id="callOnHoldMusic"
                    name="callOnHoldMusic"
                    accept=".wav"
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

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="ringToneMusic"
                  >
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
                  {formData.ringToneMusic
                    ? formData.ringToneMusic.name
                    : "Choose File"}
                  <input
                    type="file"
                    id="ringToneMusic"
                    name="ringToneMusic"
                    accept=".wav"
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

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="noAgentIVR"
                  >
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
                  {formData.noAgentIVR
                    ? formData.noAgentIVR.name
                    : "Choose File"}
                  <input
                    type="file"
                    id="noAgentIVR"
                    name="noAgentIVR"
                    accept=".wav"
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

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    component="label"
                    htmlFor="weekOffIVR"
                  >
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
                  {formData.weekOffIVR
                    ? formData.weekOffIVR.name
                    : "Choose File"}
                  <input
                    type="file"
                    id="weekOffIVR"
                    name="weekOffIVR"
                    accept=".wav"
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

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle1"
                      component="label"
                      htmlFor="autoDialLevel"
                    >
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
                    <InputLabel htmlFor="autoDialLevel">
                      Select Auto Dial Level
                    </InputLabel>
                    <Select
                      name="autoDialLevel"
                      id="autoDialLevel"
                      label="Select Auto Dial Level"
                      value={formData.autoDialLevel}
                      onChange={handleInputChange}
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

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  width="100%"
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      variant="subtitle1"
                      component="label"
                      htmlFor="autoDialStatus"
                    >
                      Auto Dial Status
                    </Typography>
                    <IconButton
                      aria-label="info"
                      size="small"
                      onClick={() => handleOpenDialog("autoDialStatus")}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="autoDialStatus">
                      Select Auto Dial Status
                    </InputLabel>
                    <Select
                      name="autoDialStatus"
                      id="autoDialStatus"
                      label="Select Auto Dial Status"
                      value={formData.autoDialStatus}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="1">Active</MenuItem>
                      <MenuItem value="0">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </FormControl>
            </Grid>

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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Field Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {fieldDetails[currentField]}
            </Typography>
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
