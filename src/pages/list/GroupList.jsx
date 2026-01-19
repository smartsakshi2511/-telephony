import React, { useState, useEffect, useCallback, useContext  } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/authContext";  
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../../context/searchBar";
import { Snackbar, Alert, Grid, Paper } from "@mui/material";
import "./list.scss";
import Swal from "sweetalert2";
import PaginatedGrid from '../Pagination/PaginatedGrid';

import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import ActionColumn from "../../context/Buttons/ActionButtons";
import { Close as CloseIcon } from "@mui/icons-material";

const GroupList = () => {
  const [filter, setFilter] = useState("all"); 
  const [data, setData] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [gruopOptions, setGroupOptions] = useState([]);
   const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    group_id: "",
    agent_name: "",
    press_key: "",
    campaign_id: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const basePath =
    user?.user_type === "9"
      ? "superadmin"
      : user?.user_type === "8"
      ? "admin"
      : user?.user_type === "7"
      ? "manager"
      : user?.user_type === "2"
      ? "team_leader"
      : "admin"; // default fallback

  const [columns] = useState([
    { field: "auto_id", headerName: "ID", flex: 1 }, 
    { field: "group_id", headerName: "GROUP ID", flex: 1 },
    { field: "agent_name", headerName: "AGENT NAME", flex: 2 },
    { field: "press_key", headerName: "PRESS KEY", flex: 1 },
    { field: "campaign_id", headerName: "CAMPAIGN ID", flex: 1 },
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionColumn
          onView={() => handleView(params.row)}
          onEdit={() => handleEdit(params.row)}
          onDelete={() => handleDelete(params.row.id)}
        />
      ),
    },
  ]);
const filteredData = data.filter((item) => {
  if (filter === "active" && item.status !== "active") return false;
  if (!searchQuery) return true;

  const search = searchQuery.toLowerCase();
  return (
    item.group_id?.toString().toLowerCase().includes(search) ||
    item.agent_name?.toLowerCase().includes(search) ||
    item.press_key?.toString().toLowerCase().includes(search) ||
    item.campaign_id?.toString().toLowerCase().includes(search) ||
    item.id?.toString().toLowerCase().includes(search)
  );
});



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
        setGroupOptions([
          { id: "", label: "--- Select Campaign ID ---" },
          ...options,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          `https://${window.location.hostname}:4000/groupList`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const modifiedData = response.data.map((item, index) => ({
          ...item,
          auto_id: index + 1, // Auto-increment the ID (1-based index)
        }));

        setData(modifiedData);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, [navigate]);

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/admin");

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

        try {
          await axios.delete(
            `https://${window.location.hostname}:4000/groupList/delete_group/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setData((prev) => prev.filter((item) => item.id !== id));

          Toast.fire({
            icon: "success",
            title: "Group deleted successfully!",
          });
        } catch (error) {
          console.error("Error deleting group:", error);
          Toast.fire({
            icon: "error",
            title: "Failed to delete the group.",
          });
        }
      }
    },
    [navigate]
  );

  const handleView = (row) => {
    setViewData(row);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewData(null);
  };

  const handleEdit = (row) => {
    setFormData({
      id: row.id,
      group_id: row.group_id,
      agent_name: row.agent_name,
      press_key: row.press_key,
      campaign_id: row.campaign_id,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setFormData({
      id: "",
      group_id: "",
      agent_name: "",
      press_key: "",
      campaign_id: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

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

    console.log("Request data:", formData);

    try {
      const response = await axios.put(
        `https://${window.location.hostname}:4000/groupList/edit_group/${formData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setData(
          data.map((item) => (item.id === formData.id ? { ...formData } : item))
        );

        Toast.fire({
          icon: "success",
          title: "Group updated successfully!",
        });

        handleCloseEditDialog();
      }
    } catch (error) {
      console.error("Error updating group:", error);
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "Failed to update the group.",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b>GROUP LIST</b>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <SearchBar
      onSearch={(value) => setSearchQuery(value)}
      placeholder="Search group id, agent name..."
    />
        <Button
          sx={{
            background: "linear-gradient(90deg, #283593, #3F51B5)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(90deg, #1e276b, #32408f)",
            },
          }}
          startIcon={<AddIcon />}
          component={Link}
          to={`/${basePath}/group/newGroup`} // ✅ dynamic path here
        >
          Add Group
        </Button>
      </div>
      </div>

      <PaginatedGrid rows={filteredData} columns={columns}/>

      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}
        >
          Group Details
        </DialogTitle>
        <DialogContent dividers sx={{ padding: "20px" }}>
          {viewData && (
            <Grid container spacing={2}>
              {[
                { label: "Group ID", value: viewData.group_id },
                { label: "Agent Name", value: viewData.agent_name },
                { label: "Press Key", value: viewData.press_key },
                { label: "Campaign ID", value: viewData.campaign_id },
              ].map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    sx={{ padding: "12px", borderRadius: "10px", boxShadow: 2 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", color: "#555" }}
                    >
                      {item.label}:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "1rem", color: "#333" }}
                    >
                      {item.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "16px", justifyContent: "center" }}>
          <Button
            onClick={handleCloseViewDialog}
            color="primary"
            variant="contained"
            sx={{ fontSize: "1rem", paddingX: "20px" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
            boxShadow: 4,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            pb: 1,
          }}
        >
          Edit Group
          <IconButton
            aria-label="close"
            onClick={handleCloseEditDialog}
            sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 3, py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="group_id"
                label="Group ID"
                value={formData.group_id}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="agent_name"
                label="Agent Name"
                value={formData.agent_name}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="press_key"
                label="Press Key"
                value={formData.press_key}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="campaign_id"
                label="Campaign ID"
                select
                value={formData.campaign_id}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              >
                {gruopOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.id}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ py: 2 }}>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GroupList;
