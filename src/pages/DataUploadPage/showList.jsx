import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Container,
  Grid,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import '../list/list.scss';  // Adjust the path to point to the correct location

const ShowList = () => {
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [selectedUser, setSelectedUser] = useState(""); // State for dropdown selection
  const [selectedFile, setSelectedFile] = useState(null); // State for file input
  const [editRowId, setEditRowId] = useState(null);
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "John Doe",
      number: "1234567890",
      email: "johndoe@example.com",
      company: "ABC Ltd.",
      industry: "Finance",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      number: "9876543210",
      email: "janesmith@example.com",
      company: "XYZ Pvt. Ltd.",
      industry: "IT",
      status: "Inactive",
    },
  ]);

  // SweetAlert2: Delete All
  const handleDeleteAll = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete all data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
    }).then((result) => {
      if (result.isConfirmed) {
        setRows([]); // Clear all rows
        Swal.fire("Deleted!", "All data has been deleted.", "success");
      }
    });
  };

  // SweetAlert2: Delete Single Row
  const handleDelete = (rowId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the selected row!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== rowId)); // Remove the row
        Swal.fire("Deleted!", "The row has been deleted.", "success");
      }
    });
  };

  // Dialog handlers
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const handleSave = () => {
    if (!selectedFile) {
      alert("Please choose a file before saving.");
      return;
    }
    console.log("Selected User:", selectedUser);
    console.log("Selected File:", selectedFile);
    // File upload logic here
    handleCloseDialog(); // Close dialog after saving
  };

  // DataGrid handlers
  const handleDownload = () => {
    if (rows.length === 0) {
      alert("No data available to download.");
      return;
    }

    const excelData = rows.map((item) => ({
      "LIST ID": item.id,
      NAME: item.name,
      NUMBER: item.number,
      EMAIL: item.email,
      "COMPANY NAME": item.company,
      INDUSTRY: item.industry,
      STATUS: item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
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

  const handleToggleStatus = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? { ...row, status: row.status === "Active" ? "Inactive" : "Active" }
          : row
      )
    );
  };



  const handleView = (row) => console.log("Viewing row:", row);
  const handleEdit = (rowId) => setEditRowId(rowId);
  const handleUpdateEdit = (row) => setEditRowId(null);
  // const handleDelete = (rowId) =>
  //   setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
  const handleAllocate = (rowId) =>
    console.log("Allocating row with ID:", rowId);

  const columns = [
    { field: "id", headerName: "Sr.", flex: 0.2 },
    { field: "name", headerName: "Name", flex: 0.3 },
    { field: "number", headerName: "Number", flex: 0.3 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "company", headerName: "Company Name", flex: 0.4 },
    { field: "industry", headerName: "Industry", flex: 0.3 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      renderCell: (params) => (
        <button
          onClick={() => handleToggleStatus(params.row.id)}
          style={{
            color: params.row.status === "Active" ? "green" : "red", // Conditional text color
            fontWeight: "bold",
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            padding: "5px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            textTransform: "capitalize",
          }}
        >
          {params.row.status}  {/* Button text reflects status */}
        </button>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      renderCell: (params) => {
        const isEditing = params.row.id === editRowId;

        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {isEditing ? (
              <>
                <IconButton
                  color="primary"
                  onClick={() => handleUpdateEdit(params.row)}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => setEditRowId(null)}
                >
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  color="primary"
                  onClick={() => handleView(params.row)}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  sx={{ color: "green" }}
                  onClick={() => handleEdit(params.row.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(params.row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </div>
        );
      },
    },
    {
      field: "allocateAgent",
      headerName: "Allocate",
      flex: 0.3,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleAllocate(params.row.id)}
        >
          <AssignmentIndIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center">
        <h3  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "gray",
  }} >Total Upload Data</h3>
        <div>
          <button
            className="btn btn-primary"
            onClick={handleOpenDialog}
            style={{
              background: "linear-gradient(90deg, #283593, #3F51B5, #283593)",
              color: "#fff",
              marginRight: "10px",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
            }}
          >
            Upload
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-success"
            style={{
              background: "linear-gradient(90deg, #2e7d32, #4caf50, #2e7d32)",
              color: "white",
              marginRight: "10px",
              borderColor: "#4caf50",
              border: "1px solid",
              padding: "8px 16px",
              borderRadius: "4px",
            }}
          >
            Export Data
          </button>
          <button
            className="btn btn-danger"
            style={{
              background: "linear-gradient(90deg, #b71c1c, #d32f2f, #b71c1c)",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
            }}
            onClick={handleDeleteAll} // Attach the delete function
          >
            Delete All
          </button>
        </div>
      </Grid>

      {/* DataGrid */}
      <div
        style={{
          height: 400,
          width: "100%",
          marginTop: "20px",
          overflowX: "auto",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          autoHeight
        />
      </div>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Excel File</DialogTitle>
        <DialogContent>
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              fullWidth
            >
              <MenuItem value="">-- All --</MenuItem>
              <MenuItem value="User1">User 1</MenuItem>
              <MenuItem value="User2">User 2</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: ".xlsx, .xls" }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShowList;
