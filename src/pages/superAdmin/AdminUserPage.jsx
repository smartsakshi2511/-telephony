import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ResetButton from "../../context/ResetButton";  

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const AdminUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openeditDialog, setOpeneditDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `https://${window.location.hostname}:4000/telephony/admin`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "No users found."
            : "Error fetching user data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [navigate]);

  const handleToggleStatus = async (user_id) => {
    try {
      const response = await axios.put(
        `https://${window.location.hostname}:4000/telephony/status/${user_id}`,
        {},
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
            item.user_id === user_id
              ? {
                  ...item,
                  status: item.status === "active" ? "inactive" : "active",
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDelete = async (user_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://${window.location.hostname}:4000/telephony/agents/${user_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          setData((prev) => prev.filter((item) => item.user_id !== user_id));

          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "User deleted successfully",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } catch (error) {
          console.error("Delete failed:", error);

          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Failed to delete user",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "Delete cancelled",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleLogout = async (user_id) => {
    try {
      const token = localStorage.getItem("token");

      const loggedInUser = JSON.parse(localStorage.getItem("user")); // assuming user is stored in localStorage
      if (!loggedInUser) {
        console.error("Logged-in user not found in localStorage.");
        return;
      }

      const response = await axios.post(
        `https://${window.location.hostname}:4000/log/adminLogoutUser`,
        {
          admin_id: loggedInUser.user_id,
          user_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData((prevData) =>
        prevData.map((item) =>
          item.user_id === user_id
            ? { ...item, loginStatus: "Logged Out" }
            : item
        )
      );
      Swal.fire(
        "Logged out!",
        "The user has been logged out successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Error logging out user:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error",
        "Failed to log out the user. Please try again.",
        "error"
      );
    }
  };

  const userTypeMapping = {
    8: { label: "Admin", color: "#2196F3" },
  };

  const dataField = [
    { field: "user_id", headerName: "USER ID", flex: 0.5 },
    { field: "password", headerName: "PASSWORD", flex: 1 },
    { field: "full_name", headerName: "NAME", flex: 0.5 },
    { field: "avail_agents", headerName: "AVAIL. AGENTS", flex: 1 },
    {
      field: "user_type",
      headerName: "LEVEL",
      flex: 0.5,
      renderCell: (params) => {
        const userType = userTypeMapping[params.row.user_type] || {
          label: "Unknown",
          color: "#9E9E9E",
        };
        return (
          <span style={{ color: userType.color, fontWeight: "bold" }}>
            {userType.label}
          </span>
        );
      },
    },
    { field: "otp", headerName: "otp", flex: 0.5 },
    {
      field: "loginStatus",
      headerName: "LOGIN STATUS",
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            color: params.row.loginStatus === "Login" ? "#4CAF50" : "#F44336",
            fontWeight: "bold",
          }}
        >
          {params.row.loginStatus}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      renderCell: (params) => (
        <button
          className={`statusButton ${
            params.row.status === "active" ? "active" : "inactive"
          }`}
          onClick={() => handleToggleStatus(params.row.user_id)}
        >
          {params.row.status === "active" ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => navigate(`/superadmin/details/${params.row.id}`)}
              style={{ border: "2px solid blue" }}
            >
              <VisibilityIcon style={{ color: "blue", fontSize: "14px" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedAdmin(params.row);
                setOpeneditDialog(true);
              }}
              style={{ border: "2px solid green" }}
            >
              <EditIcon style={{ color: "green", fontSize: "14px" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.user_id)}
              style={{ border: "2px solid red" }}
            >
              <DeleteIcon style={{ color: "red", fontSize: "14px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton
              size="small"
              onClick={() => handleLogout(params.row.user_id)}
              style={{ border: "2px solid orange" }}
            >
              <ExitToAppIcon style={{ color: "orange", fontSize: "14px" }} />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b>ADMIN USER</b>
        <Button
          sx={{
            background: "linear-gradient(90deg, #283593, #3F51B5)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(90deg, #1e276b, #32408f)",
            },
          }}
          startIcon={<AddIcon />}
          component={Link}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Admin
        </Button>
         <ResetButton onAfterReset={() => setData([])} />
      
      </div>
        

      <DataGrid
        rows={data}
        columns={dataField}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row.adminId || row.user_id}
        localeText={{ noRowsLabel: "No agents found." }}
        autoHeight
      />

      <AddAdminDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAdd={(newUser) => {
          setData((prev) => [
            ...prev,
            {
              ...newUser,
              id: newUser.adminId || newUser.user_id, // make sure DataGrid has id
            },
          ]);
        }}
      />

      <EditAdminDialog
        open={openeditDialog}
        onClose={() => setOpeneditDialog(false)}
        onUpdate={(updatedUser) => {
          setData((prev) =>
            prev.map((item) =>
              item.user_id === updatedUser.user_id
                ? { ...item, ...updatedUser } // merge local changes
                : item
            )
          );
        }}
        adminData={selectedAdmin}
      />
    </div>
  );
};
const AddAdminDialog = ({ open, onClose, onAdd }) => {
  const [newAdmin, setNewAdmin] = useState({
    user_id: "",
    full_name: "",
    use_did: "",
    password: "",
    ext_number: "",
    // allocated_clients: "",
    admin_mobile: "",
    admin_email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/telephony/add/admin`,
        newAdmin,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
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
        title: response.data.message || "Admin added successfully!",
      });

      // ✅ Reset form
      setNewAdmin({
        user_id: "",
        password: "",
        full_name: "",
        use_did: "",
        ext_number: "",
        admin_mobile: "",
        admin_email: "",
      });

      onAdd &&
        onAdd({
          ...newAdmin, // frontend form values
          ...response.data, // backend response (adminId, message, etc.)
          id: response.data.adminId, // DataGrid key
        });

      // ✅ Close dialog after success
      onClose();
    } catch (error) {
      console.error("Error adding admin:", error);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to add admin",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", pb: 0 }}>
        Add Admin
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
            name="user_id"
            label="User ID"
            placeholder="Enter user ID"
            fullWidth
            variant="outlined"
            value={newAdmin.user_id}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
          <TextField
            margin="dense"
            name="full_name"
            label="Full Name"
            placeholder="Enter full name"
            fullWidth
            variant="outlined"
            value={newAdmin.full_name}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            margin="dense"
            name="use_did"
            label="User DID"
            placeholder="Enter DID"
            fullWidth
            variant="outlined"
            value={newAdmin.use_did}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
          <TextField
            margin="dense"
            name="ext_number"
            label="Extension Number"
            placeholder="Enter extension"
            fullWidth
            variant="outlined"
            value={newAdmin.ext_number}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            margin="dense"
            name="password"
            label="Password"
            placeholder="Enter password"
            fullWidth
            type="password"
            variant="outlined"
            value={newAdmin.password}
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
          <TextField
            margin="dense"
            name="admin_mobile"
            label="Phone Number"
            placeholder="Enter number"
            fullWidth
            variant="outlined"
            value={newAdmin.admin_mobile}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
              },
            }}
          />
          <TextField
            margin="dense"
            name="admin_email"
            label="Email"
            placeholder="Enter Email"
            fullWidth
            variant="outlined"
            value={newAdmin.admin_email}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
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
          Add Admin
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const EditAdminDialog = ({ open, onClose, adminData, onUpdate }) => {
  const [admin, setAdmin] = useState({ ...adminData });

  useEffect(() => {
    setAdmin({ ...adminData });
  }, [adminData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      full_name: admin.full_name,
      use_did: admin.use_did,
      ext_number: admin.ext_number,
      admin_mobile: admin.admin_mobile,
      admin_email: admin.admin_email,
    };

    if (admin.password && admin.password.trim() !== "") {
      payload.password = admin.password;
    }

    console.log("Sending payload to backend:", payload);

    const response = await axios.put(
      `https://${window.location.hostname}:4000/telephony/admin/${admin.user_id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Backend response:", response.data);

    if (response.status === 200) {
      // Update local state only after successful DB save
      onUpdate &&
        onUpdate({
          ...payload,
          user_id: admin.user_id, // ensure DataGrid id matches
        });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: response.data.message || "Admin updated successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      onClose();
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to update admin. Check backend response.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.error("Error saving admin:", error);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "An error occurred while saving.",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", pb: 0 }}>
        Edit Admin
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
            label="User ID"
            name="user_id"
            value={admin.user_id}
            fullWidth
            disabled
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
          <TextField
            label="Full Name"
            name="full_name"
            value={admin.full_name}
            onChange={handleChange}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            label="User DID"
            name="use_did"
            value={admin.use_did}
            onChange={handleChange}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
          <TextField
            label="Extension"
            name="ext_number"
            value={admin.ext_number}
            onChange={handleChange}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            label="Password"
            name="password"
            type="password"
            placeholder="Leave blank to keep same"
            value={admin.password}
            onChange={handleChange}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
          <TextField
            label="Phone Number"
            name="admin_mobile"
            value={admin.admin_mobile}
            onChange={handleChange}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            label="Email"
            name="admin_email"
            value={admin.admin_email}
            onChange={handleChange}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained">
          Update Admin
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminUser;
