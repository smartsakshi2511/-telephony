import  { useState, useEffect } from "react";
import "./dataUpload.scss";
import UploadLeadDialog from "./UploadFile";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import SearchBar from "../../context/searchBar";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
  Divider,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

const DataUpload = ({ selectedListId }) => {
  const navigate = useNavigate();
  const columns = [
    {
      field: "LIST_ID",
      headerName: "LIST ID",
      flex: 0.5,
      headerClassName: "customHeader",
      renderCell: (params) => (
        <button
          className="listIdButton"
          onClick={() => navigate(`showlist/${params.row.LIST_ID}`)}  
          style={{
            background: "none",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {params.row.LIST_ID}
        </button>
      ),
    },
    {
      field: "NAME",
      headerName: "NAME",
      flex: 1,
    },
    {
      field: "DESCRIPTION",
      headerName: "DESCRIPTION",
      flex: 1,
      headerClassName: "customHeader",
    },
    {
      field: "LEADS_COUNT",
      headerName: "LEADS COUNT",
      flex: 1,
      headerClassName: "customHeader",
      renderCell: (params) => {
        return (
          <span
            style={{
              color: params.row.LEADS_COUNT != null ? "green" : "black",
            }}
          >
            {params.row.LEADS_COUNT != null
              ? params.row.LEADS_COUNT
              : "Not available"}
          </span>
        );
      },
    },
    {
      field: "CAMPAIGN",
      headerName: "CAMPAIGN",
      flex: 1,
      headerClassName: "customHeader",
    },
    {
      field: "ACTIVE",
      headerName: "STATUS",
      width: 180,
      renderCell: (params) => {
        const isActive = params.row.ACTIVE === "active"; // Define isActive here
        return (
          <button
            className={`statusButton ${isActive ? "active" : "inactive"}`}
            onClick={() => handleToggleStatus(params.row.LIST_ID)}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        );
      },
    },
    {
      field: "RTIME",
      headerName: "CREATE TIME",
      flex: 1.5,
      renderCell: (params) => {
        if (!params.value) return "-";
        const utcDate = new Date(params.value);
        const istDate = new Date(
          utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );

        const formattedDate = istDate.toLocaleString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        return formattedDate;
      },
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
            gap: "8px",
          }}
        >
          <IconButton
            color="primary"
            onClick={() => handleOpenDialog(params.row)}  
            style={{
              padding: "4px",
              border: "2px solid blue",
              borderRadius: "6px 6px",
              backgroundColor: "white",
            }}
          >
            <Tooltip title="Upload">
              <UploadIcon
                style={{
                  cursor: "pointer",
                  color: "blue",
                  fontSize: "12px",
                }}
              />
            </Tooltip>
          </IconButton>

          <UploadLeadDialog
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
            listId={listId}
            campaign={campaign}
          />

          <IconButton
            color="info"
            onClick={() => handleEdit(params.row)}
            style={{
              padding: "4px",
              border: "2px solid green",
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
              border: "2px solid red",
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
  const [openDialog, setOpenDialog] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [listId, setListId] = useState("");
  const [campaign, setCampaign] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // or "active"

  const [formData, setFormData] = useState({
    listId: "",
    name: "",
    description: "",
    leadsCount: "",
    callTime: null,  
    lastCallTime: null,
    campaign: "",
    active: true,
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [campaignOptions, setCampaignOptions] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`https://${window.location.hostname}:4000/campaigns_dropdown`, {
        headers: { Authorization: `Bearer ${token}` }, // No need for query params
      })
      .then((response) => {

        const options = response.data.map((campaign) => ({
          id: campaign.compaign_id,
          label: campaign.compaignname,
        }));
        setCampaignOptions([
          { id: "", label: "--- Select Campaign ID ---" },
          ...options,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve JWT Token

    if (!token) {
      console.error("No token found, redirecting to login...");
      navigate("/login");
      return;
    }

    axios
      .get(`https://${window.location.hostname}:4000/list`, {
        headers: { Authorization: `Bearer ${token}` }, // Send token with request
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleOpenDialog = (row) => {
    setListId(row.LIST_ID);
    setCampaign(row.CAMPAIGN);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAddDialogOpen(false);
    setEditDialogOpen(false);
  };

  const handleToggleStatus = async (id) => {
    const updatedDisposition = data.find((item) => item.LIST_ID  === id);
    const newStatus =
      updatedDisposition.ACTIVE === "active" ? "inactive" : "active";
    try {
      setData((prevData) =>
        prevData.map((item) =>
          item.LIST_ID  === id ? { ...item, ACTIVE: newStatus } : item
        )
      );

      const response = await axios.put(
        `https://${window.location.hostname}:4000/statusUpload/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

const handleDelete = async (rowData) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `https://${window.location.hostname}:4000/lists/${rowData.LIST_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setData((prevData) =>
      prevData.filter((item) => item.LIST_ID !== rowData.LIST_ID)
    );

    showToast("success", "The list has been deleted.");
  } catch (error) {
    console.error("Error deleting list:", error);
    showToast("error", "Failed to delete the list.");
  }
};


  const handleSaveAdd = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    const newData = {
      LIST_ID: formData.listId,
      NAME: formData.name,
      DESCRIPTION: formData.description,
      LEADS_COUNT: formData.leadsCount || 0,
      CAMPAIGN: formData.campaign,
      ACTIVE: formData.active ?? true,
      RTIME: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/listAdd`,
        newData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prevData) => [
        ...prevData,
        { ...newData, id: response.data.insertId },
      ]);

      handleCloseDialog(); // ✅ Close dialog

      Toast.fire({
        icon: "success",
        title: "Data added successfully!",
      });
    } catch (error) {
      console.error("Error adding data:", error);

      Toast.fire({
        icon: "error",
        title: "Failed to add data!",
      });
    }
  };

  const handleAddNewList = () => {
    setFormData({
      listId: "", // Auto-generate listId
      name: "",
      description: "",
      leadsCount: "",
      campaign: "",
      active: false,
      createTime: new Date().toLocaleString(),
    });
    setAddDialogOpen(true);
  };

   const handleDownload = () => {
    const staticExcelData = [
      {
        email: "xyz@gmail.com",
        name: "John",
        phone_number: "1234567890",
      },
      {  
        email: "abc@gmail.com",
        name: "Jane",
        phone_number: "9876543210",
      },
      { 
        email: "abc@gmail.com",
        name: "Alice",
        phone_number: "2223334444",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(staticExcelData);
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (editDialogOpen && selectedListId) {
      axios
        .get(`https://${window.location.hostname}:4000/lists/${selectedListId}`)
        .then((response) => {
          if (response.data) {
            setFormData(response.data); // Populate formData with fetched data
          } else {
            console.error("No data found for the provided listId.");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [editDialogOpen, selectedListId]);

  const handleUpdate = () => {
    if (!formData.listId) {
      Swal.fire({
        icon: "warning",
        title: "Missing List ID",
        text: "Unable to save changes.",
      });
      return;
    }
    const token = localStorage.getItem("token");

    axios
      .put(
        `https://${window.location.hostname}:4000/lists/${formData.listId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        // ✅ Update the data state
        setData((prevData) =>
          prevData.map((item) =>
            item.LIST_ID === formData.listId
              ? {
                  ...item,
                  NAME: formData.name,
                  DESCRIPTION: formData.description,
                  LEADS_COUNT: formData.leadsCount,
                  CAMPAIGN: formData.campaign,
                  ACTIVE: formData.active,
                }
              : item
          )
        );
        handleCloseEditDialog(); // ✅ Close first

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "success",
          title: "Data updated successfully",
        });
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Could not update the list. Please try again.",
        });
      });
  };

  const handleEdit = (rowData) => {
    setFormData({
      listId: rowData.LIST_ID, // Ensure correct key matching DB
      name: rowData.NAME,
      description: rowData.DESCRIPTION,
      leadsCount: rowData.LEADS_COUNT,
      campaign: rowData.CAMPAIGN,
      active: rowData.ACTIVE === 1, // Convert 1/0 to true/false for Switch
    });
    setEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => {
    setFormData({
      listId: "",
      name: "",
      description: "",
      campaign: "",
    });
    setAddDialogOpen(false);
    setEditDialogOpen(false);
  };

  const filteredData = data.filter((item) => {
    if (filter === "active" && item.ACTIVE !== "active") return false;
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    return (
      (item.LIST_ID && item.LIST_ID.toString().toLowerCase().includes(query)) ||
      (item.NAME && item.NAME.toLowerCase().includes(query)) ||
      (item.CAMPAIGN && item.CAMPAIGN.toLowerCase().includes(query)) ||
      (item.ACTIVE && item.ACTIVE.toLowerCase().includes(query)) ||
      (item.RTIME &&
        new Date(item.RTIME)
          .toLocaleString("en-IN")
          .toLowerCase()
          .includes(query))
    );
  });

  return (
    <div className="data">
      <div
        className="datatableT-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>SHOW LIST</div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <SearchBar
            onSearch={(value) => setSearchQuery(value)}
            placeholder="Search list id, campaign..."
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNewList}
            sx={{
              background: "linear-gradient(90deg, #283593, #3F51B5)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #1e276b, #32408f)",
              },
            }}
          >
            Add New List
          </Button>

          <Tooltip title="Download the data format and upload your data in this format">
            <Button
              variant="outlined"
              onClick={handleDownload}
              style={{
                color: "#1e276b",
                borderColor: "#1e276b",
              }}
            >
              sample <DownloadIcon />
            </Button>
          </Tooltip>
        </div>
      </div>

      <PaginatedGrid
        rows={filteredData}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row.LIST_ID}
        style={{ fontSize: "12px" }}
        autoHeight
      />

      <Dialog
        open={addDialogOpen || editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 6,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            pt: 2,
          }}
        >
          {editDialogOpen ? "Edit List" : "Add New List"}
          <IconButton onClick={handleCloseEditDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />
        <DialogContent
          sx={{
            px: 3,
            pt: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="List ID"
                name="listId"
                value={formData.listId}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
                disabled={editDialogOpen}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="List Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="List Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Select Campaign"
                name="campaign"
                value={formData.campaign}
                onChange={handleFormChange}
                fullWidth
                margin="dense"
              >
                {campaignOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.id}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleSaveAdd}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          style: {
            backgroundColor: "transparent", // No dim effect
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px", // Rounded corners
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", pb: 0 }}>
          Edit List
          <IconButton
            aria-label="close"
            onClick={handleCloseEditDialog}
            sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: 3,
            pt: 2,
            "& .MuiTextField-root .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="List ID"
                value={formData.listId}
                onChange={(e) =>
                  setFormData({ ...formData, listId: e.target.value })
                }
                fullWidth
                margin="dense"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
                margin="dense"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Leads Count"
                value={formData.leadsCount}
                onChange={(e) =>
                  setFormData({ ...formData, leadsCount: e.target.value })
                }
                fullWidth
                margin="dense"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Select Campaign"
                value={formData.campaign}
                onChange={(e) =>
                  setFormData({ ...formData, campaign: e.target.value })
                }
                fullWidth
                margin="dense"
              >
                {campaignOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.id}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleUpdate}
            color="primary"
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default DataUpload;
export const showToast = (icon, title) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({
    icon,
    title,
  });
};
