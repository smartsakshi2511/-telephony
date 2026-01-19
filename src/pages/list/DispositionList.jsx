import "./list.scss";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { Divider } from "@mui/material";
import PaginatedGrid from '../Pagination/PaginatedGrid';
import SearchBar from "../../context/searchBar";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  Autocomplete,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const dispositionColumns = [
  {
    field: "sr",
    headerName: "SR.",
    flex: 0.5,
    headerClassName: "customHeader",
    sortable: false,
    filterable: false,
    valueGetter: (params) => `${params.api.getRowIndex(params.id) + 1}`,
  },

  {
    field: "dispo",
    headerName: "DISPOSITION NAME",
    flex: 0.8,
    headerClassName: "customHeader",
  },
  {
    field: "campaign_id",
    headerName: "CAMPAIGN ID",
    flex: 1,
    headerClassName: "customHeader",
  },
  {
    field: "status",
    headerName: "STATUS",
    flex: 0.8,
    headerClassName: "customHeader",
  },
  {
    field: "ins_date",
    headerName: "DATE",
    flex: 1,
    renderCell: (params) => {
      if (!params.value) return "-";
      const utcDate = new Date(params.value);

      const istOffset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(utcDate.getTime() + istOffset);

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
];
const DispositionList = () => {
  const [data, setData] = useState([]); // Initialize data state
  const [campaignOptions, setCampaignOptions] = useState([]);

  const [editRowId, setEditRowId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false); // State for Add Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false); // State for Edit Dialog
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");
  const [editDisposition, setEditDisposition] = useState({
    dispositionName: "",
    campaignId: "",
    status: "",
  });
  const { user } = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [id, setId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    dispo: "",
    campaign_id: "",
    status: "Active",
    admin: "",
  });


  const filteredData = data.filter((item) =>
    item.dispo.toLowerCase().includes(searchQuery.toLowerCase())
  );


useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://${window.location.hostname}:4000/telephony/admin`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    if (user?.user_type === "9") { // Sirf Superadmin ke liye
      fetchAdmins();
    }
  }, [user]);


  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }

        const response = await axios.get(
          `https://${window.location.hostname}:4000/dispo/searchDis`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data);
        setLoading(false);
        setError(""); // Clear any previous errors
      } catch (err) {
        console.error(
          "Error fetching Extension:",
          err.response?.data?.message || err.message
        );
        setLoading(false);
        setError("An error occurred while fetching extensions.");
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://${window.location.hostname}:4000/dispo/user/${id}`)
        .then((response) => {
          setUserData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [id]);
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the block.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            Swal.fire(
              "Error",
              "You are not authorized to perform this action.",
              "error"
            );
            return;
          }

          await axios.delete(
            `https://${window.location.hostname}:4000/dispo/deleteDispo/${id}`,
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
            title: "Disposition Deleted Successfully",
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire(
            "Error",
            "Failed to delete the user. Please try again.",
            "error"
          );
        }
      }
    });
  };

const handleOpen = (row) => {
  setSelectedRow(row.id);
  setUpdatedData({
    id: row.id,   // ✅ yaha add karo
    dispo: row.dispo,
    campaign_id: row.campaign_id,
    status: row.status,
    admin: row.admin || "" // agar admin bhi hai
  });
  setOpen(true);
};


  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdate = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. User must be logged in.");
      return;
    }

  console.log("Updating with:", updatedData);
