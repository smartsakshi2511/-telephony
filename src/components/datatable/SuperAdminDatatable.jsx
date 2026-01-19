import "./datatable.scss";
import { Suspense } from "react";
import React, { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip, CircularProgress, Typography, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

const EditAgent = React.lazy(() => import("./EditAgent"));
const SuperDatatable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editRowId, setEditRowId] = useState(null);
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    full_name: "",
    campaigns_id: [],
    status: "",
    user_type: "",
    agent_priorty: "",
    loginStatus: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAgents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          `https://${window.location.hostname}:4000/telephony/agents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("No users found.");
        } else {
          setError("Error fetching user data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [navigate]);

  const handleDialogOpen = (id) => {
    setEditRowId(id);
    const row = data.find((item) => item.user_id === id);
    if (row) {
      setFormData(row);
      setOpenDialog(true);
    }
  };
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

  const handleLogout = async (user_id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `https://${window.location.hostname}:4000/log/adminLogoutUser`,
        { admin_id: user.user_id, user_id },
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

 
  const handleDelete = (user_id) => {
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

    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.delete(
            `https://${window.location.hostname}:4000/telephony/agents/${user_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setData((prevData) =>
            prevData.filter((item) => item.user_id !== user_id)
          );

          Toast.fire({
            icon: "success",
            title: "User deleted successfully",
          });
        } catch (error) {
          console.error(
            "Error deleting user:",
            error.response?.data || error.message
          );
          Toast.fire({
            icon: "error",
            title: "Failed to delete the user. Please try again.",
          });
        }
      }
    });
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      headerClassName: "customHeader",
      renderCell: (params) => {
        return (
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
                style={{
                  padding: "4px",
                  border: "2px solid blue",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  height: "24px",
                }}
              >
                <Tooltip title="View">
                  <Link
                    to={`${params.row.user_id}`}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <VisibilityIcon
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        fontSize: "12px",
                      }}
                    />
                  </Link>
                </Tooltip>
              </IconButton>

              <IconButton
                color="info"
                style={{
                  padding: "4px",
                  border: "2px solid green",
                  borderRadius: "6px",
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
                    onClick={() => handleDialogOpen(params.row.user_id)}
                  />
                </Tooltip>
              </IconButton>

              <IconButton
                color="error"
                style={{
                  padding: "4px",
                  border: "2px solid red",
                  borderRadius: "6px",
                }}
              >
                <Tooltip title="Delete">
                  <DeleteIcon
                    style={{
                      cursor: "pointer",
                      color: "red",
                      fontSize: "12px",
                    }}
                    onClick={() => handleDelete(params.row.user_id)}
                  />
                </Tooltip>
              </IconButton>
              <IconButton
                style={{
                  padding: "4px",
                  color: "#ec942c",
                  border: "2px solid  #ec942c ",
                  borderRadius: "6px",
                }}
                onClick={() => {
                  handleLogout(params.row.user_id);
                }}
              >
                <Tooltip title="Logout">
                  <ExitToAppIcon
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
        );
      },
    },
  ];
  const userTypeMapping = {
    1: { label: "Agent", color: "#4CAF50" }, 
    2: { label: "Team Leader", color: "#008080" },  
    7: { label: "Manager", color: "#9C27B0" },
    5: { label: "IT", color: "#3F51B5" }, 
    6: { label: "Qual.Analyst", color: "#FF9800" }, 
    8: { label: "Admin", color: "#2196F3" }, 
  };

  const dataField = [
    { field: "user_id", headerName: "USER ID", flex: 0.5 },
    { field: "password", headerName: "PASSWORD", flex: 1 },
    { field: "full_name", headerName: "NAME", flex: 0.5 },
    { field: "campaigns_id", headerName: "AVAIL. CAMPAIGN", flex: 1 },
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
    { field: "agent_priorty", headerName: "PRIORITY", flex: 0.5 },
    {
      field: "loginStatus",
      headerName: "LOGIN STATUS",
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            color: params.row.loginStatus === "Login" ? "#4CAF50" : "#F44336", // Green for Login, Red for Logout
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
    ...actionColumn,
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <Typography>Loading agents...</Typography>
      </div>
    );
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <b>USER LIST</b>
        <Button
          component={Link}
          to="/superadmin/newUser"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(90deg, #283593, #3F51B5)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(90deg, #1e276b, #32408f)",
            },
          }}
        >
          Add User
        </Button>
      </div>
      <DataGrid
        rows={data}
        columns={dataField}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row.user_id}
        localeText={{ noRowsLabel: "No agents found." }}
      />

      <Suspense fallback={<CircularProgress />}>
        {openDialog && (
          <EditAgent
            key={editRowId}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            formData={formData}
            setFormData={setFormData}
            setData={setData}
            editRowId={editRowId}
          />
        )}
      </Suspense>
    </div>
  );
};

export default SuperDatatable;
