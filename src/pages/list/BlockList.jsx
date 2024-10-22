// src/pages/list/BlockList.jsx

import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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

// Mock Data for blocks
const initialBlockRows = [
  { id: 1, sr: 1, blockNo: "A-101", status: "active", date: "2023-09-21" },
  { id: 2, sr: 2, blockNo: "B-202", status: "deactive", date: "2023-09-22" },
  { id: 3, sr: 3, blockNo: "C-303", status: "active", date: "2023-09-23" },
];

// Columns definition for the blocks
const blockColumns = [
  { field: "sr", headerName: "Sr.", width: 70 },
  { field: "blockNo", headerName: "Block No.", width: 150 },
  { field: "date", headerName: "Date", width: 130 },
  { field: "status", headerName: "Status", width: 120 },
];

const BlockList = () => {
  const [data, setData] = useState(initialBlockRows); // Initialize data state
  const [editRowId, setEditRowId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false); // State for Add Dialog

  // Handle Delete
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    // Optionally, make an API call to delete the block
    // axios.delete(`https://api.example.com/blocks/${id}`)
    //   .then(() => { /* Handle success */ })
    //   .catch(error => { console.error("Error deleting block:", error); });
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
      const updatedBlock = data.find((item) => item.id === id);
      const newStatus = updatedBlock.status === "active" ? "deactive" : "active";
      // Make an API call to update the status
      await axios.put(`https://api.example.com/blocks/${id}`, { status: newStatus });
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

  const handleAddBlock = (newBlock) => {
    // Assign a new unique ID and incremented Sr.
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const newSr = data.length > 0 ? Math.max(...data.map((item) => item.sr)) + 1 : 1;
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const blockToAdd = {
      id: newId,
      sr: newSr,
      blockNo: newBlock.blockNo,
      status: newBlock.status,
      date: newBlock.date || currentDate,
    };

    setData([...data, blockToAdd]);

    // Optionally, make an API call to add the new block
    // axios.post(`https://api.example.com/blocks`, blockToAdd)
    //   .then(() => { /* Handle success */ })
    //   .catch(error => { console.error("Error adding block:", error); });

    handleCloseAddDialog();
  };

  // Define the action column with icons
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
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
  const columns = blockColumns.map((col) => {
    if (col.field === "status") {
      return {
        ...col,
        headerName: "Status",
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
        <Typography variant="h6">Block List</Typography>
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
 
      <ViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        data={viewData}
      />

   
      <AddDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleAddBlock}
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
      <DialogTitle>Block Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          <strong>Sr.:</strong> {data.sr}
        </Typography>
        <Typography variant="body1">
          <strong>Block No.:</strong> {data.blockNo}
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
  const [blockNo, setBlockNo] = useState("");
  const [status, setStatus] = useState("active"); // Default status
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!blockNo.trim()) {
      setError("Block No. is required.");
      return;
    }

    // Optionally, add more validation here

    // Prepare new block data
    const newBlock = {
      blockNo: blockNo.trim(),
      status,
      date: new Date().toISOString().split("T")[0], // Current date
    };

    onAdd(newBlock);

    // Reset form fields
    setBlockNo("");
    setStatus("active");
    setError("");
  };

  const handleClose = () => {
    onClose();
    setBlockNo("");
    setStatus("active");
    setError("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Block No.</DialogTitle>
      <DialogContent dividers>
        <form noValidate autoComplete="off">
          <TextField
            autoFocus
            margin="dense"
            label="Block No."
            type="text"
            fullWidth
            value={blockNo}
            onChange={(e) => setBlockNo(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
          <FormControlLabel
            control={
              <Switch
                checked={status === "active"}
                onChange={(e) => setStatus(e.target.checked ? "active" : "deactive")}
                color="primary"
              />
            }
            label="Active Status"
            style={{ marginTop: "10px" }}
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

export default BlockList;
