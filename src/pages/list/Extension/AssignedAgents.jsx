import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid"; 
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from "axios";
import Swal from "sweetalert2";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import PaginatedGrid from '../../Pagination/PaginatedGrid';


import BackButton from "../../../context/BackButton";   
const AssignedAgents = () => {
  const location = useLocation();
  const { groupId } = location.state || {};  
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);  
  // const navigate = useNavigate(); 
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!groupId) {
          setError("Group ID is missing. Unable to fetch agents.");
          return;
        }
        const response = await axios.get(
          `https://${window.location.hostname}:4000/getAgentsByGroup/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data || []);
        setError("");
      } catch (err) {
        console.error(
          "Error fetching Extension:",
          err.response?.data?.message || err.message
        );
        setError("An error occurred while fetching extensions.");
      }
    };

    fetchAgents();
  }, [groupId]);



  const handleDelete = async (id) => {
    if (!id) {
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      }).fire({
        icon: "warning",
        title: "Please provide a valid ID.",
      });
      return;
    }
  
    try {
      const response = await axios.delete(
        `https://${window.location.hostname}:4000/deletelist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.status === 200) {
        // ✅ Remove deleted row from the DataGrid
        setData((prevData) => prevData.filter((item) => item.id !== id));
  
        // ✅ Show toast
        Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: "success",
          title: "Record deleted successfully.",
        });
      }
    } catch (error) {
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      }).fire({
        icon: "error",
        title:
          error.response?.data?.message ||
          "An error occurred while deleting the record.",
      });
    }
  };
  

  const columns = [
    { field: "group_id", headerName: "USER Extesnion", flex: 1 },
    { field: "agent_id", headerName: "AGENT ID.", flex: 1 },
    { field: "agent_name", headerName: "AGENT NAME", flex: 1 },
    { field: "campaign_id", headerName: "CAMPAIGN ID", flex: 1 },
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
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
    <div style={{ marginTop: "20px", height: "400px" }}>
      <div style={{ marginBottom: "10px" }}>
        <BackButton />
      </div>
  
      <PaginatedGrid
        rows={data || []}
        columns={columns}
      />
  
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
  
  
};

export default AssignedAgents;
