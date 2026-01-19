import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Close as CloseIcon } from "@mui/icons-material";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Container,
  Grid,
  IconButton,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import "../list/list.scss";
const ShowList = () => {
  const { listId, campaign } = useParams();
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // State for file input
  const [listData, setListData] = useState([]);
  const [agents, setAgents] = useState([]);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `https://${window.location.hostname}:4000/showlist/${listId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setListData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (listId) {
      fetchData();
    }
  }, [listId]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://${window.location.hostname}:4000/call_report_agent_dropdown`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleDelete = useCallback(async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the selected row!",
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
            Swal.fire("Unauthorized", "Please log in to proceed.", "error");
            return;
          }

          const response = await axios.delete(
            `https://${window.location.hostname}:4000/data/delete/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
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
              title: "Row deleted successfully",
            });
 
            setListData((prevData) => prevData.filter((row) => row.id !== id));
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            Swal.fire("Not Found", error.response.data.message, "warning");
          } else {
            Swal.fire(
              "Error",
              "There was a problem deleting the row.",
              "error"
            );
          }
          console.error(
            "Error deleting the row:",
            error.response?.data || error
          );
        }
      }
    });
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    if (!selectedFile) {
      alert("Please choose a file before saving.");
      return;
    }

    if (selectedUsers.length === 0) {
      alert("Please select at least one user before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", selectedFile);
    formData.append("selectedUsers", selectedUsers.join(","));
    formData.append("listId", listId);
    formData.append("campaign_id", campaign);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `https://${window.location.hostname}:4000/showListupload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
        title: "File uploaded successfully",
      });

      fetchData();  
      handleCloseDialog();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An unexpected error occurred while uploading.");
    }
  };

  const handleDownload = () => {
    if (!listData || listData.length === 0) {
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
        icon: "warning",
        title: "No data available to download",
      });

      return;
    }

    const excelData = listData.map((item, index) => ({
      No: index + 1,
      "Unique ID": item.uniqueid,
      "Company Name": item.company_name,
      "Employee Size": item.employee_size,
      Industry: item.industry,
      Country: item.country,
      City: item.city,
      Department: item.department,
      Designation: item.designation,
      Email: item.email,
      Name: item.name,
      "Phone Number": item.phone_number,
      "Alternate Phone 1": item.phone_2,
      "Alternate Phone 2": item.phone_3,
      "Phone Code": item.phone_code,
      Username: item.username,
      Admin: item.admin,
      "Inserted Date": item.ins_date,
      "Dial Status": item.dial_status,
      "List ID": item.list_id,
      "Campaign ID": item.campaign_Id,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Database Export");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(
      blob,
      `database_export_${new Date().toISOString().split("T")[0]}.xlsx`
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
      title: `${listData.length} records exported successfully`,
    });
  };

  const columns = useMemo(
    () => [
      {
        field: "serial",
        headerName: "No.",
        flex: 0.2,
        sortable: false,
      },
      { field: "name", headerName: "Name", flex: 0.3 },
      { field: "email", headerName: "Email", flex: 0.5 },
      { field: "department", headerName: "Department", flex: 0.5 },
      { field: "phone_number", headerName: "Phone Number", flex: 0.5 },
      { field: "employee_size", headerName: "Employee Size", flex: 0.3 },

      { field: "company_name", headerName: "Company Name", flex: 0.4 },
      { field: "industry", headerName: "Industry", flex: 0.3 },
      {
        field: "dial_status",
        headerName: "Status",
        flex: 0.3,
      },
      {
        field: "action",
        headerName: "Action",
        flex: 0.3,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)} // ✅ stable reference
              style={{
                padding: "4px",
                border: "2px solid red",
                borderRadius: "6px",
                backgroundColor: "white",
              }}
            >
              <Tooltip title="Delete">
                <DeleteIcon
                  style={{ cursor: "pointer", color: "red", fontSize: "12px" }}
                />
              </Tooltip>
            </IconButton>
          </div>
        ),
      },
      {
        field: "username",
        headerName: "Allocate",
        flex: 0.3,
      },
    ],
    [handleDelete]
  );

  const handleDeleteAll = async (listId) => {
    if (!listId) {
      Swal.fire("Error", "Invalid list ID.", "error");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "This action will delete all records from this list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");

          if (!token) {
            Swal.fire("Unauthorized", "Please log in to proceed.", "error");
            return;
          }

          const response = await axios.delete(
            `https://${window.location.hostname}:4000/delete-all/${listId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
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
              title: "All records deleted successfully",
            });

            setListData([]);
          }
        } catch (error) {
          console.error("Error deleting all rows:", error);
          Swal.fire("Error", "There was a problem deleting the data.", "error");
        }
      }
    });
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "gray",
          }}
        >
          Total Upload Data
        </h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            sx={{
              background: "linear-gradient(90deg, #283593, #3F51B5, #283593)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "4px",
              textTransform: "none",
            }}
          >
            Upload
          </Button>

          <Tooltip title="Download Data">
            <Button
              variant="contained"
              onClick={handleDownload}
              sx={{
                background: "linear-gradient(90deg, #4caf50, #2e7d32)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                textTransform: "none",
              }}
            >
              Export <DownloadIcon sx={{ ml: 1 }} />
            </Button>
          </Tooltip>

          <Button
            variant="contained"
            onClick={() => handleDeleteAll(listId)}
            sx={{
              background: "linear-gradient(90deg, #b71c1c, #d32f2f, #b71c1c)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              textTransform: "none",
            }}
          >
            Delete All
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("dialdata")}  
            sx={{
              backgroundColor: "#17a2b8",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              textTransform: "none",
            }}
          >
            Dialed Data
          </Button>
        </div>
      </Grid>

      <div
        style={{
          height: 400,
          width: "100%",
          marginTop: "20px",
          overflowX: "auto",
        }}
      >
        <PaginatedGrid
          rows={listData.map((row, index) => ({
            ...row,
            serial: page * pageSize + index + 1,
          }))}
          columns={columns}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", pb: 0 }}>
          Upload Excel File
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Select Users</InputLabel>
                <Select
                  multiple
                  value={selectedUsers}  
                  onChange={(e) => setSelectedUsers(e.target.value)} // Update selected users
                  fullWidth
                  label="Select Users"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      height: "45px",
                    },
                  }}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {agents.map((agent) => (
                    <MenuItem key={agent.user_id} value={agent.user_id}>
                      {agent.user_id} - {agent.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flex: 1 }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                fullWidth
                onClick={handleButtonClick}
                sx={{
                  height: "45px",
                  borderRadius: "15px",
                  textTransform: "none",
                }}
              >
                {selectedFile ? selectedFile.name : "Choose File"}
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="secondary"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
            disabled={!selectedFile} // Save disabled until file selected
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShowList;
