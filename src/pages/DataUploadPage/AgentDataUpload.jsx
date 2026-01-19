import { useState, useEffect, useContext } from "react";

import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Container,
  Grid,Tooltip,IconButton
} from "@mui/material";
import { maskNumber, clickToCall } from "../../context/Phoneutils";
import { AuthContext } from "../../context/authContext";
import { PopupContext } from "../../context/iframeContext";
import PhoneIcon from "@mui/icons-material/Phone";
import PaginatedGrid from "../Pagination/PaginatedGrid";
import SearchBar from "../../context/searchBar";
import "../list/list.scss";

const AgentDataUpload = () => {
  const [openDialog, setOpenDialog] = useState(false);
    const { user } = useContext(AuthContext);
  const { toggleIframe, updateIframeSrc } = useContext(PopupContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // example: "active", "all"
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `https://${window.location.hostname}:4000/AgentDataUpload `,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setListData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCloseDialog = () => setOpenDialog(false);
  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const handleSave = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", selectedFile);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please login.");
      return;
    }

    try {
      const response = await axios.post(
        `https://${window.location.hostname}:4000/agent_upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Upload Successful! Rows Processed: ${response.data.successCount}`);
    } catch (error) {
      console.error("Upload Failed:", error.response?.data || error.message);
      alert(`Upload Failed: ${error.response?.data?.error || "Server Error"}`);
    }
  };

  const columns = [
    {
      field: "sr",
      headerName: "Sr.",
      flex: 0.2,
      valueGetter: (params) => params.api.getRowIndex(params.row.id) + 1,
    },
    { field: "name", headerName: "Name", flex: 0.3 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "department", headerName: "Department", flex: 0.5 },
{
  field: "phone_number",
  headerName: "Phone Number",
  flex: 0.5,
  renderCell: (params) => {
    const num = params.value || "";
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* ✅ Masked number */}
        <span style={{ marginRight: "8px" }}>{maskNumber(num)}</span>

        {/* ✅ Click to Call */}
        {num && (
          <Tooltip title="Click to Call">
            <IconButton
              onClick={() =>
                clickToCall({
                  number: num,
                  user, // from AuthContext
                  updateIframeSrc,
                  toggleIframe,
                })
              }
              color="primary"
              size="small"
            >
              <PhoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>
    );
  },
},
    { field: "company_name", headerName: "Company Name", flex: 0.4 },
    { field: "industry", headerName: "Industry", flex: 0.3 },
  ];

  const filteredData = listData.filter((item) => {
    if (filter === "active" && item.ACTIVE !== "active") return false;
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.email && item.email.toLowerCase().includes(query)) ||
      (item.department && item.department.toLowerCase().includes(query)) ||
      (item.phone_number &&
        item.phone_number.toString().toLowerCase().includes(query)) ||
      (item.company_name && item.company_name.toLowerCase().includes(query)) ||
      (item.industry && item.industry.toLowerCase().includes(query))
    );
  });

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: "20px" }}
      >
        <Grid item>
          <h3 style={{ fontSize: "24px", margin: 0 }}>Total Upload Data</h3>
        </Grid>

        <Grid item>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <SearchBar
              onSearch={(value) => setSearchQuery(value)}
              placeholder="Search data..."
            />
          </div>
        </Grid>
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
          rows={filteredData}
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
      >
        <DialogTitle>Upload Excel File</DialogTitle>
        <DialogContent>
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

export default AgentDataUpload;
