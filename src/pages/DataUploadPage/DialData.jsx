import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';    
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

const DataChurning = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate(); 
  const { listId } = useParams();
  const [dialedData, setDialedData] = useState([]);
  console.log("List ID:", listId);


  const columns = [
    { field: "id", headerName: "Sr.", flex: 0.2 },
    { field: "name", headerName: "Name", flex: 0.3 },
    { field: "phone_number", headerName: "Number", flex: 0.3 },
    { field: "email", headerName: "Email", flex: 0.4 },
    { field: "company_name", headerName: "Company Name", flex: 0.4 },
    { field: "industry", headerName: "Industry", flex: 0.3 },
    { field: "dial_status", headerName: "Status", flex: 0.3 },
    { field: "username", headerName: "Allocate Agent", flex: 0.3 },
  ];


useEffect(() => {
  const fetchDialedData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get(
        `https://${window.location.hostname}:4000/dialdata/${listId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDialedData(
        response.data.data.map((row, index) => ({
          ...row,
          id: row.id || index + 1, 
        }))
      );
    } catch (error) {
      console.error("Error fetching dialed data:", error.response || error.message);
    }
  };

  if (listId) {
    fetchDialedData();
  }
}, [listId]);

  

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const onBack = () => {
    navigate(`/admin/dataupload/showlist/${listId}`);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Grid
  container
  alignItems="center"
  justifyContent="space-between"
  style={{ marginBottom: "20px" }}
>
  <Grid item>
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton onClick={onBack}>
        <ArrowBackIcon />
      </IconButton>
      <h3
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "gray",
          margin: 0,
        }}
      >
        Total Dialed Data
      </h3>
    </Box>
  </Grid>

  <Grid item>
    <Box display="flex" gap={1} flexWrap="wrap">
      <Button
        variant="contained"
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
        onClick={handleOpenDialog}
        sx={{
          backgroundColor: "#17a2b8",
          color: "white",
          padding: "8px 16px",
          borderRadius: "4px",
          textTransform: "none",
        }}
      >
        Data Churning
      </Button>
    </Box>
  </Grid>
</Grid>


      <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
        <DataGrid
          rows={dialedData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px" } }}
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
                  onChange={(e) => setSelectedUsers(e.target.value)}
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
                  <MenuItem value={"user1"}>user1</MenuItem>
                  <MenuItem value={"user2"}>user2</MenuItem>
                  <MenuItem value={"user3"}>user3</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                component="label"
                sx={{ height: "45px", borderRadius: "15px", textTransform: "none" }}
              >
                {selectedFile ? selectedFile.name : "Choose File"}
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  hidden
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="secondary"
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
            disabled={!selectedFile}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DataChurning;
