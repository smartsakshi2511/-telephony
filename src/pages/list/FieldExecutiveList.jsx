import "./list.scss";
import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {  clickToCall } from "../../context/Phoneutils";
import { AuthContext } from "../../context/authContext";
import { PopupContext } from "../../context/iframeContext";
 
import PhoneIcon from "@mui/icons-material/Phone";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import SearchBar from "../../context/searchBar";
import { Close as CloseIcon } from "@mui/icons-material";
import * as XLSX from "xlsx";
import GetAppIcon from "@mui/icons-material/GetApp";
import { toast } from "react-toastify";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider 
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
 
} from "@mui/icons-material";

 

const FieldExecutiveList = () => {
  const [data, setData] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user } = useContext(AuthContext);
  const { toggleIframe, updateIframeSrc } = useContext(PopupContext);
const fieldExecColumns = [
  {
    field: "sr",
    headerName: "SR.",
    flex: 0.3,
    valueGetter: (params) => params.api.getRowIndex(params.id) + 1,
  },
  {
    field: "id",
    headerName: "ID",
    flex: 0.4,
    hide: true,
  },
  {
    field: "name",
    headerName: "NAME",
    flex: 0.4,
  },
  {
    field: "number",
    headerName: "MOBILE",
    flex: 0.6,
    renderCell: (params) => {
      const num = params.value || "";
 

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Masked Number */}
          <span style={{ marginRight: "8px" }}>{num}</span>

          {/* Click-to-Call Button */}
          {num && (
            <Tooltip title="Click to Call">
              <IconButton
                color="primary"
                size="small"
                onClick={() =>
                  clickToCall(num, user, updateIframeSrc, toggleIframe)
                }
              >
                <PhoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "EMAIL",
    flex: 0.4,
  },
];



  const fetchFieldExecutives = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://${window.location.hostname}:4000/fieldExecutive`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching Field Executives:", error);
    }
  };

  useEffect(() => {
    fetchFieldExecutives();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the field executive.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `https://${window.location.hostname}:4000/deleteFieldExecutive/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setData((prev) => prev.filter((item) => item.id !== id));

          Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).fire({
            icon: "success",
            title: "Field executive deleted successfully",
          });
        } catch (err) {
          Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }).fire({
            icon: "error",
            title: "Failed to delete field executive",
          });
        }
      }
    });
  };

  const handleDownloadExcel = () => {
    const excelData = [
      ["Name", "Number", "Email"],
      ["Kabeer A", "78977987767", "abc@gmail.com"],
    ];

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FieldExecutives");
    XLSX.writeFile(wb, "field_executives.xlsx");
  };

  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => setAddDialogOpen(false);

  const handleAddFieldExecutive = (newExecs) => {
    setData((prev) => [...prev, ...newExecs]);
    setAddDialogOpen(false);
  };

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const actionColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 120,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.id)}
          style={{
            padding: "4px",
            border: "2px solid red",
            borderRadius: "6px",
            backgroundColor: "white",
          }}
        >
          <Tooltip title="Delete">
            <DeleteIcon style={{ fontSize: "14px", color: "red" }} />
          </Tooltip>
        </IconButton>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div
        className="datatableTitle"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <b style={{ fontSize: "1.2rem" }}>FIELD EXECUTIVE LIST</b>
        <div style={{ display: "flex", gap: "10px" }}>
          <SearchBar
            onSearch={(val) => setSearchQuery(val)}
            placeholder="Search name..."
          />

          <Tooltip title="Download Excel Template">
            <IconButton
              color="primary"
              onClick={handleDownloadExcel}
              style={{
                padding: "4px",
                border: "2px solid green",
                borderRadius: "6px",
                backgroundColor: "white",
              }}
            >
              <GetAppIcon style={{ fontSize: "20px", color: "green" }} />
            </IconButton>
          </Tooltip>

          <Button variant="contained" onClick={handleOpenAddDialog}>
            Upload
          </Button>
        </div>
      </div>



      <PaginatedGrid
        rows={filteredData}
        columns={fieldExecColumns.concat(actionColumn)}
        getRowId={(row) => row._id || row.id}

      />


      <AddFieldExecutiveDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={handleAddFieldExecutive}
        fetchFieldExecutives={fetchFieldExecutives}   // ✅ yaha pass karo
      />

    </div>
  );
};

const AddFieldExecutiveDialog = ({ open, onClose, onAdd, fetchFieldExecutives }) => {
  const [formValues, setFormValues] = useState({
    fullName: "",
    number: "",
    email: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
const [numberError, setNumberError] = useState("");


 const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Number validation
 // ✅ New Validation
if (formValues.number && (formValues.number.length < 10 || formValues.number.length > 12)) {
  setNumberError("Number must be between 10 and 12 digits");
  return;
}

  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", formValues.fullName);
    formData.append("number", formValues.number);
    formData.append("email", formValues.email);

    if (file) {
      formData.append("file", file);
    }

    const response = await axios.post(
      `https://${window.location.hostname}:4000/employee`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      toast.success("Field Executive added successfully!");
      setFormValues({ fullName: "", number: "", email: "" });
      setFile(null);
      setNumberError(""); // reset number error
      fetchFieldExecutives();
      handleClose();
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to add Field Executive!");
  }
};

  const handleClose = () => {
    setFormValues({ fullName: "", number: "", email: "" });
    setFile(null);
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", padding: 2 }  // dialog ko rounded
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Add User Field Team.
        <IconButton onClick={handleClose} style={{ float: "right" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>

        {/* Row 1 - Full Name + Number */}
        <div style={{ display: "flex", gap: "20px" }}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formValues.fullName}
            onChange={(e) => {
              const value = e.target.value;
              // Sirf alphabets aur space allow
              if (/^[a-zA-Z\s]*$/.test(value)) {
                setFormValues({ ...formValues, [e.target.name]: value });
              }
            }}
            fullWidth
            sx={{ borderRadius: "12px", "& fieldset": { borderRadius: "12px" } }}
          />
          <TextField
            label="Number"
            name="number"
            value={formValues.number}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[0-9]*$/.test(value) && value.length <= 12) {
                setFormValues({ ...formValues, [e.target.name]: value });
                setNumberError(""); // valid input aaya to error hata do
              }
            }}
            error={!!numberError}
            helperText={numberError}
            inputProps={{ minLength: 10, maxLength: 12 }}
            fullWidth
            sx={{ borderRadius: "12px", "& fieldset": { borderRadius: "12px" } }}
          />





        </div>

        {/* Row 2 - Email + File */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <TextField
            label="Email"
            name="email"
            value={formValues.email}
            onChange={(e) =>
              setFormValues({ ...formValues, [e.target.name]: e.target.value })
            }
            fullWidth
            sx={{ borderRadius: "12px", "& fieldset": { borderRadius: "12px" } }}
          />

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              id="file-upload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                sx={{ borderRadius: "12px", padding: "8px 16px" }}
              >
                Choose File
              </Button>
            </label>
            {file && <span style={{ marginLeft: 10, fontSize: "14px" }}>{file.name}</span>}
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ borderRadius: "12px", px: 3 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>

  );
};


export default FieldExecutiveList;
