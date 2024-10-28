// src/pages/list/BlockList.jsx

import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2"; // Import SweetAlert2
import { Link } from "react-router-dom";
import axios from "axios";
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
  Switch,
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
  { id: 2, sr: 2, blockNo: "B-202", status: "inactive", date: "2023-09-22" },
  { id: 3, sr: 3, blockNo: "C-303", status: "active", date: "2023-09-23" },
];

// Columns definition for the blocks
const blockColumns = [
  { field: "sr", headerName: "SR.", width: 70 },
  { field: "blockNo", headerName: "BLOCK NO.", width: 150 },
  { field: "date", headerName: "DATE", width: 130 },
  { field: "status", headerName: "STATUS", width: 120 },
];

const BlockList = () => {
  const [data, setData] = useState(initialBlockRows); // Initialize data state
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
    const updatedBlock = data.find((item) => item.id === id);
    const newStatus = updatedBlock.status === "active" ? "Inactive" : "active";
    
    // Optionally, make an API call to update the status
    // await axios.put(`https://api.example.com/blocks/${id}`, { status: newStatus });
    
    // Update the state
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
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

  // Modify columns to use colored spans for the status
  const columns = blockColumns.map((col) => {
    if (col.field === "status") {
      return {
        ...col,
        headerName: "STATUS",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const statusColor = params.row.status === "active" ? "green" : "red";
          return (
            <span
              onClick={() => handleToggleStatus(params.row.id)}
              style={{
                color: statusColor,
                cursor: "pointer",
                fontWeight: "bold",
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
        <Typography variant="h6">BLOCK LIST</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Block
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
