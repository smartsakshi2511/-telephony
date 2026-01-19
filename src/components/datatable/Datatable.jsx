import "./datatable.scss";
import { Suspense } from "react";
import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, CircularProgress, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PaginatedGrid from "../../pages/Pagination/PaginatedGrid";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchBar from "../../context/searchBar";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const EditAgent = React.lazy(() => import("./EditAgent"));
const Datatable = () => {
  const [data, setData] = useState([]);
   const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
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
  const [searchQuery, setSearchQuery] = useState("");

  const basePath =
    user?.user_type === "9"
      ? "superadmin"
      : user?.user_type === "8"
        ? "admin"
        : user?.user_type === "7"
          ? "manager"
          : user?.user_type === "2"
            ? "team_leader"
            : "admin";

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

  const handleLogoutAll = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `https://${window.location.hostname}:4000/log/logoutAllAgents`,
        { admin_id: user.user_id, admin_username: user.user_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) =>
        prevData.map((item) => ({ ...item, loginStatus: "Log Out" }))
      );

      Swal.fire("Success!", "All agents have been logged out.", "success");
    } catch (error) {
      console.error(
        "Error logging out all agents:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error",
        "Failed to log out all agents. Please try again.",
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
                <Tooltip title="User info & access">
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
    1: { label: "Agent", color: "#4CAF50" }, // Green
    2: { label: "Team Leader", color: "#40a6ce" }, // Teal Blue
    7: { label: "Manager", color: "#9C27B0" },
    5: { label: "IT", color: "#607D8B" }, // Purple
    6: { label: "Quality Analyst", color: "#FF9800" }, // Orange
    8: { label: "Admin", color: "#2196F3" }, // Blue
  };

  const dataField = [
    {
      field: "sr",
      headerName: "SR",
      flex: 0.2,
      valueGetter: (params) => params.api.getRowIndex(params.id) + 1,
    },

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
          className={`statusButton ${params.row.status === "active" ? "active" : "inactive"
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

  const filteredData = data
  .filter((item) => {
    if (!searchQuery) return true;

    const search = searchQuery.toLowerCase();

    return (
      item.user_id?.toString().toLowerCase().includes(search) ||
      item.password?.toLowerCase().includes(search) ||
      item.full_name?.toLowerCase().includes(search) ||
      item.campaigns_id?.toString().toLowerCase().includes(search) ||
      item.status?.toLowerCase().includes(search) ||
      item.loginStatus?.toLowerCase().includes(search) ||
      item.agent_priorty?.toString().toLowerCase().includes(search) ||
      userTypeMapping[item.user_type]?.label.toLowerCase().includes(search)
    );
  })
  .sort((a, b) => Number(a.user_id) - Number(b.user_id)); // <-- ascending numeric sort

  

  return (
    <div className="datatable">
      <div
        className="datatableTitle"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          color: "black",
        }}
      >
        <b>USERS LIST</b>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <SearchBar
            onSearch={(value) => setSearchQuery(value)}
            placeholder="Search by User ID, Name, Campaign, Level, Status..."
          />
          <Button
            component={RouterLink}
            to={`/${basePath}/new`}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(90deg, #283593, #3F51B5)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #1e276b, #32408f)", // Darker shade on hover
              },
            }}
          >
            Add User
          </Button>

          <Tooltip title="Logout All Agents" arrow>
            <IconButton
              onClick={handleLogoutAll}
              sx={{
                backgroundColor: "#ff4d4d",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#e63946",
                },
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
     <PaginatedGrid
      rows={filteredData}
      columns={dataField}
      paginationModel={paginationModel}
      onPaginationModelChange={(model) => setPaginationModel(model)}
      rowsPerPageOptions={[5, 10, 25, 50]}
      getRowId={(row) => row.user_id}
      autoHeight
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

export default Datatable;
