import "./list.scss";
import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { DataGrid } from "@mui/x-data-grid";
import axios from "react-axios";
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
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// Sample Data for Dispositions
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
  { field: "dispositionName", headerName: "DISPOSITION NAME", width: 200 },
  { field: "campaignId", headerName: "CAMPAIGN ID", width: 150 },
  { field: "status", headerName: "STATUS", width: 120 },
  { field: "date", headerName: "DATE", width: 150 },
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

  // Handle Status Toggle
  const handleToggleStatus = async (id) => {
    try {
      const updatedDisposition = data.find((item) => item.id === id);
      const newStatus = updatedDisposition.status === "active" ? "Inactive" : "active";
      // Make an API call to update the status (if needed)
      // await axios.put(`https://api.example.com/dispositions/${id}`, { status: newStatus });
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
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    color="info"
                    onClick={() => handleEdit(params.row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                  >
                    <DeleteIcon />
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
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          return (
            <span
              onClick={() => handleToggleStatus(params.row.id)}
              style={{
                color: params.row.status === "active" ? "green" : "red",
                cursor: "pointer",
              }}
            >
              {params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)}
            </span>
          );
        },
      };
    }
    return col;
  });

  return (
    <div className="datatable" style={{ height: 600, width: "100%" }}>
      <div className="datatableTitle" style={styles.datatableTitle}>
        <Typography variant="h6">DISPOSITION LIST</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
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
        checkboxSelection
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
    status: "active", // Default status
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
      <DialogTitle>Add Disposition</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="dispositionName"
          label="Disposition Name"
          fullWidth
          variant="outlined"
          value={newDisposition.dispositionName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="campaignId"
          label="Campaign ID"
          fullWidth
          variant="outlined"
          value={newDisposition.campaignId}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Switch
              checked={newDisposition.status === "active"}
              onChange={() =>
                setNewDisposition((prev) => ({
                  ...prev,
                  status: prev.status === "active" ? "Inactive" : "active",
                }))
              }
            />
          }
          label="Active Status"
        />
        <TextField
          margin="dense"
          name="date"
          label="Date"
          fullWidth
          variant="outlined"
          value={newDisposition.date}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispositionList;
