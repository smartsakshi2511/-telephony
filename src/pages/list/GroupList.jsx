
import React, { useState, useEffect } from "react"; 
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import axios from "axios";
import {
  IconButton,
  Switch,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const GroupList = () => {
  // Define columns for the DataGrid
  const [columns, setColumns] = useState([
    { field: "id", headerName: "ID", flex: 1  },
    {
      field: "userGroup",
      headerName: "USER GROUP",
      flex:1 ,
      headerClassName: "customHeader",
    },
    {
      field: "groupName",
      headerName: "GROUP NAME",
      flex: 2,
      headerClassName: "customHeader",
    },
    {
      field: "pressKey",
      headerName: "PRESS KEY",
      flex:1,
      headerClassName: "customHeader",
    },
    {
      field: "campaign",
      headerName: "CAMPAIGN",
      flex: 1,
      headerClassName: "customHeader",
    },
 
    {
      field: "action",
      headerName: "ACTION",
      flex:1 ,
      headerClassName: "customHeader",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="cellAction" style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px", // Adjust spacing between buttons
        }}>
         <IconButton
                color="primary"
                onClick={() => handleView(params.row)}
                style={{
                  padding: "4px",
                  border: "2px solid blue", // Border matching icon color
                  borderRadius: "6px 6px", // Circular border
                  backgroundColor: "white", // White background
                }}
              >
                 <Tooltip title="View">
                <VisibilityIcon
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    fontSize: "12px", // Adjust icon size
                  }}
                />
                </Tooltip>
              </IconButton>

              <IconButton
                color="info"
                onClick={() => handleEdit(params.row.id)}
                style={{
                  padding: "4px",
                  border: "2px solid green", // Border matching icon color
                  borderRadius: "6px 6px",
                  backgroundColor: "white",
                }}
              >
                 <Tooltip title="Edit">
                <EditIcon
                  style={{
                    cursor: "pointer",
                    color: "green",
                    fontSize: "12px",
                  }}
                />
                 </Tooltip>
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(params.row.id)}
                style={{
                  padding: "4px",
                  border: "2px solid red", // Border matching icon color
                  borderRadius: "6px 6px",
                  backgroundColor: "white",
                }}
              >
                <Tooltip title="Delete">
                <DeleteIcon
                  style={{
                    cursor: "pointer",
                    color: "red",
                    fontSize: "12px",
                  }}
                />
                </Tooltip>
              </IconButton>
        </div>
      ),
    },
  ]);

  // State for user group data
  const [data, setData] = useState([]);

  // State for campaigns
  const [campaignOptions, setCampaignOptions] = useState([]);

  // State for View Dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  // State for Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // State for form inputs in Edit Dialog
  const [formData, setFormData] = useState({
    id: "",
    userGroup: "",
    groupName: "",
    pressKey: "",
    campaign: "",
    status: "inactive",
  });

  // Fetch user groups from API or use static data
  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("https://api.example.com/usergroups");
        setData(response.data.userGroups); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching user groups:", error);
        // Fallback to predefined user groups if API fails
        setData([
          {
            id: 1,
            userGroup: "Admin",
            groupName: "Administrators",
            pressKey: "A1",
            campaign: "Campaign A",
            status: "active",
          },
          {
            id: 2,
            userGroup: "User",
            groupName: "Regular Users",
            pressKey: "U1",
            campaign: "Campaign B",
            status: "inactive",
          },
          // Add more rows as needed
        ]);
      }
    };

    fetchUserGroups();
  }, []);
 
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
          { id: 1, name: "Campaign A" },
          { id: 2, name: "Campaign B" },
          { id: 3, name: "Campaign C" },
        ]);
      }
    };

    fetchCampaigns();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user group?")) {
      try {
        // Replace with your actual API endpoint
        await axios.delete(`https://api.example.com/usergroups/${id}`);
        setData(data.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting user group:", error);
        alert("Failed to delete the user group.");
      }
    }
  };

  // Handle View
  const handleView = (row) => {
    setViewData(row);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewData(null);
  };

  // Handle Edit
  const handleEdit = (row) => {
    setEditData(row);
    setFormData({
      id: row.id,
      userGroup: row.userGroup,
      groupName: row.groupName,
      pressKey: row.pressKey,
      campaign: row.campaign,
      status: row.status,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditData(null);
    setFormData({
      id: "",
      userGroup: "",
      groupName: "",
      pressKey: "",
      campaign: "",
      status: "inactive",
    });
  };

  // Handle form input changes in Edit Dialog
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Save in Edit Dialog
  const handleSaveEdit = async () => {
    try {
      // Replace with your actual API endpoint
      await axios.put(`https://api.example.com/usergroups/${formData.id}`, formData);
      setData(
        data.map((item) => (item.id === formData.id ? { ...formData } : item))
      );
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating user group:", error);
      alert("Failed to update the user group.");
    }
  };

  // Handle Status Toggle
  const handleToggleStatus = async (id) => {
    try {
      const updatedGroup = data.find((item) => item.id === id);
      const newStatus = updatedGroup.status === "active" ? "inactive" : "active";
      // Replace with your actual API endpoint
      await axios.put(`https://api.example.com/usergroups/${id}`, { status: newStatus });
      setData(
        data.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update the status.");
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
       <b> GROUP LIST </b>
       
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/group/newGroup"
          sx={{
            background: "linear-gradient(90deg, #283593, #3F51B5)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(90deg, #1e276b, #32408f)", // Darker shade on hover
            },
          }}
        >
          Add Group
        </Button>



      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        autoHeight
        style={{ fontSize: '12px' }}
      />

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>User Group Details</DialogTitle>
        <DialogContent dividers>
          {viewData && (
            <>
              <Typography variant="h6">USER GROUP</Typography>
              <Typography gutterBottom>{viewData.userGroup}</Typography>

              <Typography variant="h6">GROUP NAME</Typography>
              <Typography gutterBottom>{viewData.groupName}</Typography>

              <Typography variant="h6">PRESS KEY</Typography>
              <Typography gutterBottom>{viewData.pressKey}</Typography>

              <Typography variant="h6">CAMPAIGN</Typography>
              <Typography gutterBottom>{viewData.campaign}</Typography>

              <Typography variant="h6">STATUS</Typography>
              <Typography gutterBottom>
                {viewData.status === "active" ? "Active" : "Inactive"}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit User Group</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="USER GROUP"
            name="userGroup"
            value={formData.userGroup}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="GROUP NAME"
            name="groupName"
            value={formData.groupName}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="PRESS KEY"
            name="pressKey"
            value={formData.pressKey}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="CAMPAIGN"
            name="campaign"
            value={formData.campaign}
            onChange={handleFormChange}
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
          >
            <option value="">Select Campaign</option>
            {campaignOptions.map((campaign) => (
              <option key={campaign.id} value={campaign.name}>
                {campaign.name}
              </option>
            ))}
          </TextField>
          <div style={{ marginTop: "10px" }}>
            <Typography variant="subtitle1">STATUS</Typography>
            <Switch
              checked={formData.status === "active"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.checked ? "active" : "inactive",
                })
              }
              color="primary"
              name="status"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            <Typography variant="body2">
              {formData.status === "active" ? "Active" : "Inactive"}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GroupList;
