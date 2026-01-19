import "./new.scss";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode"; // To decode JWT token
import { useNavigate } from "react-router-dom"; // Import useNavigate

const NewGroup = () => {
  const [formData, setFormData] = useState({
    group_id: "",
    agent_id: "",
    agent_name: "",
    admin: "",
    campaign_id: "",
    press_key: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [agents, setAgents] = useState([]); // If you have agent data
  const navigate = useNavigate();
  const [groupOptions, setgroupOptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`https://${window.location.hostname}:4000/campaigns_dropdown`, {
        headers: { Authorization: `Bearer ${token}` }, // No need for query params
      })
      .then((response) => {
        const options = response.data.map((campaign) => ({
          id: campaign.compaign_id,
          label: campaign.compaignname,
        }));
        setgroupOptions([
          { id: "", label: "--- Select Campaign ID ---" },
          ...options,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://${window.location.hostname}:4000/call_report_agent_dropdown`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.group_id) newErrors.group_id = "Group ID is required";
    if (!formData.agent_name) newErrors.agent_name = "Agent name is required";
    if (!formData.campaign_id)
      newErrors.campaign_id = "Campaign ID is required";
    if (!formData.agent_id) newErrors.agent_id = "Agent ID is required"; // <-- This would fail if you don't update formData
    if (!formData.press_key) newErrors.press_key = "Press Key is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // ✅ Define Toast SweetAlert inside handleSubmit
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
  
    if (validate()) {
      setIsSubmitting(true);
  
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          throw new Error("Token not found. Please log in again.");
        }
  
        const response = await axios.post(
          `https://${window.location.hostname}:4000/groupList/add_group`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          Toast.fire({
            icon: "success",
            title: response.data.message || "Group added successfully!",
          });
  
          setTimeout(() => {
            navigate("/admin/group");
          }, 2000);
        }
      } catch (error) {
        console.error("Error creating group:", error);
        Toast.fire({
          icon: "error",
          title: error.response?.data?.message || "Failed to create group.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Toast.fire({
        icon: "warning",
        title: "Please fix the errors in the form.",
      });
    }
  };
  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Group
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Group ID
            </Typography>
            <Tooltip title="Enter the group ID." arrow>
              <TextField
                id="group_id"
                name="group_id"
                placeholder="Enter Group ID"
                type="number"
                value={formData.group_id}
                onChange={handleInputChange}
                error={Boolean(errors.group_id)}
                helperText={errors.group_id}
                fullWidth
              />
            </Tooltip>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Agent ID
            </Typography>
            <Tooltip title="Enter the agent ID." arrow>
              <FormControl fullWidth>
                <InputLabel>Select Agent ID</InputLabel>{" "}
                {/* <-- Title for Select Box */}
                <Select
                  value={selectedAgent}
                  onChange={(e) => {
                    setSelectedAgent(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      agent_id: e.target.value, // <-- ADD THIS LINE
                    }));
                  }}
                  displayEmpty
                >
                  {agents.map((agent) => (
                    <MenuItem key={agent.user_id} value={agent.user_id}>
                      {agent.user_id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Agent Name
            </Typography>
            <Tooltip title="Enter the agent name." arrow>
              <TextField
                id="agent_name"
                name="agent_name"
                placeholder="Enter Agent Name"
                value={formData.agent_name}
                onChange={handleInputChange}
                error={Boolean(errors.agent_name)}
                helperText={errors.agent_name}
                fullWidth
              />
            </Tooltip>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Campaign ID
            </Typography>
            <Tooltip title="Enter the campaign ID manually." arrow>
              <TextField
                margin="dense"
                name="campaign_id"
                label="Select Campaign ID"
                fullWidth
                variant="outlined"
                select
                value={formData.campaign_id} // Bind to newDisposition state
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    campaign_id: e.target.value,
                  }))
                }
              >
                {groupOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.id}
                  </MenuItem>
                ))}
              </TextField>
            </Tooltip>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Press Key
            </Typography>
            <Tooltip title="Enter the press key." arrow>
              <TextField
                id="press_key"
                name="press_key"
                placeholder="Enter Press Key"
                type="number"
                value={formData.press_key}
                onChange={handleInputChange}
                error={Boolean(errors.press_key)}
                helperText={errors.press_key}
                fullWidth
              />
            </Tooltip>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>

  
    </Box>
  );
};

export default NewGroup;
