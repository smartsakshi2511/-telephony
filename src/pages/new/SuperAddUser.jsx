import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  Tooltip,
  Grid,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SuperAddUser = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    user_type: "",
    agent_priorty: "",
    full_name: "",
    campaigns_id: [],
    campaign_name: "",
    use_did: "",
    ext_number: "",
    admin: "",
  });

  const [admins, setAdmins] = useState([]);

  const [errors, setErrors] = useState({
    user_id: false,
    password: false,
    campaigns_id: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const newErrors = {
      user_id: !formData.user_id,
      password: !formData.password,
      campaigns_id: formData.campaigns_id.length === 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) {
      Toast.fire({
        icon: "error",
        title: "User ID, Password, and Campaigns are required.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://${window.location.hostname}:4000/telephony/add/user`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Toast.fire({
        icon: "success",
        title: response.data.message || "Agent added successfully",
      });

      setFormData({
        user_id: "",
        password: "",
        user_type: "",
        agent_priorty: "",
        full_name: "",
        status: "",
        campaign_name: "",
        use_did: "",
        campaigns_id: [],
        ext_number: "",
      });

      setTimeout(() => {
      
        navigate(`/superadmin/agent`);
      }, 1000);
    } catch (error) {
      console.error(
        "Error adding agent:",
        error.response?.data || error.message
      );
      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to add agent. Please try again.",
      });
    }
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

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://${window.location.hostname}:4000/telephony/admin`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdmins(response.data); // assuming response is array of {user_id, full_name}
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleCampaignChange = (event, newValue) => {
    setFormData({ ...formData, campaigns_id: newValue.map((item) => item.id) });
  };

  return (
    <Box display="flex" flexDirection="column" p={2} className="newContainer">
      <Typography variant="h4" component="h1" gutterBottom>
        New User
      </Typography>
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="user_id"
                >
                  User ID
                </Typography>
                <Tooltip title="Enter a unique User ID for the agent" arrow>
                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                id="user_id"
                name="user_id"
                type="number"
                placeholder="Enter User ID"
                value={formData.user_id}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                error={errors.user_id}
                helperText={errors.user_id ? "User ID is required." : ""}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="password"
                >
                  Password
                </Typography>
                <Tooltip title="Enter a secure password" arrow>
                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                error={errors.password}
                helperText={
                  errors.password
                    ? formData.password.length < 5
                      ? "Password must be at least 5 characters long."
                      : "Password is required."
                    : ""
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="user_type"
                >
                  User Type
                </Typography>
                <Tooltip title="Select either Admin or Agent" arrow>
                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                displayEmpty
                fullWidth
                variant="outlined"
                required
              >
                <MenuItem value="">Select User Type</MenuItem>
                <MenuItem value="Agent">Agent</MenuItem>
                <MenuItem value="Team Leader">Team Leader</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Quality Analyst">Quality Analyst</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="full_name"
                >
                  Full Name
                </Typography>
                <Tooltip title="Enter the full name of the agent" arrow>
                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                id="full_name"
                name="full_name"
                placeholder="Enter Full Name"
                value={formData.full_name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="campaigns_id"
                >
                  Campaigns
                </Typography>
                <Tooltip
                  title="Select the campaigns the agent is assigned to"
                  arrow
                >
                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Autocomplete
                multiple
                id="campaigns_id"
                options={campaigns}
                getOptionLabel={(option) => option.name || "Unnamed"} // Fallback for missing names
                isOptionEqualToValue={(option, value) => option.id === value.id} // Ensure proper selection
                value={campaigns.filter((campaign) =>
                  formData.campaigns_id.includes(campaign.id)
                )}
                onChange={handleCampaignChange}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select Campaigns"
                    fullWidth
                    error={errors.campaigns_id}
                    helperText={
                      errors.campaigns_id
                        ? "At least one campaign must be selected."
                        : ""
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="use_did"
                >
                  DID
                </Typography>
                <Tooltip title="Enter the DID for the agent" arrow>
                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                id="use_did"
                name="use_did"
                type="number"
                placeholder="Enter DID"
                value={formData.use_did}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="ext_number"
                >
                  External Number
                </Typography>
                <Tooltip title="Enter the DID for the agent" arrow>
                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                id="ext_number"
                name="ext_number"
                type="number"
                placeholder="Enter exter no"
                value={formData.ext_number}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="admin"
                >
                  Select Admin
                </Typography>
                <Tooltip title="Select an admin for this user" arrow>
                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Select
                name="admin"
                value={formData.admin || ""}
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
        </Grid>

        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SuperAddUser;