axios
      .put(
        `https://${window.location.hostname}:4000/dispo/updateDis/${selectedRow}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )


      .then((response) => {
  console.log("Update success:", response.data);
  setData((prevData) =>
    prevData.map((item) =>
      item.id === selectedRow ? { ...item, ...updatedData } : item
    )
  );
        setOpen(false);
  console.log("Update success:", response.data);
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
          title: "Updated Successfully",
        });

        // console.log("Record updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        Swal.fire({
          icon: "error",
          title: "Update failed",
          text: "There was a problem updating the record.",
        });
      });
  };

  const handleSaveEdit = () => {
    const updatedData = data.map((item) =>
      item.id === editRowId ? { ...item, ...editDisposition } : item
    );
    setData(updatedData);
    setEditDialogOpen(false); // Close the dialog after saving
  };

  const handleToggleStatus = async (id) => {
    try {
      const updatedBlock = data.find((item) => item.id === id);
      const newStatus =
        updatedBlock.status === "active" ? "inactive" : "active";

      const response = await axios.put(
        `https://${window.location.hostname}:4000/dispo/statusDispo/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
        // console.log("Status updated in the database");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleView = (row) => {
    setViewData(row);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewData(null);
  };

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleAddDisposition = (newDisposition) => {
    const formattedDispo = {
      ...newDisposition,
      status: newDisposition.status === 1 ? "active" : newDisposition.status,
      ins_date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    };

    setData((prevData) => [formattedDispo, ...prevData]);
  };


  const actionColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 180,
      headerClassName: "customHeader",
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
                    onClick={() => handleView(params.row)}
                    style={{
                      padding: "4px",
                      border: "2px solid blue",
                      borderRadius: "6px 6px",
                      backgroundColor: "white",
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
                    onClick={() => handleOpen(params.row)}
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
                    onClick={() => handleDelete(params.row.id)}
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
              </>
            )}
          </div>
        );
      },
    },
  ];
  const columns = dispositionColumns.map((col) => {
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
        setCampaignOptions(options); // ✅ set it here
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
  }, []);

  return (
    <div className="datatable" style={{ height: 600, width: "100%" }}>
      <div className="datatableTitle" style={styles.datatableTitle}>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          DISPOSITION LIST
        </Typography>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SearchBar
            onSearch={(value) => setSearchQuery(value)}
            placeholder="Search disposition name, campaign..."
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              background: "linear-gradient(90deg, #283593, #3F51B5)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #1e276b, #32408f)", // Darker shade on hover
              },
            }}
          >
            Add Disposition
          </Button>
        </div>
      </div>

      <PaginatedGrid
        rows={filteredData}
        columns={columns.concat(actionColumn)}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", pb: 0 }}>
          Update Disposition
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Disposition"
              name="dispo"
              value={updatedData.dispo}
              onChange={handleFieldChange}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                },
              }}
            />
            {/* <TextField
              label="Campaign ID"
              name="campaign_id"
              value={updatedData.campaign_id}
              onChange={handleFieldChange}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                },
              }}
            /> */}
            <FormControl fullWidth margin="dense">
              <Autocomplete
                multiple
                id="edit-disposition-campaigns"
                options={campaignOptions}
                getOptionLabel={(option) => option.id || "Unnamed"}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={campaignOptions.filter((c) =>
                  updatedData.campaign_id?.includes(c.id)
                )}
                onChange={(event, newValue) =>
                  setUpdatedData((prev) => ({
                    ...prev,
                    campaign_id: newValue.map((item) => item.id),
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Campaigns"
                    fullWidth
                    placeholder="Select Campaigns"
                    variant="outlined"
                    size="small" // ✅ makes the input more compact
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        minHeight: "40px", // ✅ prevents it from growing too large
                        alignItems: "center", // ✅ centers content vertically
                      },
                      "& .MuiInputBase-input": {
                        py: "6px", // ✅ padding inside the field
                      },
                    }}
                  />
                )}
              />
            </FormControl>


            
{user?.user_type === "9" && (
  <FormControl fullWidth margin="dense">
    <TextField
      select
      label="Select Admin"
      name="admin"
      value={updatedData.admin}
      onChange={handleFieldChange}
      variant="outlined"
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
    >
      {admins.map((option) => (
        <MenuItem key={option.user_id} value={option.user_id}>
          {option.user_id}
        </MenuItem>
      ))}
    </TextField>
  </FormControl>
)}


          </Box>
        </DialogContent>


        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleUpdate}
            variant="contained"
            color="primary"
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

      <ViewDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        data={viewData}
      />

      <AddDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleAddDisposition}
        admins={admins}   // ✅ yaha pass karo
        user={user}
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
    color: "black",
  },
};

const ViewDialog = ({ open, onClose, data }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1.5,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 0,
        }}
      >
        View Disposition
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ mb: 2 }} />

      <DialogContent sx={{ pt: 0 }}>
        {data ? (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DetailItem label="ID" value={data.id} />
            </Grid>
            <Grid item xs={6}>
              <DetailItem label="Disposition Name" value={data.dispo} />
            </Grid>
            <Grid item xs={6}>
              <DetailItem label="Campaign ID" value={data.campaign_id} />
            </Grid>
            <Grid item xs={6}>
              <DetailItem label="Status" value={data.status} />
            </Grid>
            <Grid item xs={12}>
              <DetailItem label="Date" value={data.ins_date} />
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2">Loading...</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DetailItem = ({ label, value }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value}
    </Typography>
  </Box>
);

const AddDialog = ({ open, onClose, onAdd,  admins, user }) => {
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [newDisposition, setNewDisposition] = useState({
    dispositionName: "",
    campaignId: "",
    status: "active",
    reminder: 0,
    admin: "",  // ✅ add this
  });


  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDisposition((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/dispo/addDis`,
        newDisposition,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: response.data.message || "Disposition Added Successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setNewDisposition({
        dispositionName: "",
        campaignId: "",
        status: "active",
        reminder: 0,
      });

      onAdd && onAdd(response.data.data);
      onClose();
    } catch (error) {
      console.error("Error adding disposition:", error);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to add disposition",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

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
        setCampaignOptions(options);

      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
      });
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "20px" } }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", pb: 0 }}>
        Add Disposition
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            name="dispositionName"
            label="Disposition Name"
            placeholder="Enter disposition"
            fullWidth
            variant="outlined"
            value={newDisposition.dispositionName}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
          {/* <TextField
            margin="dense"
            name="campaignId"
            label="Campaign"
            fullWidth
            variant="outlined"
            select
            value={newDisposition.campaignId}
            onChange={(e) =>
              setNewDisposition((prev) => ({
                ...prev,
                campaignId: e.target.value,
              }))
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          >
            {campaignOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </TextField> */}

          <FormControl fullWidth margin="dense">
            <Autocomplete
              multiple
              id="disposition-campaigns"
              options={campaignOptions}
              getOptionLabel={(option) => option.id || "Unnamed"}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={campaignOptions.filter((c) =>
                newDisposition.campaignId?.includes(c.id)
              )}
              onChange={(event, newValue) =>
                setNewDisposition((prev) => ({
                  ...prev,
                  campaignId: newValue.map((item) => item.id),
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Campaigns"
                  fullWidth
                  placeholder="Select Campaigns"
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
                />
              )}
            />
          </FormControl>

          {user?.user_type === "9" && (
            <FormControl fullWidth margin="dense">
              <TextField
                select
                label="Select Admin"
                name="admin"
                value={newDisposition.admin}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
              >
                {admins.map((option) => (
                  <MenuItem key={option.user_id} value={option.user_id}>
                    {option.user_id}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          )}



        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={newDisposition.reminder === 1}
              onChange={(e) =>
                setNewDisposition((prev) => ({
                  ...prev,
                  reminder: e.target.checked ? 1 : 0,
                }))
              }
            />
          }
          label="Remind Me"
        />
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default DispositionList;
