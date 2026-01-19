import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/authContext";
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

const AddUserForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    user_type: "",
    agent_priorty: "",
    full_name: "",
    campaigns_id: "",
    campaign_name: "NULL",
    use_did: "",
  });
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
  const role = user?.role;
  const userTypeOptions = [];

  if (["admin", "manager", "quality_analyst"].includes(role)) {
    userTypeOptions.push(
      { label: "Agent", value: "Agent" },
      { label: "Team Leader", value: "Team Leader" },
      { label: "Manager", value: "Manager" },
      { label: "Quality Analyst", value: "Quality Analyst" }
    );
  } else if (role === "team_leader") {
    userTypeOptions.push(
      { label: "Agent", value: "Agent" },
      { label: "Quality Analyst", value: "Quality Analyst" }
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id || formData.user_id.toString().length < 4) {
      newErrors.user_id = "User ID must be at least 4 digits.";
    }

    if (!formData.password || formData.password.length < 9) {
      newErrors.password = "Password must be more than 8 characters.";
    }
    if (
      formData.ext_number &&
      formData.ext_number.toString().length <= 10
    ) {
      newErrors.ext_number = "External number must be more than 10 digits.";
    }
    if (
      formData.use_did &&
      formData.use_did.toString().length <= 10
    ) {
      newErrors.use_did = "DID number must be more than 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
        `https://${window.location.hostname}:4000/telephony/add/agents`,
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
        const basePath = user?.user_type === "8" ? "admin" : "team_leader";
        navigate(`/${basePath}/agent`);
      }, 1000);
    } catch (error) {
      const status = error.response?.status;
      const backendMessage = error.response?.data?.message;

      let errorMsg = "Failed to add agent. Please try again.";

      if (status === 409) {
        errorMsg = "User ID already exists.";
      } else if (backendMessage) {
        errorMsg = backendMessage;
      }

      Toast.fire({
        icon: "error",
        title: errorMsg,
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

  const handleCampaignChange = (event, newValue) => {
    setFormData({ ...formData, campaigns_id: newValue.map((item) => item.id) });
  };

  return (
    <Box display="flex" flexDirection="column" p={2} className="newContainer">
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Agent
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

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
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
                type="text"
                placeholder="Enter User ID"
                value={formData.user_id}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                error={!!errors.user_id}
                helperText={errors.user_id}
              />
            </FormControl>
          </Grid>

          {/* Password */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
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
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only letters, numbers, underscore (_) and dash (-)
                  // # or any other special char will be blocked
                  const regex = /^[A-Za-z0-9_-]*$/;
                  if (regex.test(value)) {
                    handleChange(e); // sirf valid hone par hi state update hogi
                  }
                }}
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

          {/* User Type */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="user_type"
                >
                  User Type
                </Typography>
                <Tooltip title="Select appropriate user type" arrow>
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
                {userTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Full Name */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
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

          {/* Campaigns */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
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
                getOptionLabel={(option) => option.name || "Unnamed"}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={campaigns.filter((c) =>
                  formData.campaigns_id.includes(c.id)
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
                          {loading && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
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
                error={!!errors.use_did}
                helperText={errors.use_did}
              />
            </FormControl>
          </Grid>

          {/* External Number */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography
                  variant="subtitle1"
                  component="label"
                  htmlFor="ext_number"
                >
                  External Number
                </Typography>
                <Tooltip title="Enter external number for the agent" arrow>
                  <IconButton aria-label="info" size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                id="ext_number"
                name="ext_number"
                type="number"
                placeholder="Enter External Number"
                value={formData.ext_number}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                error={!!errors.ext_number}
                helperText={errors.ext_number}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box mt={3} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
        {/* 
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
};

export default AddUserForm;
