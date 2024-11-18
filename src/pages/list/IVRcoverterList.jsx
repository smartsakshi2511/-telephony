import "./list.scss"
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {
  IconButton, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';

import {
 
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
    file: "ivr1.mp3",
    date: "2024-Oct-04",
    status: "active",
  },
  {
    id: 2,
    srNo: 2,
    type: "Type B",
    campaign: "Campaign Y",
    file: "ivr2.wav",
    date: "2024-Oct-01",
    status: "deactive",
  },
];

// Columns definition for IVR Converters
const ivrColumns = [
  { field: "srNo", headerName: "SR NO.", width: 100, headerClassName: "customHeader" },
  { field: "type", headerName: "TYPE", width: 150,headerClassName: "customHeader" },
  { field: "campaign", headerName: "CAMPAIGN", width: 150, headerClassName: "customHeader" },
  { field: "file", headerName: "FILE", width: 200, headerClassName: "customHeader" },  
  { field: "date", headerName: "DATE", width: 150, headerClassName: "customHeader" },
  // Status column can be added if needed
];

const IVRList = () => {
  const [data, setData] = useState(initialIVRRows);
  const [editRowId, setEditRowId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");



  const filteredRows = data.filter(
    (row) =>
      row.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.date.includes(searchQuery)
  );

  // Function to delete a row
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "The entry has been deleted.", "success");
      }
    });
  };



  // Function to edit a row
  const handleEdit = (id) => {
    setEditRowId(id);
  };


  // Function to save the edited row
  const handleSaveEdit = (row) => {
    const updatedData = data.map((item) => (item.id === row.id ? row : item));
    setData(updatedData);
    setEditRowId(null);
  };

  // Function to toggle status between 'active' and 'deactive'
  const handleToggleStatus = (id) => {
    const updatedData = data.map((item) =>
      item.id === id
        ? { ...item, status: item.status === "active" ? "deactive" : "active" }
        : item
    );
    setData(updatedData);
  };

  // Function to view details of a row
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
      headerClassName: "customHeader",
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
                  <IconButton color="secondary" onClick={() => setEditRowId(null)}>
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                {/* <Tooltip title="View">
                  <IconButton color="primary" onClick={() => handleView(params.row)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip> */}
                <Tooltip title="Edit">
                  <IconButton color="info" onClick={() => handleEdit(params.row.id)}>
                    <EditIcon style={{ cursor: "pointer", color: "green"}}  />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                    <DeleteIcon style={{ cursor: "pointer", color: "red" }} />
                  </IconButton>
                </Tooltip>
                {/* <Switch
                  checked={params.row.status === "active"}
                  onChange={() => handleToggleStatus(params.row.id)}
                  color="primary"
                /> */}
              </>
            )}
          </div>
        );
      },
    },
  ];

  // Combine columns with action column
  const columns = [...ivrColumns, ...actionColumn];

  // const columns = ivrColumns.map((col) => {
  //   if (col.field === "status") {
  //     return {
  //       ...col,
  //       headerName: "STATUS",
  //       width: 120,
  //       sortable: false,
  //       filterable: false,
  //       renderCell: (params) => {
  //         return (
  //           <Switch
  //             checked={params.row.status === "active"}
  //             onChange={() => handleToggleStatus(params.row.id)}
  //             color="primary"
  //             name="status"
  //             inputProps={{ "aria-label": "primary checkbox" }}
  //           />
  //         );
  //       },
  //     };
  //   }
  //   return col;
  // });

  return (
    <div className="datatable" style={{ height: 600, width: "100%" }}>
      <div className="datatableTitle" style={styles.datatableTitle}>
        <Typography variant="h6">IVR CONVERTER LIST</Typography>

        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "30px", marginLeft: "500px", marginTop: "30px" }}
          InputProps={{
            style: {
              height: "40px",    // Adjust height here
              padding: "0px",    // Remove default padding if needed
              fontSize: "14px"   // Adjust font size for compactness
            }
          }}
        />

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
          Create Speech
        </Button>

      </div>



      <DataGrid
        className="datagrid"
        rows={filteredRows}
        columns={columns}
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
  const [input, setInput] = useState("")
  const [type, setType] = useState("");
  const [campaign, setCampaign] = useState("");
  const [file, setFile] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState({
    input: "",
    type: "",
    campaign: "",
    file: "",
    date: "",
  });

  const handleSubmit = () => {
    let valid = true;
    let newError = { input: "", type: "", campaign: "", file: "", date: "" };

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
      input: type.trim(),
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
          <TextField fullWidth id="fullWidth" placeholder="Enter your text here" />

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
            select
            margin="dense"
            label="Select Campaign"
            fullWidth
            value={file}
            onChange={(e) => setFile(e.target.value)}
            error={Boolean(error.file)}
            helperText={error.file}
            placeholder="Select a department"
          >
            {/* Placeholder option */}
            <MenuItem value="" disabled>
              Select a department
            </MenuItem>

            {/* Dropdown options */}
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="IT Support">IT SUPPORT</MenuItem>
            <MenuItem value="IT Department">IT DEPARTMENT</MenuItem>
            <MenuItem value="Sales">SALES</MenuItem>
            <MenuItem value="Account">Account</MenuItem>
          </TextField>

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
