// src/pages/DataUploadPage/dataUpload.jsx

import React, { useState, useEffect } from "react";
import "./dataUpload.scss"; // Ensure the path is correct based on your project structure
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
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
  // Define columns for the DataGrid
  const columns = [
    { field: "listId", headerName: "LIST ID", width: 80 },
    { field: "name", headerName: "NAME", width: 100 },
    { field: "description", headerName: "DESCRIPTION", width: 250 },
    { field: "leadsCount", headerName: "LEADS COUNT", width: 150 },
    { field: "campaign", headerName: "CAMPAIGN", width: 200 },
    {
      field: "active",
      headerName: "ACTIVE",
      width: 80,
      renderCell: (params) => (
        <span
          className={
            params.value ? "activeStatus active" : "activeStatus inactive"
          }
        >
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "createTime",
      headerName: "CREATE TIME",
      width: 180,
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="cellAction">
          <Tooltip title="View Details">
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
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.listId)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  // State for list data
  const [data, setData] = useState([]);

  // State for View Dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  // State for Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // State for form inputs in Edit Dialog
  const [formData, setFormData] = useState({
    listId: "",
    name: "",
    description: "",
    leadsCount: "",
    campaign: "",
    active: false,
    createTime: "",
  });

  // Fetch list data from API or use static data
  useEffect(() => {
    const fetchLists = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("https://api.example.com/lists");
        setData(response.data.lists); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching lists:", error);
        // Fallback to predefined lists if API fails
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
          // Add more rows as needed
        ]);
      }
    };

    fetchLists();
  }, []);

  // Function to download the data as an Excel file
  const handleDownload = () => {
    if (data.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Prepare data for Excel
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

    // Create a binary string for the file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "list_data.xlsx");
  };

  // Handle Delete
  const handleDelete = async (listId) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        // Replace with your actual API endpoint
        await axios.delete(`https://api.example.com/lists/${listId}`);
        setData(data.filter((item) => item.listId !== listId));
      } catch (error) {
        console.error("Error deleting list:", error);
        alert("Failed to delete the list.");
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
      listId: row.listId,
      name: row.name,
      description: row.description,
      leadsCount: row.leadsCount,
      campaign: row.campaign,
      active: row.active,
      createTime: row.createTime,
    });
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

  // Handle form input changes in Edit Dialog
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle Save in Edit Dialog
  const handleSaveEdit = async () => {
    // Validate before saving
    if (!formData.name.trim()) {
      alert("NAME is required.");
      return;
    }
    if (!formData.description.trim()) {
      alert("DESCRIPTION is required.");
      return;
    }
    if (!formData.leadsCount || isNaN(formData.leadsCount)) {
      alert("LEADS COUNT must be a valid number.");
      return;
    }
    if (!formData.campaign.trim()) {
      alert("CAMPAIGN is required.");
      return;
    }

    try {
      // Replace with your actual API endpoint
      await axios.put(`https://api.example.com/lists/${formData.listId}`, formData);
      setData(
        data.map((item) =>
          item.listId === formData.listId ? { ...formData } : item
        )
      );
      handleCloseEditDialog();
      alert("List updated successfully.");
    } catch (error) {
      console.error("Error updating list:", error);
      alert("Failed to update the list.");
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        SHOW LIST
        <Link to="/lists/new" className="link">
          Add New
        </Link>
        {/* Download Button */}
        <Tooltip title="Download as Excel">
          <IconButton color="primary" onClick={handleDownload}>
           Export <DownloadIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row.listId} // Ensure unique identifier
        checkboxSelection
        autoHeight
      />

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>List Details</DialogTitle>
        <DialogContent dividers>
          {viewData && (
            <>
              <Typography variant="h6">LIST ID</Typography>
              <Typography gutterBottom>{viewData.listId}</Typography>

              <Typography variant="h6">NAME</Typography>
              <Typography gutterBottom>{viewData.name}</Typography>

              <Typography variant="h6">DESCRIPTION</Typography>
              <Typography gutterBottom>{viewData.description}</Typography>

              <Typography variant="h6">LEADS COUNT</Typography>
              <Typography gutterBottom>{viewData.leadsCount}</Typography>

              <Typography variant="h6">CAMPAIGN</Typography>
              <Typography gutterBottom>{viewData.campaign}</Typography>

              <Typography variant="h6">ACTIVE</Typography>
              <Typography gutterBottom>
                {viewData.active ? "Yes" : "No"}
              </Typography>

              <Typography variant="h6">CREATE TIME</Typography>
              <Typography gutterBottom>{viewData.createTime}</Typography>
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
        <DialogTitle>Edit List</DialogTitle>
        <DialogContent dividers>
          <form>
            {/* LIST ID (Non-editable) */}
            <div className="formInput">
              <label htmlFor="listId">LIST ID</label>
              <TextField
                id="listId"
                name="listId"
                value={formData.listId}
                fullWidth
                disabled
              />
            </div>

            {/* NAME */}
            <div className="formInput">
              <label htmlFor="name">NAME</label>
              <TextField
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="formInput">
              <label htmlFor="description">DESCRIPTION</label>
              <TextField
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </div>

            {/* LEADS COUNT */}
            <div className="formInput">
              <label htmlFor="leadsCount">LEADS COUNT</label>
              <TextField
                id="leadsCount"
                name="leadsCount"
                type="number"
                value={formData.leadsCount}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </div>

            {/* CAMPAIGN */}
            <div className="formInput">
              <label htmlFor="campaign">CAMPAIGN</label>
              <TextField
                id="campaign"
                name="campaign"
                value={formData.campaign}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </div>

            {/* ACTIVE */}
            <div className="formInput">
              <label htmlFor="active">ACTIVE</label>
              <Switch
                checked={formData.active}
                onChange={handleFormChange}
                name="active"
                color="primary"
              />
            </div>

            {/* CREATE TIME (Non-editable) */}
            <div className="formInput">
              <label htmlFor="createTime">CREATE TIME</label>
              <TextField
                id="createTime"
                name="createTime"
                value={formData.createTime}
                fullWidth
                disabled
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataUpload;
