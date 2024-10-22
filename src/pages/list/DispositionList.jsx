// src/pages/list/DispositionList.jsx
import "./list.scss"
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "react-axios"
import {
  IconButton,
  Switch,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControlLabel,
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
    status: "active",
    date: "2024-Oct-01",
  },
];

// Columns definition for the dispositions
const dispositionColumns = [
  { field: "sr", headerName: "Sr.", width: 70 },
  { field: "dispositionName", headerName: "Disposition Name", width: 200 },
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

  // Handle Delete
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    // Optionally, make an API call to delete the disposition
    // axios.delete(`https://api.example.com/dispositions/${id}`)
    //   .then(() => { /* Handle success */ })
    //   .catch(error => { console.error("Error deleting disposition:", error); });
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
      const newStatus = updatedDisposition.status === "active" ? "deactive" : "active";
      // Make an API call to update the status
      await axios.put(`https://api.example.com/dispositions/${id}`, { status: newStatus });
      // Update the state
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      // Optionally, show a notification to the user
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
    // Assign a new unique ID and incremented Sr.
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const newSr = data.length > 0 ? Math.max(...data.map((item) => item.sr)) + 1 : 1;
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Format date to 'YYYY-MMM-DD' if necessary
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

    // Optionally, make an API call to add the new disposition
    // axios.post(`https://api.example.com/dispositions`, dispositionToAdd)
    //   .then(() => { /* Handle success */ })
    //   .catch(error => { console.error("Error adding disposition:", error); });

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

  // Modify columns to allow editable cells
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
            <Switch
              checked={params.row.status === "active"}
              onChange={() => handleToggleStatus(params.row.id)}
              color="primary"
              name="status"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          );
        },
      };
    }
    return col;
  });

  return (
    <div className="datatable" style={{ height: 600, width: "100%" }}>
      <div className="datatableTitle" style={styles.datatableTitle}>
        <Typography variant="h6">Disposition List</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New
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
          <strong>Status:</strong>{" "}
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </Typography>
        <Typography variant="body1">
          <strong>Date:</strong> {data.date}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// AddDialog Component
const AddDialog = ({ open, onClose, onAdd }) => {
  const [dispositionName, setDispositionName] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [status, setStatus] = useState("active"); // Default status
  const [date, setDate] = useState("");
  const [error, setError] = useState({
    dispositionName: "",
    campaignId: "",
    date: "",
  });

  const handleSubmit = () => {
    let valid = true;
    let newError = { dispositionName: "", campaignId: "", date: "" };

    if (!dispositionName.trim()) {
      newError.dispositionName = "Disposition Name is required.";
      valid = false;
    }

    if (!campaignId.trim()) {
      newError.campaignId = "CAMPAIGN ID is required.";
      valid = false;
    }

    if (!date.trim()) {
      newError.date = "Date is required.";
      valid = false;
    } else {
      // Optional: Validate date format (e.g., YYYY-MMM-DD)
      const dateRegex = /^\d{4}-[A-Za-z]{3}-\d{2}$/;
      if (!dateRegex.test(date.trim())) {
        newError.date = "Date must be in YYYY-MMM-DD format (e.g., 2024-Oct-04).";
        valid = false;
      }
    }

    setError(newError);

    if (!valid) return;

    // Prepare new disposition data
    const newDisposition = {
      dispositionName: dispositionName.trim(),
      campaignId: campaignId.trim(),
      status,
      date: date.trim(),
    };

    onAdd(newDisposition);

    // Reset form fields
    setDispositionName("");
    setCampaignId("");
    setStatus("active");
    setDate("");
    setError({ dispositionName: "", campaignId: "", date: "" });
  };

  const handleClose = () => {
    onClose();
    setDispositionName("");
    setCampaignId("");
    setStatus("active");
    setDate("");
    setError({ dispositionName: "", campaignId: "", date: "" });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Disposition</DialogTitle>
      <DialogContent dividers>
        <form noValidate autoComplete="off">
          <TextField
            autoFocus
            margin="dense"
            label="Disposition Name"
            type="text"
            fullWidth
            value={dispositionName}
            onChange={(e) => setDispositionName(e.target.value)}
            error={Boolean(error.dispositionName)}
            helperText={error.dispositionName}
          />
          <TextField
            margin="dense"
            label="CAMPAIGN ID"
            type="text"
            fullWidth
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            error={Boolean(error.campaignId)}
            helperText={error.campaignId}
          />
          <FormControlLabel
            control={
              <Switch
                checked={status === "active"}
                onChange={(e) =>
                  setStatus(e.target.checked ? "active" : "deactive")
                }
                color="primary"
              />
            }
            label="Active Status"
            style={{ marginTop: "10px" }}
          />
          <TextField
            margin="dense"
            label="Date (YYYY-MMM-DD)"
            type="text"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={Boolean(error.date)}
            helperText={error.date}
            placeholder="e.g., 2024-Oct-04"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Add
        </Button>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispositionList;
