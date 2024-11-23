import "./list.scss";
import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { DataGrid } from "@mui/x-data-grid";
import axios from "react-axios";
import { Close as CloseIcon } from "@mui/icons-material";

import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  MenuItem ,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
} from "@mui/icons-material";
 
const initialDispositionRows = [
  {
    id: 1,
    sr: 1,
    dispositionName: "call back",
    campaignId: "Sales_Team",
    status: "active",
    date: "2024-Oct-04",
  },
  {
    id: 2,
    sr: 2,
    dispositionName: "interested",
    campaignId: "Sales_Team",
    status: "inactive",
    date: "2024-Oct-01",
  },
];

// Columns definition for the dispositions
const dispositionColumns = [
  { field: "sr", headerName: "SR.", width: 70 },
  { field: "dispositionName", headerName: "DISPOSITION NAME", width: 200, headerClassName: "customHeader"},
  { field: "campaignId", headerName: "CAMPAIGN ID", width: 150, headerClassName: "customHeader" },
  { field: "status", headerName: "STATUS", width: 120, headerClassName: "customHeader" },
  { field: "date", headerName: "DATE", width: 150, headerClassName: "customHeader" },
];

const campaignOptions = [
  { id: '', label: '--- Select Campaign ID ---' },
  { id: 'campaign1', label: 'Campaign 1' },
  { id: 'campaign2', label: 'Campaign 2' },
  { id: 'campaign3', label: 'Campaign 3' },
];

const DispositionList = () => {
  const [data, setData] = useState(initialDispositionRows); // Initialize data state
  const [editRowId, setEditRowId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false); // State for Add Dialog

  // Handle Delete with SweetAlert confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the block.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "The block has been deleted.", "success");
      }
    });
  };

  // Handle Edit
  const handleEdit = (id) => {
    setEditRowId(id);
  };

  const handleSaveEdit = (updatedRow) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === updatedRow.id ? updatedRow : item))
    );
    setEditRowId(null); // Exit edit mode after saving
  };

  const handleToggleStatus = async (id) => {
    try {
      const updatedDisposition = data.find((item) => item.id === id);
      const newStatus = updatedDisposition.status === "active" ? "inactive" : "active";
  
      // Update the state
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
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

  // Handle Add Dialog
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleAddDisposition = (newDisposition) => {
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const newSr = data.length > 0 ? Math.max(...data.map((item) => item.sr)) + 1 : 1;
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const dispositionToAdd = {
      id: newId,
      sr: newSr,
      dispositionName: newDisposition.dispositionName,
      campaignId: newDisposition.campaignId,
      status: newDisposition.status,
      date: newDisposition.date || formattedDate,
    };

    setData([...data, dispositionToAdd]);

    handleCloseAddDialog();
  };

  // Define the action column with icons
  const actionColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 180,
      headerClassName: "customHeader",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isEditing = params.row.id === editRowId;

        return (
          <div className="cellAction">
            {isEditing ? (
              <>
                <Tooltip title="Save">
                  <IconButton
                    color="primary"
                    onClick={() => handleSaveEdit(params.row)}
                  >
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    color="secondary"
                    onClick={() => setEditRowId(null)}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="View">
                  <IconButton
                    color="primary"
                    onClick={() => handleView(params.row)}
                  >
                    <VisibilityIcon style={{ cursor: "pointer", color: "blue", marginRight: "10px" }}/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    color="info"
                    onClick={() => handleEdit(params.row.id)}
                  >
                    <EditIcon style={{ cursor: "pointer", color: "green" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                  >
                    <DeleteIcon style={{ cursor: "pointer", color: "red" }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
  ];

  // Modify columns to allow colored spans for status
  const columns = dispositionColumns.map((col) => {
    if (col.field === "status") {
      return {
        ...col,
        headerName: "STATUS",
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const isActive = params.row.status === "active";
          return (
            <button
              className={`statusButton ${isActive ? "active" : "inactive"}`}
              onClick={() => handleToggleStatus(params.row.id)}
            >
              {isActive ? "Active" : "Inactive"}
            </button>
          );
        },
      };
    }
    return col;
  });
  


  return (
    <div className="datatable" style={{ height: 600, width: "100%" }}>
      <div className="datatableTitle" style={styles.datatableTitle}>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>DISPOSITION LIST</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}

          sx={{
            background: 'linear-gradient(90deg, #283593, #3F51B5)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #1e276b, #32408f)', // Darker shade on hover
            },
          }}
        >
          Add Disposition
        </Button>
      </div>
      <DataGrid
        className="datagrid"
        rows={data} // Use state data
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        style={{ fontSize: '12px' }}
      />

      {/* View Dialog */}
      <ViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        data={viewData}
      />

      {/* Add Dialog */}
      <AddDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleAddDisposition}
      />
    </div>
  );
};

// Styles (optional)
const styles = {
  datatableTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
};

// ViewDialog Component
const ViewDialog = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Disposition Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          <strong>Sr.:</strong> {data.sr}
        </Typography>
        <Typography variant="body1">
          <strong>Disposition Name:</strong> {data.dispositionName}
        </Typography>
        <Typography variant="body1">
          <strong>CAMPAIGN ID:</strong> {data.campaignId}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {data.status}
        </Typography>
        <Typography variant="body1">
          <strong>Date:</strong> {data.date}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// AddDialog Component
const AddDialog = ({ open, onClose, onAdd }) => {
  const [newDisposition, setNewDisposition] = useState({
    dispositionName: "",
    campaignId: "",
    status: "active",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDisposition((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (newDisposition.dispositionName && newDisposition.campaignId) {
      onAdd(newDisposition);
      setNewDisposition({
        dispositionName: "",
        campaignId: "",
        status: "active",
        date: "",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add Disposition
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <hr className="customHr" />
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="dispositionName"
          label="Type disposition here"
          fullWidth
          variant="outlined"
          value={newDisposition.dispositionName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="campaignId"
          label="Select Campaign ID"
          fullWidth
          variant="outlined"
          select
          value={newDisposition.campaignId}
          onChange={handleChange}
        >
          {campaignOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
      </DialogContent>
      
      <hr className="customHr" />
      <DialogActions>
        
  <Button
    onClick={onClose}
    style={{
      backgroundColor: "lightgray",
      color: "#fff",
      marginRight: "8px",
      transition: "background-color 0.3s", // smooth transition
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = "darkgray"; // Change color on hover
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "lightgray"; // Revert color when mouse leaves
    }}
  >
    Cancel
  </Button>
  <Button
    onClick={handleSubmit}
    style={{
      backgroundColor: "#1976d2", // Use primary color
      color: "#fff",
    }}
  >
    Add
  </Button>
</DialogActions>

    </Dialog>
  );
};
export default DispositionList;
