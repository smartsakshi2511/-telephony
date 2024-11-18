import React, { useState, useEffect } from "react";
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import NumbersIcon from '@mui/icons-material/Numbers'; // This is a placeholder; use the appropriate icon if needed
import FormControlLabel from '@mui/material/FormControlLabel';
import Swal from "sweetalert2"; // Import SweetAlert2
import "./dataUpload.scss";
import { DataGrid } from "@mui/x-data-grid"; 
import AddIcon from '@mui/icons-material/Add';
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
  const columns = [
    { field: "listId", headerName: "LIST ID", width: 80, headerClassName: "customHeader" },
    { field: "name", headerName: "NAME", width: 100, headerClassName: "customHeader" },
    { field: "description", headerName: "DESCRIPTION", width: 150, headerClassName: "customHeader" },
    { field: "leadsCount", headerName: "LEADS COUNT", width: 150, headerClassName: "customHeader" },
    { field: "campaign", headerName: "CAMPAIGN", width: 150, headerClassName: "customHeader" },
    {
      field: "active",
      headerName: "ACTION",
      width: 80,
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
    
    { field: "createTime", headerName: "CREATE TIME", width: 180 },
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      renderCell: (params) => (
        <div className="cellAction">
          <Tooltip title="View Details">
            <IconButton color="primary" onClick={() => handleView(params.row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton color="info" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(params.row.listId)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleToggleStatus = (id) => {
    // Find the row with the matching ID
    const updatedData = data.map((item) =>
      item.listId === id ? { ...item, active: !item.active } : item
    );
  
    // Update the state with the modified data
    setData(updatedData);
  };
  



  const [data, setData] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
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

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(blob, "list_data.xlsx");
  };

  // const handleDelete = async (listId) => {
  //   if (window.confirm("Are you sure you want to delete this list?")) {
  //     try {
  //       await axios.delete(`https://api.example.com/lists/${listId}`);
  //       setData(data.filter((item) => item.listId !== listId));
  //     } catch (error) {
  //       console.error("Error deleting list:", error);
  //       alert("Failed to delete the list.");
  //     }
  //   }
  // };

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

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
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
      await axios.put(`https://api.example.com/lists/${formData.listId}`, formData);
      setData(data.map((item) => (item.listId === formData.listId ? { ...formData } : item)));
      handleCloseEditDialog();
      alert("List updated successfully.");
    } catch (error) {
      console.error("Error updating list:", error);
      alert("Failed to update the list.");
    }
  };

  const handleSaveAdd = async () => {
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
      // Call API to save new list
      await axios.post("https://api.example.com/lists", formData);
      setData([...data, formData]);
      handleCloseAddDialog();
      alert("List added successfully.");
    } catch (error) {
      console.error("Error adding new list:", error);
      alert("Failed to add new list.");
    }
  };


  // Modify columns to allow colored spans for status
  const modifiedColumns = columns.map((col) => {
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
    <div className="datatable">
      <div className="datatableTitle">
        SHOW LIST
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddNewList} style={{
          marginLeft: '640px'
        }}>
          Add New List
        </Button>
        <Button variant="outlined" onClick={handleDownload} style={{
          color: 'primary',
          
        }}>
         <DownloadIcon /> Download
        </Button>
      </div>
      <DataGrid
        rows={data}
        columns={modifiedColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row.listId}
        style={{ fontSize: '12px' }}
      />

      {/* View Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
          Add New List
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '20px' }}>
          <Typography variant="subtitle1" sx={{ marginBottom: '20px', textAlign: 'center' }}>
            Fill in the details to create a new list.
          </Typography>
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
            sx={{ marginTop: '20px' }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '10px 24px' }}>
          <Button
            onClick={handleSaveAdd}
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
          >
            Add List
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default DataUpload;
