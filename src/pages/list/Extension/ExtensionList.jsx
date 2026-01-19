import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "sweetalert2";
import Swal from "sweetalert2";

import { DataGrid } from "@mui/x-data-grid";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AssignExtension from "./AssignExtension";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../context/searchBar";

import Dropdown from "./AgentExtension";
import "../list.scss";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { Close as CloseIcon } from "@mui/icons-material";

const ExtensionList = ({ row }) => {
  const [reload, setReload] = useState(false); // ✅ Reload trigger
  const [data, setData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // To handle messages in the component
  const [groupDropdownVisible, setGroupDropdownVisible] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null); // Store current group ID
  const [currentCampaignId, setCurrentCampaignId] = useState(null); // Store current campaign ID
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [filter, setFilter] = useState("all"); // For filtering data
  const [searchQuery, setSearchQuery] = useState("");
  const [editFormData, setEditFormData] = useState({
    id: "",
    group_id: "",
    group_name: "",
    press_key: "",
    campaign_id: "",
  });

  const handleManageAccount = (row) => {
    setCurrentGroupId(row.group_id);
    setCurrentCampaignId(row.campaign_id);
    setDropdownVisible(true);
  };

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      const response = await axios.get(
        `https://${window.location.hostname}:4000/viewExtension`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
      console.log("Updated Data after Add:", response.data);
      setError("");
    } catch (err) {
      console.error(
        "Error fetching Extension:",
        err.response?.data?.message || err.message
      );
      setError("An error occurred while fetching extensions.");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [reload]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://${window.location.hostname}:4000/deleteExtension/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setData((prevData) => prevData.filter((item) => item.id !== id));

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
            title: "Extension deleted successfully",
          });
        } catch (error) {
          console.error("Error deleting record", error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the record.",
            "error"
          );
        }
      }
    });
  };

  const handleEdit = (row) => {
    setEditRowId(row.id);
    setEditFormData({
      id: row.id,
      group_id: row.group_id,
      group_name: row.group_name,
      press_key: row.press_key,
      campaign_id: row.campaign_id,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = async (formData) => {
    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/addExtension`,
        formData
      );

      Toast.fire({
        icon: "success",
        title: response.data.message || "Extension added successfully",
      });

      setAddDialogOpen(false);

      // Wait a little before fetching campaigns (optional delay)
      setTimeout(() => {
        fetchCampaigns();
      }, 500); // ⏳ 500ms delay can help if DB is slightly slow
    } catch (error) {
      console.error("Error adding new extension", error);
    }
  };

  const filteredData = data.filter((item) => {
    if (filter === "active" && item.status !== "active") return false;
    if (!searchQuery) return true;

    const search = searchQuery.toLowerCase();

    return (
      item.group_id?.toString().toLowerCase().includes(search) ||
      item.group_name?.toLowerCase().includes(search) ||
      item.id?.toString().toLowerCase().includes(search) || // This is still useful if you want to search by serial no
      item.press_key?.toString().toLowerCase().includes(search) ||
      item.campaign_id?.toString().toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      valueGetter: (params) => data.indexOf(params.row) + 1,
    },
    { field: "group_id", headerName: "USER EXTENSION", flex: 1 },
    { field: "group_name", headerName: "EXTENSION NAME", flex: 2 },
    { field: "press_key", headerName: "PRESS KEY", width: 100 },
    { field: "campaign_id", headerName: "CAMPAIGN", flex: 1 },
    {
      field: "action",
      headerName: "ACTION",
      width: 250,
      renderCell: (params) => (
        <div className="cellAction">
          <div
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
              onClick={() =>
                navigate("assignedagents", {
                  state: { groupId: params.row.group_id },
                })
              }
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
            </IconButton>
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
              onClick={() => handleManageAccount(params.row)}
              style={{
                padding: "4px",
                border: "2px solid #1976d2",
                borderRadius: "6px 6px",
                backgroundColor: "white",
              }}
            >
              <Tooltip
                title="Assign Department to Agents"
                arrow
                disableInteractive
              >
                <ManageAccountsIcon
                  style={{
                    cursor: "pointer",
                    color: "#1976d2",
                    fontSize: "12px",
                  }}
                />
              </Tooltip>
            </IconButton>
            {dropdownVisible && (
              <Dropdown
                dropdownVisible={dropdownVisible}
                setDropdownVisible={setDropdownVisible}
                groupId={currentGroupId} // Pass the updated group ID
                campaignId={currentCampaignId} // Pass the updated campaign ID
              />
            )}

            <Tooltip title="Review Assigned Agents">
              <IconButton
                color="purple"
                onClick={() => {
                  setGroupDropdownVisible(true);
                  setSelectedGroupId(params.row.group_id);
                }}
                style={{
                  padding: "4px",
                  border: "2px solid purple",
                  borderRadius: "6px 6px",
                  backgroundColor: "white",
                }}
              >
                <GroupIcon
                  style={{
                    cursor: "pointer",
                    color: "purple",
                    fontSize: "12px",
                  }}
                />
              </IconButton>
            </Tooltip>
            <AssignExtension
              groupId={selectedGroupId}
              groupDropdownVisible={groupDropdownVisible}
              setGroupDropdownVisible={setGroupDropdownVisible}
            />
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)}
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
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b> USER EXTENSION LIST </b>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SearchBar
            onSearch={(value) => setSearchQuery(value)}
            placeholder="Search extension name..."
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              background: "linear-gradient(90deg, #283593, #3F51B5)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #1e276b, #32408f)",
              },
            }}
          >
            Add Extension
          </Button>
        </div>
      </div>

      <DataGrid
        rows={filteredData}
        columns={columns}
        pagination
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        disableRowSelectionOnClick
        sx={{
          height: 500, // 👈 fixed height (scroll milega)
        }}
      />

      {addDialogOpen && (
        <AddDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onAdd={handleAdd}
        />
      )}
      {editDialogOpen && (
        <EditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          formData={editFormData}
          setFormData={setEditFormData}
          setData={setData}
          setMessage={setMessage}
        />
      )}
    </div>
  );
};
const EditDialog = ({ open, onClose, formData, setFormData, setData }) => {
  const [extensionOptions, setExtensionOptions] = useState([]);

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
        setExtensionOptions([
          { id: "", label: "--- Select Campaign ID ---" },
          ...options,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Error",
          text: "You are not authenticated.",
        });
        return;
      }

      const updatedData = {
        group_id: formData.group_id,
        group_name: formData.group_name,
        campaign_id: formData.campaign_id,
        press_key: formData.press_key,
        menu_id: formData.menu_id || "", // Ensure menu_id is not NULL
      };
      const url = `https://${window.location.hostname}:4000/extensionUpdate/${formData.id}`;
      const response = await axios.put(url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === formData.id ? { ...item, ...updatedData } : item
          )
        );
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
          title: "Extension updated successfully",
        });

        onClose();
      } else {
        // ❌ Toast Failure
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update the extension.",
        });
      }
    } catch (error) {
      console.error("Error updating extension:", error.response?.data || error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          boxShadow: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.2rem",
          textAlign: "center",
          pb: 1,
        }}
      >
        Edit Extension
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="ID"
              name="id"
              value={formData.id}
              disabled
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Extension ID"
              name="group_id"
              type="number"
              value={formData.group_id}
              onChange={handleEditChange}
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Extension Name"
              name="group_name"
              value={formData.group_name}
              onChange={handleEditChange}
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Press Key"
              name="press_key"
              type="number"
              value={formData.press_key}
              onChange={handleEditChange}
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Campaign"
              name="campaign_id"
              select
              value={formData.campaign_id}
              onChange={handleEditChange}
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            >
              {extensionOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.id}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ py: 2 }}>
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
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddDialog = ({ open, onClose, onAdd }) => {
  const [extensionOptions, setExtensionOptions] = useState([]);
  const [formData, setFormData] = useState({
    group_id: "",
    group_name: "",
    campaign_id: "",
    press_key: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`https://${window.location.hostname}:4000/campaigns_dropdown`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const options = response.data.map((campaign) => ({
          id: campaign.compaign_id,
          label: campaign.compaignname,
        }));
        setExtensionOptions([
          { id: "", label: "--- Select Campaign ID ---" },
          ...options,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = { ...formData };
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

    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/addExtension`,
        requestData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      onClose(); // Close the modal or form

      Toast.fire({
        icon: "success",
        title: response.data.message || "Extension added successfully!",
      });
    } catch (error) {
      console.error(
        "❌ Error adding extension:",
        error.response?.data || error
      );

      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          boxShadow: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.2rem",

          pb: 1,
        }}
      >
        Add Extension
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Extension ID"
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Extension Name"
              name="group_name"
              value={formData.group_name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Press Key"
              name="press_key"
              type="number"
              value={formData.press_key}
              onChange={(e) => {
                const value = e.target.value; 
                if (
                  value === "" ||
                  (Number(value) >= 1 && Number(value) <= 9)
                ) {
                  setFormData({ ...formData, press_key: value });
                }
              }}
              fullWidth
              variant="outlined"
              inputProps={{
                min: 1,
                max: 9,
                step: 1,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Campaign"
              name="campaign_id"
              select
              value={formData.campaign_id}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            >
              {extensionOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.id}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ py: 2 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtensionList;
