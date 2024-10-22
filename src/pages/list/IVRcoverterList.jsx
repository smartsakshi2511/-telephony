 
import "./list.scss"
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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
} from "@mui/material";
 
import AddIcon from '@mui/icons-material/Add';

import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import axios from "axios";
 
const initialIVRRows = [
  {
    id: 1,
    srNo: 1,
    type: "Type A",
    campaign: "Campaign X",
    file: "ivr1.pdf",
    date: "2024-Oct-04",
    status: "active",
  },
  {
    id: 2,
    srNo: 2,
    type: "Type B",
    campaign: "Campaign Y",
    file: "ivr2.docx",
    date: "2024-Oct-01",
    status: "deactive",
  },
];

// Columns definition for IVR Converters
const ivrColumns = [
  { field: "srNo", headerName: "SR NO.", width: 100 },
  { field: "type", headerName: "TYPE", width: 150 },
  { field: "campaign", headerName: "CAMPAIGN", width: 150 },
  { field: "file", headerName: "FILE", width: 200 },
  { field: "date", headerName: "DATE", width: 150 },
  // Status column can be added if needed
];

const IVRList = () => {
  const [data, setData] = useState(initialIVRRows);
  const [editRowId, setEditRowId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Handle Delete
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    // Optionally, make an API call to delete the IVR Converter
    // axios.delete(`https://api.example.com/ivrconverters/${id}`)
    //   .then(() => { /* Handle success */ })
    //   .catch(error => { console.error("Error deleting IVR Converter:", error); });
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
      const updatedIVR = data.find((item) => item.id === id);
      const newStatus = updatedIVR.status === "active" ? "deactive" : "active";

      // Make an API call to update the status
      await axios.put(`https://api.example.com/ivrconverters/${id}`, { status: newStatus });

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

  const handleAddIVR = (newIVR) => {
    // Assign a new unique ID and incremented SrNo.
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    const newSrNo = data.length > 0 ? Math.max(...data.map((item) => item.srNo)) + 1 : 1;
    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const ivrToAdd = {
      id: newId,
      srNo: newSrNo,
      type: newIVR.type,
      campaign: newIVR.campaign,
      file: newIVR.file,
      date: newIVR.date || formattedDate,
      status: "active", // Default status
    };

    setData([...data, ivrToAdd]);

    // Optionally, make an API call to add the new IVR Converter
    // axios.post(`https://api.example.com/ivrconverters`, ivrToAdd)
    //   .then(() => { /* Handle success */ })
    //   .catch(error => { console.error("Error adding IVR Converter:", error); });

    handleCloseAddDialog();
  };

 
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
                <Tooltip title="Toggle Status">
                  <Switch
                    checked={params.row.status === "active"}
                    onChange={() => handleToggleStatus(params.row.id)}
                    color="primary"
                    name="status"
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
  ];
 
  const columns = ivrColumns.map((col) => {
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
        <Typography variant="h6">IVR Converter List</Typography>
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
        rows={data}
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
        onAdd={handleAddIVR}
      />
    </div>
  );
};

 
const styles = {
  datatableTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
};

 
const ViewDialog = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>IVR Converter Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          <strong>SR NO.:</strong> {data.srNo}
        </Typography>
        <Typography variant="body1">
          <strong>TYPE:</strong> {data.type}
        </Typography>
        <Typography variant="body1">
          <strong>CAMPAIGN:</strong> {data.campaign}
        </Typography>
        <Typography variant="body1">
          <strong>FILE:</strong>{" "}
          <a href={`/files/${data.file}`} target="_blank" rel="noopener noreferrer">
            {data.file}
          </a>
        </Typography>
        <Typography variant="body1">
          <strong>DATE:</strong> {data.date}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong>{" "}
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
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
const [input, setInput]= useState("")
  const [type, setType] = useState("");
  const [campaign, setCampaign] = useState("");
  const [file, setFile] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState({
    input:"",
    type: "",
    campaign: "",
    file: "",
    date: "",
  });

  const handleSubmit = () => {
    let valid = true;
    let newError = { input:"",type: "", campaign: "", file: "", date: "" };

    if (!type.trim()) {
      newError.type = "Type is required.";
      valid = false;
    }

    if (!campaign.trim()) {
      newError.campaign = "Campaign is required.";
      valid = false;
    }

    if (!file.trim()) {
      newError.file = "File is required.";
      valid = false;
    }

    if (!date.trim()) {
      newError.date = "Date is required.";
      valid = false;
    } else {
      // Validate date format (e.g., YYYY-MMM-DD)
      const dateRegex = /^\d{4}-[A-Za-z]{3}-\d{2}$/;
      if (!dateRegex.test(date.trim())) {
        newError.date = "Date must be in YYYY-MMM-DD format (e.g., 2024-Oct-04).";
        valid = false;
      }
    }

    setError(newError);

    if (!valid) return;

    // Prepare new IVR Converter data
    const newIVR = {
        input:type.trim(),
      type: type.trim(),
      campaign: campaign.trim(),
      file: file.trim(),
      date: date.trim(),
    };

    onAdd(newIVR);

    // Reset form fields
     setInput("")
    setType("");
    setCampaign("");
    setFile("");
    setDate("");
    setError({ type: "", campaign: "", file: "", date: "" });
  };

  const handleClose = () => {
    onClose();
    setInput("")
    setType("");
    setCampaign("");
    setFile("");
    setDate("");
    setError({ type: "", campaign: "", file: "", date: "" });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Speech</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" >
        <TextField fullWidth  id="fullWidth" />
        </Typography>
        <form noValidate autoComplete="off">
          <TextField
            select
            SelectProps={{
              native: true,
            }}
            margin="dense"
            
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value)}
            error={Boolean(error.type)}
            helperText={error.type}
          >
            <option value="">-- Select Language --</option>
            <option value="Hindi (Male 1)">Hindi (Male 1)</option>
            {/* Add more language options as needed */}
          </TextField>

          {/* Select Type */}
          <TextField
            select
            SelectProps={{
              native: true,
            }}
            margin="dense"
             
            fullWidth
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            error={Boolean(error.campaign)}
            helperText={error.campaign}
          >
            <option value="">-- Select Type --</option>
            <option value="welcome IVR">welcome IVR</option>
            {/* Add more type options as needed */}
          </TextField>

          {/* File Input */}
          <TextField
            margin="dense"
            label="File"
            type="text"
            fullWidth
            value={file}
            onChange={(e) => setFile(e.target.value)}
            error={Boolean(error.file)}
            helperText={error.file}
            placeholder="e.g., speech3.pdf"
          />

          {/* Date Input */}
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

export default IVRList;
