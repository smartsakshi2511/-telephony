import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import "./list.scss";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import ActionColumn from "../../context/Buttons/ActionButtons";

const GroupList = () => {
  const [columns] = useState([
    { field: "id", headerName: "ID", flex: 1 },
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

  const [data, setData] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("https://${window.location.hostname}:4000/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Confirm with the user
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        // Call backend to delete the group
        const response = await axios.delete(
          `https://${window.location.hostname}:4000/groups/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the response was successful
        if (response.status === 200) {
          // Update frontend data by removing the deleted group
          setData((prevData) => prevData.filter((item) => item.id !== id));
          setSnackbar({
            open: true,
            message: "Group deleted successfully!",
            severity: "success",
          });
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        setSnackbar({
          open: true,
          message: error.response
            ? error.response.data.message
            : "Failed to delete the group.",
          severity: "error",
        });
      }
    }
  };

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
    console.log("Request data:", formData);

    try {
      // Send the PUT request to update the group
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
        setSnackbar({
          open: true,
          message: "Group updated successfully!",
          severity: "success",
        });
        handleCloseEditDialog(); // Close the dialog
      }
    } catch (error) {
      console.error("Error updating group:", error);
      setSnackbar({
        open: true,
        message: error.response
          ? error.response.data.message
          : "Failed to update the group.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b> USER MENU GROUP</b>
        <Button
        className="addButton"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/group/newGroup"
        >
          Add Group
        </Button>
      </div>
      <DataGrid rows={data} columns={columns} pageSize={9} autoHeight />
      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog}>
        <DialogTitle>Group Details</DialogTitle>
        <DialogContent>
          {viewData && (
            <>
              <Typography>GROUP ID: {viewData.group_id}</Typography>
              <Typography>AGENT NAME: {viewData.agent_name}</Typography>
              <Typography>PRESS KEY: {viewData.press_key}</Typography>
              <Typography>CAMPAIGN ID: {viewData.campaign_id}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Group</DialogTitle>
        <DialogContent>
          <TextField
            name="group_id"
            label="Group ID"
            value={formData.group_id}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            name="agent_name"
            label="Agent Name"
            value={formData.agent_name}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            name="press_key"
            label="Press Key"
            value={formData.press_key}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            name="campaign_id"
            label="Campaign ID"
            value={formData.campaign_id}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
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
