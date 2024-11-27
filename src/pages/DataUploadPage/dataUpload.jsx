import React, { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import PersonIcon from "@mui/icons-material/Person";
import NumbersIcon from "@mui/icons-material/Numbers";
import FormControlLabel from "@mui/material/FormControlLabel";
// import { Download as DownloadIcon } from "@mui/icons-material"; // Import DownloadIcon
import Swal from "sweetalert2";
import ShowList from "./showList";
import "./dataUpload.scss";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Tooltip,
  Switch,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

const DataUpload = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const columns = [
    {
      field: "listId",
      headerName: "LIST ID",
      flex: 0.5, // Takes less space
      headerClassName: "customHeader",
      renderCell: (params) => (
        <button
          className="listIdButton"
          onClick={() => navigate(`/showlist/${params.value}`)} // Navigate to ShowList page with listId
          style={{
            background: "none",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {params.value}
        </button>
      ),
    },
    {
      field: "name",
      headerName: "NAME",
      flex: 1, 
      headerClassName: "customHeader",
    },
    {
      field: "description",
      headerName: "DESCRIPTION",
      flex: 2,  
      headerClassName: "customHeader",
    },
    {
      field: "leadsCount",
      headerName: "LEADS COUNT",
      flex: 1,
      headerClassName: "customHeader",
    },
    {
      field: "campaign",
      headerName: "CAMPAIGN",
      flex: 1,
      headerClassName: "customHeader",
    },
    {
      field: "active",
      headerName: "STATUS",
      flex: 1, // Takes less space
      headerClassName: "customHeader",
      renderCell: (params) => (
        <button
          className={`statusButton ${params.value ? "active" : "inactive"}`}
          onClick={() => handleToggleStatus(params.row.listId)}
        >
          {params.value ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      field: "createTime",
      headerName: "CREATE TIME",
      flex: 1.5, // Slightly more space for date/time
      headerClassName: "customHeader",
    },
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      renderCell: (params) => (
        <div
          className="cellAction"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px", // Adjust spacing between buttons
          }}
        >
          {/* <IconButton
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
          </IconButton> */}

          <IconButton
            color="primary"
            onClick={handleOpenDialog} // Opens the dialog box
            style={{
              padding: "4px",
              border: "2px solid blue", // Border matching icon color
              borderRadius: "6px 6px", // Circular border
              backgroundColor: "white", // White background
            }}
          >
            <Tooltip title="Download">
              <DownloadIcon
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
            onClick={() => handleEdit(params.row)}
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
            onClick={() => handleDelete(params.row)}
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
  ];

  const [data, setData] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [viewData, setViewData] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    listId: "",
    name: "",
    description: "",
    leadsCount: "",
    campaign: "",
    active: false,
    createTime: "",
  });

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get("https://api.example.com/lists");
        setData(response.data.lists);
      } catch (error) {
        console.error("Error fetching lists:", error);
        setData([
          {
            listId: 1,
            name: "List A",
            description: "Description for List A",
            leadsCount: 100,
            campaign: "Campaign A",
            active: true,
            createTime: "2023-08-01 10:00 AM",
          },
          {
            listId: 2,
            name: "List B",
            description: "Description for List B",
            leadsCount: 200,
            campaign: "Campaign B",
            active: false,
            createTime: "2023-08-05 02:30 PM",
          },
        ]);
      }
    };

    fetchLists();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleToggleStatus = (id) => {
    const updatedData = data.map((item) =>
      item.listId === id ? { ...item, active: !item.active } : item
    );
    setData(updatedData);
  };
  const handleAddNewList = () => {
    setFormData({
      listId: data.length + 1, // Auto-generate listId
      name: "",
      description: "",
      leadsCount: "",
      campaign: "",
      active: false,
      createTime: new Date().toLocaleString(),
    });
    setAddDialogOpen(true);
  };
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
        setData(data.filter((item) => item.listId !== id));
        Swal.fire("Deleted!", "The block has been deleted.", "success");
      }
    });
  };

  const handleDownload = () => {
    if (data.length === 0) {
      alert("No data available to download.");
      return;
    }

    const excelData = data.map((item) => ({
      "LIST ID": item.listId,
      NAME: item.name,
      DESCRIPTION: item.description,
      "LEADS COUNT": item.leadsCount,
      CAMPAIGN: item.campaign,
      ACTIVE: item.active ? "Yes" : "No",
      "CREATE TIME": item.createTime,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lists");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "list_data.xlsx");
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
    setEditData(row);
    setFormData(row);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditData(null);
    setFormData({
      listId: "",
      name: "",
      description: "",
      leadsCount: "",
      campaign: "",
      active: false,
      createTime: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveEdit = async () => {
    setData(
      data.map((item) =>
        item.listId === formData.listId ? { ...formData } : item
      )
    );
    handleCloseEditDialog();
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        SHOW LIST
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          style={{ marginLeft: "640px" }}
          sx={{
            background: "linear-gradient(90deg, #283593, #3F51B5)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(90deg, #1e276b, #32408f)", // Darker shade on hover
            },
          }}
        >
          Add New List
        </Button>
        <Button
          variant="outlined"
          onClick={handleDownload}
          style={{
            background: "linear-gradient(90deg, #4caf50, #2e7d32)", // Green gradient
            color: "white",
            borderColor: "#4caf50",
          }}
        >
          EXPORT <DownloadIcon />
        </Button>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "16px",
            background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", // Add a gradient background
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#283593",
            textAlign: "center",
          }}
        >
          Upload Lead
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <TextField
              label="List ID"
              variant="outlined"
              disabled
              defaultValue="12345" // Replace with dynamic value if necessary
              sx={{
                width: "100%",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
              }}
            />
            <TextField
              label="Campaign Name"
              variant="outlined"
              defaultValue="34567" // Replace with dynamic value if necessary
              sx={{
                width: "100%",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
              }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{
                borderRadius: "8px",
                padding: "8px 16px",
                color: "#3F51B5",
                borderColor: "#3F51B5",
                "&:hover": {
                  backgroundColor: "#e8eaf6",
                },
              }}
            >
              Choose File
              <input type="file" hidden />
            </Button>
          </div>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "#757575",
              "&:hover": {
                color: "#000",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              background: "linear-gradient(90deg, #283593, #3F51B5)",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 16px",
              "&:hover": {
                background: "linear-gradient(90deg, #1e276b, #32408f)",
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        rows={data}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row.listId}
        style={{ fontSize: "12px" }}
      />

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "primary.main", color: "white", textAlign: "center" }}
        >
          View Details
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            List Details
          </Typography>
          {viewData && (
            <div style={{ padding: "10px" }}>
              <Typography variant="body1">
                <strong>List ID:</strong> {viewData.listId}
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {viewData.name}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {viewData.description}
              </Typography>
              <Typography variant="body1">
                <strong>Leads Count:</strong> {viewData.leadsCount}
              </Typography>
              <Typography variant="body1">
                <strong>Campaign:</strong> {viewData.campaign}
              </Typography>
              <Typography variant="body1">
                <strong>Active:</strong> {viewData.active ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1">
                <strong>Create Time:</strong> {viewData.createTime}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseViewDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "primary.main", color: "white", textAlign: "center" }}
        >
          Edit List
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
          />
          <TextField
            label="Leads Count"
            name="leadsCount"
            type="number"
            value={formData.leadsCount}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NumbersIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Campaign"
            name="campaign"
            value={formData.campaign}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={handleFormChange}
                name="active"
                color="primary"
              />
            }
            label="Active"
            sx={{ marginTop: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
            sx={{ width: "100%" }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataUpload;
